import mongoose, { Schema, Document } from 'mongoose'

export interface IChallengeParticipant extends Document {
  user: mongoose.Types.ObjectId
  userName: string
  userCountry: string
  challengeId: string          // e.g. '2026-Q1' — supports multiple cohorts
  joinedAt: Date
  currentDay: number           // 1-30, day they're on
  completedDays: number[]      // which days they've marked done [1,2,3,...]
  lastCompletedAt?: Date
  streak: number               // consecutive days completed
  totalXpEarned: number
  isCompleted: boolean         // all 30 days done
  completedAt?: Date
  rank?: number                // computed on leaderboard query
  notes: string[]              // optional daily notes array (index = day-1)
  shareCount: number           // times user shared progress
  hasSocialBadge: boolean      // earned "Challenge Sharer" badge
  isWinner: boolean            // top-10 completer
}

const ChallengeParticipantSchema = new Schema<IChallengeParticipant>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    userName: { type: String, required: true },
    userCountry: { type: String, default: 'Africa' },
    challengeId: { type: String, required: true, default: '2026-Q2' },
    joinedAt: { type: Date, default: Date.now },
    currentDay: { type: Number, default: 1, min: 1, max: 30 },
    completedDays: [{ type: Number }],
    lastCompletedAt: { type: Date },
    streak: { type: Number, default: 0 },
    totalXpEarned: { type: Number, default: 0 },
    isCompleted: { type: Boolean, default: false },
    completedAt: { type: Date },
    notes: [{ type: String, default: '' }],
    shareCount: { type: Number, default: 0 },
    hasSocialBadge: { type: Boolean, default: false },
    isWinner: { type: Boolean, default: false },
  },
  { timestamps: true }
)

// One entry per user per cohort
ChallengeParticipantSchema.index({ user: 1, challengeId: 1 }, { unique: true })
ChallengeParticipantSchema.index({ challengeId: 1, totalXpEarned: -1 })
ChallengeParticipantSchema.index({ challengeId: 1, isCompleted: 1 })

export default mongoose.models.ChallengeParticipant ||
  mongoose.model<IChallengeParticipant>('ChallengeParticipant', ChallengeParticipantSchema)
