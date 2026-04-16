import mongoose, { Schema, Document } from 'mongoose'

export interface ISchool extends Document {
  name: string
  slug: string
  country: string
  city?: string
  type: 'university' | 'college' | 'bootcamp' | 'secondary' | 'vocational' | 'corporate'
  adminEmail: string
  adminUser: mongoose.Types.ObjectId
  logoUrl?: string
  primaryColor?: string
  website?: string
  description?: string
  plan: 'free' | 'starter' | 'enterprise'
  planSeats: number                            // max students allowed
  planExpiresAt?: Date
  students: mongoose.Types.ObjectId[]
  courseAssignments: {
    courseSlug: string
    assignedAt: Date
    dueDate?: Date
    mandatory: boolean
  }[]
  totalStudentsEnrolled: number
  totalCompletions: number
  avgProgressPct: number
  isActive: boolean
  inviteCode: string                           // share this to onboard students
  onboardingComplete: boolean
  createdAt: Date
  updatedAt: Date
}

const SchoolSchema = new Schema<ISchool>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    country: { type: String, required: true },
    city: { type: String },
    type: {
      type: String,
      enum: ['university', 'college', 'bootcamp', 'secondary', 'vocational', 'corporate'],
      required: true,
    },
    adminEmail: { type: String, required: true, lowercase: true, trim: true },
    adminUser: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    logoUrl: { type: String },
    primaryColor: { type: String, default: '#FF7A00' },
    website: { type: String },
    description: { type: String },
    plan: { type: String, enum: ['free', 'starter', 'enterprise'], default: 'free' },
    planSeats: { type: Number, default: 30 },
    planExpiresAt: { type: Date },
    students: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    courseAssignments: [
      {
        courseSlug: { type: String, required: true },
        assignedAt: { type: Date, default: Date.now },
        dueDate: { type: Date },
        mandatory: { type: Boolean, default: false },
      },
    ],
    totalStudentsEnrolled: { type: Number, default: 0 },
    totalCompletions: { type: Number, default: 0 },
    avgProgressPct: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    inviteCode: {
      type: String,
      unique: true,
      default: () => Math.random().toString(36).substring(2, 10).toUpperCase(),
    },
    onboardingComplete: { type: Boolean, default: false },
  },
  { timestamps: true }
)

SchoolSchema.index({ slug: 1 })
SchoolSchema.index({ adminUser: 1 })
SchoolSchema.index({ country: 1 })
SchoolSchema.index({ plan: 1 })
SchoolSchema.index({ inviteCode: 1 })

export default mongoose.models.School || mongoose.model<ISchool>('School', SchoolSchema)
