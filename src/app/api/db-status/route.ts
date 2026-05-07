import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase, StudPro, PartnerCompany } from "@/lib/db/mongodb";

export async function GET(req: NextRequest) {
	try {
		// Connect to the database
		await connectToDatabase();

		// Perform a simple database check to test the connection
		const isConnected = StudPro.db.readyState === 1;

		return NextResponse.json({
			status: "success",
			message: isConnected
				? "Connected to MongoDB"
				: "Failed to connect to MongoDB",
			dbStatus: isConnected ? "connected" : "disconnected",
		});
	} catch (error) {
		console.error("Database connection error:", error);
		return NextResponse.json(
			{
				status: "error",
				message: "Failed to connect to MongoDB",
				error: (error as Error).message,
			},
			{ status: 500 },
		);
	}
}
