import mongoose, { Document, Schema } from 'mongoose'
import crypto from 'crypto'

// ─── Sub-document interfaces ──────────────────────────────────────────────────

export interface ISkill {
  name: string
  level: 'beginner' | 'practitioner' | 'expert'
  verifiedBy: 'course' | 'project' | 'employer' | 'exam'
  verifiedAt: Date
  evidenceUrl?: string
}

export interface IProject {
  title: string
  description: string
  toolsUsed: string[]
  outcomeDescription: string
  liveUrl?: string
  screenshotUrl?: string
  verifiedByEmployer: boolean
  completedAt: Date
}

export interface IEmployerEndorsement {
  companyName: string
  contactName: string
  contactEmail: string
  endorsementText: string
  skillsEndorsed: string[]
  endorsedAt: Date
  isVerified: boolean
  verifyToken: string   // UUID sent to employer for email verification
}

// ─── Main interface ───────────────────────────────────────────────────────────

export interface IAfriflowID extends Document {
  userId: mongoose.Types.ObjectId
  publicId: string           // AFR-XXXX-XXXX
  displayName: string
  country: string
  headline: string

  skills: ISkill[]
  projects: IProject[]

  automationsBuilt: number
  automationTypes: string[]

  employerEndorsements: IEmployerEndorsement[]
  certificates: mongoose.Types.ObjectId[]

  totalXP: number
  learningHours: number
  streakRecord: number

  profileViews: number
  lastProfileView?: Date

  isPublic: boolean
  isHireable: boolean
  preferredWorkType: 'fulltime' | 'freelance' | 'both'
  expectedSalaryRange?: string

  verificationScore: number     // 0–100
  verificationHash: string      // SHA-256 tamper detection

  createdAt: Date
  updatedAt: Date

  // Virtual / instance methods
  recalculateVerificationScore(): number
  recalculateVerificationHash(): string
}

// ─── Sub-schemas ──────────────────────────────────────────────────────────────

const SkillSchema = new Schema<ISkill>(
  {
    name: { type: String, required: true, trim: true },
    level: { type: String, enum: ['beginner', 'practitioner', 'expert'], default: 'beginner' },
    verifiedBy: { type: String, enum: ['course', 'project', 'employer', 'exam'], default: 'course' },
    verifiedAt: { type: Date, default: Date.now },
    evidenceUrl: { type: String },
  },
  { _id: true }
)

const ProjectSchema = new Schema<IProject>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    toolsUsed: [{ type: String }],
    outcomeDescription: { type: String, default: '' },
    liveUrl: { type: String },
    screenshotUrl: { type: String },
    verifiedByEmployer: { type: Boolean, default: false },
    completedAt: { type: Date, default: Date.now },
  },
  { _id: true }
)

const EndorsementSchema = new Schema<IEmployerEndorsement>(
  {
    companyName: { type: String, required: true },
    contactName: { type: String, required: true },
    contactEmail: { type: String, required: true, lowercase: true, trim: true },
    endorsementText: { type: String, required: true },
    skillsEndorsed: [{ type: String }],
    endorsedAt: { type: Date, default: Date.now },
    isVerified: { type: Boolean, default: false },
    verifyToken: { type: String, required: true },
  },
  { _id: true }
)

// ─── Main schema ──────────────────────────────────────────────────────────────

const AfriflowIDSchema = new Schema<IAfriflowID>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    publicId: { type: String, required: true, unique: true, index: true },
    displayName: { type: String, required: true, trim: true },
    country: { type: String, default: 'Africa' },
    headline: { type: String, default: '' },

    skills: [SkillSchema],
    projects: [ProjectSchema],

    automationsBuilt: { type: Number, default: 0 },
    automationTypes: [{ type: String }],

    employerEndorsements: [EndorsementSchema],
    certificates: [{ type: Schema.Types.ObjectId, ref: 'Certificate' }],

    totalXP: { type: Number, default: 0 },
    learningHours: { type: Number, default: 0 },
    streakRecord: { type: Number, default: 0 },

    profileViews: { type: Number, default: 0 },
    lastProfileView: { type: Date },

    isPublic: { type: Boolean, default: true },
    isHireable: { type: Boolean, default: false },
    preferredWorkType: { type: String, enum: ['fulltime', 'freelance', 'both'], default: 'both' },
    expectedSalaryRange: { type: String },

    verificationScore: { type: Number, default: 0, min: 0, max: 100 },
    verificationHash: { type: String, default: '' },
  },
  { timestamps: true }
)

// ─── Score calculation method ─────────────────────────────────────────────────
// Score is built from evidence depth — not self-reported data.

AfriflowIDSchema.methods.recalculateVerificationScore = function (): number {
  let score = 0

  // Certificates: up to 30 pts (5 per cert, max 6)
  const certPts = Math.min(this.certificates.length * 5, 30)
  score += certPts

  // Verified skills (course/exam/employer): up to 25 pts
  const verifiedSkills = this.skills.filter((s: ISkill) =>
    ['course', 'exam', 'employer'].includes(s.verifiedBy)
  ).length
  score += Math.min(verifiedSkills * 5, 25)

  // Projects: up to 20 pts (4 each, max 5)
  score += Math.min(this.projects.length * 4, 20)

  // Employer-verified projects: +2 bonus each
  const empVerifiedProjects = this.projects.filter((p: IProject) => p.verifiedByEmployer).length
  score += Math.min(empVerifiedProjects * 2, 10)

  // Verified endorsements: up to 15 pts (5 per endorsement, max 3)
  const verifiedEndorsements = this.employerEndorsements.filter((e: IEmployerEndorsement) => e.isVerified).length
  score += Math.min(verifiedEndorsements * 5, 15)

  // Automations built (shows practical application): up to 10 pts
  score += Math.min(Math.floor(this.automationsBuilt / 2), 10)

  this.verificationScore = Math.min(Math.round(score), 100)
  return this.verificationScore
}

AfriflowIDSchema.methods.recalculateVerificationHash = function (): string {
  const payload = JSON.stringify({
    publicId: this.publicId,
    userId: String(this.userId),
    certificates: this.certificates.map((c: mongoose.Types.ObjectId) => String(c)),
    skills: this.skills.map((s: ISkill) => `${s.name}:${s.level}:${s.verifiedBy}`),
    verificationScore: this.verificationScore,
    updatedAt: this.updatedAt,
  })
  this.verificationHash = crypto.createHash('sha256').update(payload).digest('hex')
  return this.verificationHash
}

// Auto-recalculate on save
AfriflowIDSchema.pre('save', function (next) {
  this.recalculateVerificationScore()
  this.recalculateVerificationHash()
  next()
})

// ─── Public-ID generator ──────────────────────────────────────────────────────

export function generatePublicId(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // no ambiguous chars
  const segment = (len: number) =>
    Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
  return `AFR-${segment(4)}-${segment(4)}`
}

export default mongoose.models.AfriflowID ||
  mongoose.model<IAfriflowID>('AfriflowID', AfriflowIDSchema)
