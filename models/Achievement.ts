import mongoose, { Document, Schema } from 'mongoose'

export interface IAchievement extends Document {
  user: mongoose.Types.ObjectId
  badgeId: string
  title: string
  description: string
  icon: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  category: 'learning' | 'streak' | 'social' | 'milestone' | 'special'
  xpAwarded: number
  unlockedAt: Date
}

const AchievementSchema = new Schema<IAchievement>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  badgeId: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, required: true },
  rarity: { type: String, enum: ['common', 'rare', 'epic', 'legendary'], default: 'common' },
  category: { type: String, enum: ['learning', 'streak', 'social', 'milestone', 'special'], default: 'learning' },
  xpAwarded: { type: Number, default: 0 },
  unlockedAt: { type: Date, default: Date.now },
}, {
  timestamps: true,
})

AchievementSchema.index({ user: 1, badgeId: 1 }, { unique: true })

export const BADGE_DEFINITIONS = [
  // Learning
  { badgeId: 'first-enrollment', title: 'First Step', description: 'Enrolled in your first course', icon: '🎯', rarity: 'common' as const, category: 'learning' as const, xp: 25 },
  { badgeId: 'three-courses', title: 'Triple Learner', description: 'Enrolled in 3 courses', icon: '📚', rarity: 'rare' as const, category: 'learning' as const, xp: 75 },
  { badgeId: 'five-courses', title: 'Knowledge Seeker', description: 'Enrolled in 5 courses', icon: '🎓', rarity: 'epic' as const, category: 'learning' as const, xp: 150 },
  { badgeId: 'first-completion', title: 'Finisher', description: 'Completed your first course', icon: '✅', rarity: 'rare' as const, category: 'learning' as const, xp: 100 },
  { badgeId: 'three-completions', title: 'Hat Trick', description: 'Completed 3 courses', icon: '🏅', rarity: 'epic' as const, category: 'learning' as const, xp: 200 },
  { badgeId: 'ten-lessons', title: 'Lesson Legend', description: 'Completed 10 lessons', icon: '📖', rarity: 'common' as const, category: 'learning' as const, xp: 50 },
  { badgeId: 'fifty-lessons', title: 'Unstoppable', description: 'Completed 50 lessons', icon: '🚀', rarity: 'epic' as const, category: 'learning' as const, xp: 250 },

  // Streak
  { badgeId: 'streak-3', title: 'Warming Up', description: '3-day learning streak', icon: '🔥', rarity: 'common' as const, category: 'streak' as const, xp: 30 },
  { badgeId: 'streak-7', title: 'Week Warrior', description: '7-day learning streak', icon: '⚡', rarity: 'rare' as const, category: 'streak' as const, xp: 75 },
  { badgeId: 'streak-30', title: 'Monthly Master', description: '30-day learning streak', icon: '🌟', rarity: 'epic' as const, category: 'streak' as const, xp: 300 },
  { badgeId: 'streak-100', title: 'Century Club', description: '100-day learning streak', icon: '💎', rarity: 'legendary' as const, category: 'streak' as const, xp: 500 },

  // Social
  { badgeId: 'first-review', title: 'Voice Heard', description: 'Wrote your first review', icon: '💬', rarity: 'common' as const, category: 'social' as const, xp: 30 },
  { badgeId: 'five-reviews', title: 'Top Critic', description: 'Wrote 5 reviews', icon: '🎤', rarity: 'rare' as const, category: 'social' as const, xp: 100 },

  // Milestones
  { badgeId: 'xp-500', title: 'Rising Star', description: 'Earned 500 XP', icon: '⭐', rarity: 'common' as const, category: 'milestone' as const, xp: 0 },
  { badgeId: 'xp-2000', title: 'AI Powerhouse', description: 'Earned 2,000 XP', icon: '🌍', rarity: 'rare' as const, category: 'milestone' as const, xp: 0 },
  { badgeId: 'xp-5000', title: 'AI Master', description: 'Earned 5,000 XP', icon: '👑', rarity: 'legendary' as const, category: 'milestone' as const, xp: 0 },
  { badgeId: 'first-certificate', title: 'Certified', description: 'Earned your first certificate', icon: '🏆', rarity: 'rare' as const, category: 'milestone' as const, xp: 100 },

  // Special
  { badgeId: 'early-adopter', title: 'Early Adopter', description: 'Joined AfriFlow AI in the early days', icon: '🦁', rarity: 'legendary' as const, category: 'special' as const, xp: 200 },
  { badgeId: 'african-ai-pioneer', title: 'African AI Pioneer', description: 'Completed a course with Africa focus', icon: '🌍', rarity: 'rare' as const, category: 'special' as const, xp: 100 },
]

export default mongoose.models.Achievement || mongoose.model<IAchievement>('Achievement', AchievementSchema)
