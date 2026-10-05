import { headers } from "next/headers";
import { createAdminClient } from "@/lib/supabase/server";

export type LogCategory = "AUTH" | "SECURITY" | "DATA_MUTATION" | "SYSTEM";
export type LogSeverity = "INFO" | "WARN" | "CRITICAL";

export interface AuditLogEntry {
	action: string;
	category: LogCategory;
	severity?: LogSeverity;
	details?: Record<string, any>;
	actorId?: string | null;
	actorEmail?: string | null;
	actorRole?: string | null;
	ipAddress?: string | null;
	userAgent?: string | null;
}

export interface StoredAuditLog {
	id: string;
	actor_id: string | null;
	actor_email: string | null;
	actor_role: string | null;
	action: string;
	category: LogCategory;
	severity: LogSeverity;
	details: Record<string, any>;
	ip_address: string | null;
	created_at: string;
}

/**
 * Extracts client IP and User-Agent from incoming Next.js request headers.
 */
export async function getClientMetadata(): Promise<{ ipAddress: string; userAgent: string }> {
	try {
		const headerList = await headers();
		const forwarded = headerList.get("x-forwarded-for");
		const ipAddress = forwarded
			? forwarded.split(",")[0].trim()
			: headerList.get("x-real-ip") || "127.0.0.1";
		const userAgent = headerList.get("user-agent") || "unknown";
		return { ipAddress, userAgent };
	} catch {
		return { ipAddress: "system", userAgent: "server-internal" };
	}
}

/**
 * Records a security or system event into the PostgreSQL audit_logs table
 * and emits a structured server log.
 */
export async function logAuditEvent(entry: AuditLogEntry): Promise<void> {
	const severity = entry.severity || "INFO";
	const timestamp = new Date().toISOString();

	let ip = entry.ipAddress;
	let ua = entry.userAgent;

	if (!ip || !ua) {
		const clientMeta = await getClientMetadata();
		if (!ip) ip = clientMeta.ipAddress;
		if (!ua) ua = clientMeta.userAgent;
	}

	// 1. Structured Console Log
	const logPrefix = `[AUDIT ${severity}][${entry.category}]`;
	const actorInfo = entry.actorEmail ? `by ${entry.actorEmail} (${entry.actorRole || "unknown"})` : "anonymous";
	console.log(`${timestamp} ${logPrefix} ${entry.action} ${actorInfo} [${ip}]`, entry.details || {});

	// 2. Persist to Supabase audit_logs
	try {
		const adminClient = createAdminClient();
		const { error } = await adminClient.from("audit_logs").insert({
			actor_id: entry.actorId || null,
			actor_email: entry.actorEmail || null,
			actor_role: entry.actorRole || null,
			action: entry.action,
			category: entry.category,
			severity,
			details: entry.details || {},
			ip_address: ip || null,
			user_agent: ua || null,
		});

		if (error) {
			console.warn("[AUDIT LOG WARNING] Failed to persist audit log to Supabase:", error.message);
		}
	} catch (err) {
		console.warn("[AUDIT LOG ERROR] Exception while persisting audit log:", err);
	}
}

/**
 * Retrieves the most recent audit logs for the Admin Dashboard security feed.
 */
export async function getRecentAuditLogs(limit: number = 8): Promise<StoredAuditLog[]> {
	try {
		const adminClient = createAdminClient();
		const { data, error } = await adminClient
			.from("audit_logs")
			.select("*")
			.order("created_at", { ascending: false })
			.limit(limit);

		if (error || !data) {
			return [];
		}

		return data as StoredAuditLog[];
	} catch (err) {
		console.error("Failed to fetch recent audit logs:", err);
		return [];
	}
}
