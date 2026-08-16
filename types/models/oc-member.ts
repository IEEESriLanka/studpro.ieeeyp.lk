import mongoose, { Schema, Document } from 'mongoose';

export interface IOCMember extends Document {
  name: string;
  title: string;
  studproCycles: mongoose.Types.ObjectId[];
}

const OCMemberSchema: Schema = new Schema({
  name: { type: String, required: true },
  title: String,
  studproCycles: [{ type: Schema.Types.ObjectId, ref: 'StudproCycle' }]
});

export default mongoose.models.OCMember || mongoose.model<IOCMember>('OCMember', OCMemberSchema);
