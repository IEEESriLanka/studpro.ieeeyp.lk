import { Document, Model, Schema, Types, model, models } from "mongoose";

export interface ISpeaker extends Document {
	_id: Types.ObjectId;
	name: string;
	title?: string;
	linkedinUrl?: string;
	imgUrl?: string;
	// References the partner company this speaker is affiliated with
	companyId?: Types.ObjectId;
}

const speakerSchema = new Schema<ISpeaker>(
	{
		name: { type: String, required: true, trim: true },
		title: { type: String, trim: true },
		linkedinUrl: { type: String, trim: true },
		imgUrl: { type: String, trim: true },
		companyId: { type: Schema.Types.ObjectId, ref: "Partner" },
	},
	{ collection: "speakers", timestamps: true },
);

const Speaker: Model<ISpeaker> =
	(models.Speaker as Model<ISpeaker>) ||
	model<ISpeaker>("Speaker", speakerSchema);

export default Speaker;
