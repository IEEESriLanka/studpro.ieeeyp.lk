import { Document, Model, Schema, Types, model, models } from "mongoose";

export interface IEventSeries extends Document {
	_id: Types.ObjectId;
	title: string;
	description: string;
	// Partner organizations involved across the entire series
	partnerIds: Types.ObjectId[];
}

const eventSeriesSchema = new Schema<IEventSeries>(
	{
		title: { type: String, required: true, trim: true },
		description: { type: String, required: true, trim: true },
		partnerIds: {
			type: [Schema.Types.ObjectId],
			ref: "Partner",
			default: [],
		},
	},
	{ collection: "eventSeries", timestamps: true },
);

const EventSeries: Model<IEventSeries> =
	(models.EventSeries as Model<IEventSeries>) ||
	model<IEventSeries>("EventSeries", eventSeriesSchema);

export default EventSeries;
