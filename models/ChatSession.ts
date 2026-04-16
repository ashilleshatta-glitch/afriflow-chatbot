import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export interface IChatSession extends Document {
  userId?: mongoose.Types.ObjectId; // Optional for anonymous users
  sessionId: string; // Unique ID for anonymous tracking
  messages: IMessage[];
  contextData?: Record<string, any>; // Extra context (e.g. current page, selected course)
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>({
  role: { type: String, enum: ['user', 'assistant', 'system'], required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
}, { _id: false });

const ChatSessionSchema = new Schema<IChatSession>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: false },
    sessionId: { type: String, required: true, index: true },
    messages: [MessageSchema],
    contextData: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

// Auto-delete sessions after 90 days as per the architectural plan
ChatSessionSchema.index({ updatedAt: 1 }, { expireAfterSeconds: 90 * 24 * 60 * 60 });

export const ChatSession: Model<IChatSession> = mongoose.models.ChatSession || mongoose.model<IChatSession>('ChatSession', ChatSessionSchema);
