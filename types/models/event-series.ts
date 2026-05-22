import mongoose, { Schema, Document } from 'mongoose';

export interface IEventSeries extends Document {
  title: string;
  description: string;
  studproCycles: mongoose.Types.ObjectId[];
  events: mongoose.Types.ObjectId[];
}

const EventSeriesSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: String,
  studproCycles: [{ type: Schema.Types.ObjectId, ref: 'StudproCycle' }],
  events: [{ type: Schema.Types.ObjectId, ref: 'Event' }]
});

export default mongoose.model<IEventSeries>('EventSeries', EventSeriesSchema);
