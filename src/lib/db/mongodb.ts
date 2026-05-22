import mongoose from "mongoose";

declare global {
	// Using var is necessary for properties on the global object
	// eslint-disable-next-line no-var
	var mongooseConnection: {
		conn: typeof mongoose | null;
		promise: Promise<typeof mongoose> | null;
	};
}

// Initialize global mongoose connection if not already initialized
global.mongooseConnection = global.mongooseConnection || {
	conn: null,
	promise: null,
};

/**
 * Connect to MongoDB database using a cached connection
 * @returns A Promise resolving to the mongoose instance
 */
export async function connectToDatabase(): Promise<typeof mongoose> {
	// If connection already exists, return it
	if (global.mongooseConnection.conn) {
		return global.mongooseConnection.conn;
	}

	// Use environment variables for MongoDB URI and database name
	const MONGODB_URI = process.env.MONGODB_URI;
	const DB_NAME = process.env.DB_NAME;

	if (!MONGODB_URI) {
		throw new Error("Please define the MONGODB_URI environment variable");
	}

	if (!DB_NAME) {
		throw new Error("Please define the DB_NAME environment variable");
	}

	// If no connection promise exists, create one
	if (!global.mongooseConnection.promise) {
		const opts = {
			bufferCommands: false,
			dbName: DB_NAME, // Specify the database name here
		};

		// Create a new connection promise
		global.mongooseConnection.promise = mongoose
			.connect(MONGODB_URI, opts)
			.then((mongoose) => {
				console.log(`Connected to MongoDB database: ${DB_NAME}`);
				return mongoose;
			})
			.catch((error) => {
				console.error("Error connecting to MongoDB:", error);
				throw error;
			});
	}

	// Wait for connection to establish and set global connection
	global.mongooseConnection.conn = await global.mongooseConnection.promise;
	return global.mongooseConnection.conn;
}
