import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/**
 * Health check endpoint for platform monitoring.
 * Returns sanitized service status without exposing database internals or stack traces.
 */
export async function GET(req: NextRequest) {
	try {
		const supabase = createAdminClient();

		// Lightweight probe to verify database connectivity
		const { error } = await supabase
			.from("studpro_cycles")
			.select("id")
			.limit(1);

		if (error) {
			console.error("[HEALTH CHECK ERROR] Supabase connection failure:", error.message);
			return NextResponse.json(
				{
					status: "degraded",
					service: "studpro-platform",
					healthy: false,
					timestamp: new Date().toISOString(),
				},
				{ status: 503 },
			);
		}

		return NextResponse.json({
			status: "healthy",
			service: "studpro-platform",
			healthy: true,
			timestamp: new Date().toISOString(),
		});
	} catch (error) {
		console.error("[HEALTH CHECK ERROR] Exception during database ping:", error);
		return NextResponse.json(
			{
				status: "error",
				service: "studpro-platform",
				healthy: false,
				timestamp: new Date().toISOString(),
			},
			{ status: 500 },
		);
	}
}

