/**
 * Comprehensive Automated Security & Resilience Verification Suite
 * Tests HTTP endpoints, admin route protection, security headers, rate limiting, and 404 handling.
 */

import { checkRateLimit, recordFailedAttempt, clearRateLimit } from "../src/lib/rate-limiter";
import { ADMIN_SESSION_CONFIG, checkSessionExpiry } from "../src/lib/constants/auth";

const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:3000";

interface TestResult {
	name: string;
	passed: boolean;
	details?: string;
}

const results: TestResult[] = [];

function assert(condition: boolean, name: string, details?: string) {
	if (condition) {
		results.push({ name, passed: true });
		console.log(`  ✅ PASS: ${name}`);
	} else {
		results.push({ name, passed: false, details });
		console.error(`  ❌ FAIL: ${name} (${details || "Assertion failed"})`);
	}
}

async function testPublicEndpoints() {
	console.log("\n🌐 1. Testing Public Endpoints Integrity...");

	const routes = ["/", "/about-us", "/events", "/partners"];
	for (const route of routes) {
		try {
			const res = await fetch(`${BASE_URL}${route}`);
			assert(res.status === 200, `Public route ${route} returns 200 OK`, `Status: ${res.status}`);
		} catch (err: any) {
			assert(false, `Public route ${route} accessible`, err.message);
		}
	}
}

async function testCustom404() {
	console.log("\n🔍 2. Testing Custom 404 Error Handling...");
	try {
		const res = await fetch(`${BASE_URL}/non-existent-page-xyz-98765`);
		assert(res.status === 404, "Unknown path returns 404 status code", `Status: ${res.status}`);
		const text = await res.text();
		assert(text.includes("404") || text.includes("Page Not Found"), "Response contains branded 404 content");
	} catch (err: any) {
		assert(false, "404 page responds properly", err.message);
	}
}

async function testAdminRouteProtection() {
	console.log("\n🛡️ 3. Testing Admin Route RBAC Guards (Unauthenticated Access)...");

	const adminRoutes = [
		"/admin",
		"/admin/admins",
		"/admin/events",
		"/admin/partners",
		"/admin/team",
		"/admin/cycles",
		"/admin/logs",
	];

	for (const route of adminRoutes) {
		try {
			const res = await fetch(`${BASE_URL}${route}`, {
				redirect: "manual", // Do not follow redirects to verify HTTP 307
			});

			const isRedirect = res.status === 307 || res.status === 302 || res.status === 308;
			const location = res.headers.get("location") || "";
			const redirectsToLogin = location.includes("/admin/login");

			assert(
				isRedirect && redirectsToLogin,
				`Guarded route ${route} redirects to /admin/login`,
				`Status: ${res.status}, Location: ${location}`,
			);
		} catch (err: any) {
			assert(false, `Route ${route} guard check`, err.message);
		}
	}
}

async function testSecurityHeaders() {
	console.log("\n🔒 4. Testing HTTP Security Headers...");
	try {
		const res = await fetch(`${BASE_URL}/`);
		const headers = res.headers;

		const xFrame = headers.get("x-frame-options");
		assert(xFrame === "DENY", "X-Frame-Options is set to DENY", `Got: ${xFrame}`);

		const xContentType = headers.get("x-content-type-options");
		assert(xContentType === "nosniff", "X-Content-Type-Options is set to nosniff", `Got: ${xContentType}`);

		const referrer = headers.get("referrer-policy");
		assert(
			referrer === "strict-origin-when-cross-origin",
			"Referrer-Policy is strict-origin-when-cross-origin",
			`Got: ${referrer}`,
		);

		const permissions = headers.get("permissions-policy");
		assert(!!permissions, "Permissions-Policy header is configured", `Got: ${permissions}`);
	} catch (err: any) {
		assert(false, "Security headers check", err.message);
	}
}

async function testHealthCheckEndpoint() {
	console.log("\n🩺 5. Testing Sanitized Database Health Check...");
	try {
		const res = await fetch(`${BASE_URL}/api/db-status`);
		assert(res.status === 200, "/api/db-status returns 200 OK", `Status: ${res.status}`);

		const json = await res.json();
		assert(json.healthy === true, "Health check reports healthy: true");
		assert(!json.error, "Health check does not leak database error strings");
		assert(!json.message || !json.message.includes("PostgreSQL"), "No internal DB driver strings leaked");
	} catch (err: any) {
		assert(false, "Health check endpoint test", err.message);
	}
}

function testRateLimiterLogic() {
	console.log("\n⏱️ 6. Testing Brute-Force Rate Limiter Logic...");

	const testKey = "test:verify:ip";
	clearRateLimit(testKey);

	// Initial check should be allowed with 5 remaining
	const initial = checkRateLimit(testKey, 5, 60000);
	assert(initial.allowed && initial.remaining === 5, "Initial rate limit check allows attempt");

	// Record 4 failed attempts
	for (let i = 0; i < 4; i++) {
		recordFailedAttempt(testKey);
	}

	const middle = checkRateLimit(testKey, 5, 60000);
	assert(middle.allowed && middle.remaining === 1, "Rate limit reflects 1 remaining attempt");

	// Record 5th failed attempt -> should be blocked
	recordFailedAttempt(testKey);
	const blocked = checkRateLimit(testKey, 5, 60000);
	assert(!blocked.allowed && blocked.remaining === 0, "5th failed attempt triggers lockout");

	// Clear and verify reset
	clearRateLimit(testKey);
	const reset = checkRateLimit(testKey, 5, 60000);
	assert(reset.allowed && reset.remaining === 5, "Clearing rate limit resets allowance");
}

