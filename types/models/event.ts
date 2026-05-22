import mongoose, { Schema, Document } from 'mongoose';

export interface IEvent extends Document {
  title: string;
  date: Date;
  time: string;
  venue: string;
  description: string;
  images: string[];
  eventSeries: mongoose.Types.ObjectId;
  speakers: mongoose.Types.ObjectId[];
  partnerCompanies: mongoose.Types.ObjectId[];
}

const EventSchema: Schema = new Schema({
  title: { type: String, required: true },
  date: { type: Date, required: true },
  time: String,
  venue: String,
  description: String,
  images: [String],
  eventSeries: { type: Schema.Types.ObjectId, ref: 'EventSeries' },
  speakers: [{ type: Schema.Types.ObjectId, ref: 'Speaker' }],
  partnerCompanies: [{ type: Schema.Types.ObjectId, ref: 'PartnerCompany' }]
});

export default mongoose.model<IEvent>('Event', EventSchema);
