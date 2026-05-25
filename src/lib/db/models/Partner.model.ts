import { Document, Model, Schema, Types, model, models } from "mongoose";
import { PARTNER_TYPES, PartnerType } from "../enums/partner-type.enum";

export type { PartnerType };

export interface IPartner extends Document {
	_id: Types.ObjectId;
	name: string;
	title?: string;
	logoUrl?: string;
	webUrl?: string;
	type: PartnerType;
}

const partnerSchema = new Schema<IPartner>(
	{
		name: { type: String, required: true, trim: true },
		title: { type: String, trim: true },
		logoUrl: { type: String, trim: true },
		webUrl: { type: String, trim: true },
		// Categorizes the partner for filtering and display purposes
		type: {
			type: String,
			required: true,
			enum: PARTNER_TYPES,
		},
	},
	{ collection: "partners", timestamps: true },
);

partnerSchema.index({ type: 1 });

const Partner: Model<IPartner> =
	(models.Partner as Model<IPartner>) ||
	model<IPartner>("Partner", partnerSchema);

export default Partner;
