import mongoose, { Schema, Document } from 'mongoose';

export interface ISpeaker extends Document {
  name: string;
  title: string;
  socialLinks: string[];
  events: mongoose.Types.ObjectId[];
  partnerCompany: mongoose.Types.ObjectId;
}

const SpeakerSchema: Schema = new Schema({
  name: { type: String, required: true },
  title: String,
  socialLinks: [String],
  events: [{ type: Schema.Types.ObjectId, ref: 'Event' }],
  partnerCompany: { type: Schema.Types.ObjectId, ref: 'PartnerCompany' }
});

export default mongoose.model<ISpeaker>('Speaker', SpeakerSchema);
