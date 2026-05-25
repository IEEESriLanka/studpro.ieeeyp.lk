import { Document, Model, Schema, Types, model, models } from "mongoose";

export interface IOcMember extends Document {
	_id: Types.ObjectId;
	name: string;
	position: string;
	email: string;
	phoneNo: string;
	linkedinUrl?: string;
	imgUrl?: string;
}

const ocMemberSchema = new Schema<IOcMember>(
	{
		name: { type: String, required: true, trim: true },
		position: { type: String, required: true, trim: true },
		email: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			trim: true,
		},
		phoneNo: { type: String, required: true, trim: true },
		linkedinUrl: { type: String, trim: true },
		imgUrl: { type: String, trim: true },
	},
	{ collection: "ocMembers", timestamps: true },
);

const OcMember: Model<IOcMember> =
	(models.OcMember as Model<IOcMember>) ||
	model<IOcMember>("OcMember", ocMemberSchema);

export default OcMember;
