import mongoose, { Schema, Document } from 'mongoose';

export interface IStudproCycle extends Document {
  studproVersion: string;
  year: number;
  description: string;
  eventSeries: mongoose.Types.ObjectId[];
  ocMembers: mongoose.Types.ObjectId[];
}

const StudproCycleSchema: Schema = new Schema({
  studproVersion: { type: String, required: true },
  year: { type: Number, required: true },
  description: String,
  eventSeries: [{ type: Schema.Types.ObjectId, ref: 'EventSeries' }],
  ocMembers: [{ type: Schema.Types.ObjectId, ref: 'OCMember' }]
});

export default mongoose.models.StudproCycle || mongoose.model<IStudproCycle>('StudproCycle', StudproCycleSchema);
