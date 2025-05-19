import { Schema, model } from 'mongoose';
import { IChatMessage } from './chatMessage.interface';

const chatMessageSchema = new Schema<IChatMessage>(
  {
    userId: { type: Schema.Types.ObjectId, required: true },
    sessionId: { type: String, required: true, index: true },
    role: { type: String, enum: ['question', 'answer'], required: true },
    message: { type: String, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

chatMessageSchema.index({ userId: 1, sessionId: 1 });

export const ChatMessage = model<IChatMessage>(
  'ChatMessage',
  chatMessageSchema,
);
