import mongoose, { Schema, Document } from 'mongoose'

export type WASessionStatus = 'active' | 'paused' | 'completed' | 'dropped'

export interface IWhatsAppSession extends Document {
  phone: string                // E.164 format: +2348012345678
  waId: string                 // WhatsApp message sender ID
  user?: mongoose.Types.ObjectId

  // Learning state
  currentCourse: string        // courseSlug
  currentLesson: number        // lesson index (0-based)
  totalLessons: number
  completedLessons: number[]
  xpEarned: number

  // Session state
  status: WASessionStatus
  lastMessageAt: Date
  lastBotMessage?: string
  lastUserMessage?: string
  messageCount: number

  // Conversation context
  awaitingAnswer: boolean
  currentQuestion?: string
  quizStreak: number

  // Onboarding
  isOnboarded: boolean
  name?: string
  country?: string
  language: 'en' | 'fr' | 'sw' | 'ha' | 'yo'  // English, French, Swahili, Hausa, Yoruba

  createdAt: Date
  updatedAt: Date
}

const WhatsAppSessionSchema = new Schema<IWhatsAppSession>(
  {
    phone: { type: String, required: true, trim: true },
    waId: { type: String, required: true, unique: true, trim: true },
    user: { type: Schema.Types.ObjectId, ref: 'User' },

    currentCourse: { type: String, default: 'ai-beginners-africa' },
    currentLesson: { type: Number, default: 0 },
    totalLessons: { type: Number, default: 10 },
    completedLessons: [{ type: Number }],
    xpEarned: { type: Number, default: 0 },

    status: {
      type: String,
      enum: ['active', 'paused', 'completed', 'dropped'],
      default: 'active',
    },
    lastMessageAt: { type: Date, default: Date.now },
    lastBotMessage: { type: String },
    lastUserMessage: { type: String },
    messageCount: { type: Number, default: 0 },

    awaitingAnswer: { type: Boolean, default: false },
    currentQuestion: { type: String },
    quizStreak: { type: Number, default: 0 },

    isOnboarded: { type: Boolean, default: false },
    name: { type: String },
    country: { type: String },
    language: {
      type: String,
      enum: ['en', 'fr', 'sw', 'ha', 'yo'],
      default: 'en',
    },
  },
  { timestamps: true }
)

WhatsAppSessionSchema.index({ phone: 1 })
WhatsAppSessionSchema.index({ waId: 1 })
WhatsAppSessionSchema.index({ status: 1 })
WhatsAppSessionSchema.index({ lastMessageAt: -1 })

export default mongoose.models.WhatsAppSession ||
  mongoose.model<IWhatsAppSession>('WhatsAppSession', WhatsAppSessionSchema)
