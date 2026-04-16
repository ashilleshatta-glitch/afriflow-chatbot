import mongoose, { Document, Schema } from 'mongoose'
import bcrypt from 'bcryptjs'

export interface IUser extends Document {
  name: string
  email: string
  password: string
  avatar?: string
  role: 'student' | 'instructor' | 'admin'
  country: string
  enrolledCourses: mongoose.Types.ObjectId[]
  completedLessons: string[]
  certificates: mongoose.Types.ObjectId[]
  xp: number
  streak: number
  lastActive: Date
  bio?: string
  subscriptionTier: 'free' | 'premium' | 'enterprise'
  subscriptionExpiry?: Date
  whatsappPhone?: string       // E.164 phone linked to WhatsApp Academy
  plan?: string                // alias used in admin UI
  createdAt: Date
  updatedAt: Date
  comparePassword(password: string): Promise<boolean>
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  avatar: { type: String },
  role: { type: String, enum: ['student', 'instructor', 'admin'], default: 'student' },
  country: { type: String, default: 'Ghana' },
  enrolledCourses: [{ type: Schema.Types.ObjectId, ref: 'Course' }],
  completedLessons: [{ type: String }],
  certificates: [{ type: Schema.Types.ObjectId, ref: 'Certificate' }],
  xp: { type: Number, default: 0 },
  streak: { type: Number, default: 0 },
  lastActive: { type: Date, default: Date.now },
  bio: { type: String },
  subscriptionTier: { type: String, enum: ['free', 'premium', 'enterprise'], default: 'free' },
  subscriptionExpiry: { type: Date },
  whatsappPhone: { type: String, trim: true },
}, {
  timestamps: true,
})

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 12)
  next()
})

UserSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  return bcrypt.compare(password, this.password)
}

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema)
