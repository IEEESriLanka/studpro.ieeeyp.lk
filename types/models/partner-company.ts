import mongoose, { Schema, Document } from 'mongoose';

export interface IPartnerCompany extends Document {
  name: string;
  partnerTitle: string;
  webLink: string;
  logo: string;
  events: mongoose.Types.ObjectId[];
}

const PartnerCompanySchema: Schema = new Schema({
  name: { type: String, required: true },
  partnerTitle: String,
  webLink: String,
  logo: String,
  events: [{ type: Schema.Types.ObjectId, ref: 'Event' }]
});

export default mongoose.model<IPartnerCompany>('PartnerCompany', PartnerCompanySchema);