async function testAdminSessionSecurity() {
	console.log("\n⏳ 7. Testing Admin Session Expiration & Inactivity Guard...");

	// 1. Validate configuration constants
	assert(
		ADMIN_SESSION_CONFIG.IDLE_TIMEOUT_SECONDS === 7200,
		"Admin session idle timeout is configured to 2 hours (7,200s)",
		`Got: ${ADMIN_SESSION_CONFIG.IDLE_TIMEOUT_SECONDS}`,
	);
	assert(
		ADMIN_SESSION_CONFIG.ABSOLUTE_TIMEOUT_SECONDS === 43200,
		"Admin session absolute lifetime is configured to 12 hours (43,200s)",
		`Got: ${ADMIN_SESSION_CONFIG.ABSOLUTE_TIMEOUT_SECONDS}`,
	);
	assert(
		ADMIN_SESSION_CONFIG.COOKIE_MAX_AGE_SECONDS === 43200,
		"Auth cookie max-age is hardened to 12 hours (43,200s)",
		`Got: ${ADMIN_SESSION_CONFIG.COOKIE_MAX_AGE_SECONDS}`,
	);

	// 2. Validate session expiration evaluator logic
	const now = Date.now();

	// Case A: Active within last 30 minutes -> valid
	const recentActive = (now - 30 * 60 * 1000).toString();
	const recentStart = (now - 60 * 60 * 1000).toString();
	const activeStatus = checkSessionExpiry(recentActive, recentStart, now);
	assert(!activeStatus.isExpired, "Recent active session (< 2 hours) is NOT expired");

	// Case B: Inactive for 2 hours and 5 minutes -> idle expired
	const idleExpiredActive = (now - (2 * 60 * 60 * 1000 + 5 * 60 * 1000)).toString();
	const idleStatus = checkSessionExpiry(idleExpiredActive, recentStart, now);
	assert(
		idleStatus.isExpired && idleStatus.reason === "idle_timeout",
		"Inactive session (> 2 hours) triggers idle_timeout expiration",
		`Got: ${JSON.stringify(idleStatus)}`,
	);

	// Case C: Active 5 minutes ago but session started 13 hours ago -> absolute lifetime expired
	const active5mAgo = (now - 5 * 60 * 1000).toString();
	const session13hAgo = (now - 13 * 60 * 60 * 1000).toString();
	const absoluteStatus = checkSessionExpiry(active5mAgo, session13hAgo, now);
	assert(
		absoluteStatus.isExpired && absoluteStatus.reason === "absolute_timeout",
		"Session older than 12 hours triggers absolute_timeout expiration",
		`Got: ${JSON.stringify(absoluteStatus)}`,
	);

	// Case D: Missing / corrupt timestamps handled gracefully
	const emptyStatus = checkSessionExpiry(null, null, now);
	assert(!emptyStatus.isExpired, "Null timestamps handled gracefully without throwing");

	const corruptStatus = checkSessionExpiry("invalid-timestamp", "corrupt", now);
	assert(!corruptStatus.isExpired, "Corrupt timestamps handled gracefully without throwing");

	// 3. Validate login page rendering of session expired message
	try {
		const res = await fetch(`${BASE_URL}/admin/login?error=session_expired&reason=idle_timeout`);
		assert(res.status === 200, "/admin/login?error=session_expired returns 200 OK", `Status: ${res.status}`);
		const text = await res.text();
		assert(
			text.includes("Session Expired") && text.includes("inactivity"),
			"Login page renders branded 'Session Expired' notice upon timeout redirect",
		);
	} catch (err: any) {
		assert(false, "Login session expired UI check", err.message);
	}
}

async function main() {
	console.log("==================================================================");
	console.log(" StudPro Platform: Automated Security & Resilience Test Suite");
	console.log(` Target Server: ${BASE_URL}`);
	console.log("==================================================================");

	testRateLimiterLogic();
	await testAdminSessionSecurity();
	await testPublicEndpoints();
	await testCustom404();
	await testAdminRouteProtection();
	await testSecurityHeaders();
	await testHealthCheckEndpoint();

	console.log("\n==================================================================");
	const passedCount = results.filter((r) => r.passed).length;
	const totalCount = results.length;
	console.log(` Verification Summary: ${passedCount}/${totalCount} tests passed`);
	console.log("==================================================================");

	if (passedCount < totalCount) {
		console.error("❌ Some verification checks failed!");
		process.exit(1);
	} else {
		console.log("🎉 All security and resilience verifications PASSED successfully!");
		process.exit(0);
	}
}

main().catch((err) => {
	console.error("Fatal test suite error:", err);
	process.exit(1);
});
