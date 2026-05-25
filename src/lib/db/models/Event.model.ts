import { Document, Model, Schema, Types, model, models } from "mongoose";
import { EVENT_CATEGORIES, EventCategory } from "../enums/event-category.enum";

export type { EventCategory };

export interface IEvent extends Document {
	_id: Types.ObjectId;
	title: string;
	description: string;
	category: EventCategory;
	date: Date;
	time: string;
	venue: string;
	locationUrl?: string;
	mainImgUrl?: string;
	galleryUrls: string[];
	speakerId?: Types.ObjectId;
	// When set, partnerIds holds only collaborators specific to this event (not the series-level partners)
	seriesId?: Types.ObjectId;
	partnerIds: Types.ObjectId[];
}

const eventSchema = new Schema<IEvent>(
	{
		title: { type: String, required: true, trim: true },
		description: { type: String, required: true, trim: true },
		category: {
			type: String,
			required: true,
			enum: EVENT_CATEGORIES,
		},
		date: { type: Date, required: true },
		time: { type: String, required: true, trim: true },
		venue: { type: String, required: true, trim: true },
		locationUrl: { type: String, trim: true },
		mainImgUrl: { type: String, trim: true },
		galleryUrls: { type: [String], default: [] },
		speakerId: { type: Schema.Types.ObjectId, ref: "Speaker" },
		seriesId: { type: Schema.Types.ObjectId, ref: "EventSeries" },
		partnerIds: {
			type: [Schema.Types.ObjectId],
			ref: "Partner",
			default: [],
		},
	},
	{ collection: "events", timestamps: true },
);

eventSchema.index({ category: 1 });
eventSchema.index({ date: -1 });
eventSchema.index({ seriesId: 1 });

const Event: Model<IEvent> =
	(models.Event as Model<IEvent>) || model<IEvent>("Event", eventSchema);

export default Event;
