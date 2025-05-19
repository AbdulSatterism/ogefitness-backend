import { Document, Types } from 'mongoose';

export interface IChatMessage extends Document {
  userId: Types.ObjectId;
  sessionId: string;
  role: 'question' | 'answer';
  message: string;
}
