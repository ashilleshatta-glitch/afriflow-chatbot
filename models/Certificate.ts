import mongoose, { Document, Schema } from 'mongoose'

export interface ICertificate extends Document {
  user: mongoose.Types.ObjectId
  userName: string
  courseSlug: string
  courseTitle: string
  courseSchool: string
  certificateId: string
  issuedAt: Date
  expiryDate: Date
  grade: string
  score: number
  skills: string[]
  projectsCompleted: number
  automationsBuilt: number
  verificationHash: string
  isRevoked: boolean
  verified: boolean
}

const CertificateSchema = new Schema<ICertificate>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  userName: { type: String, required: true },
  courseSlug: { type: String, required: true },
  courseTitle: { type: String, required: true },
  courseSchool: { type: String, required: true },
  certificateId: { type: String, required: true, unique: true },
  issuedAt: { type: Date, default: Date.now },
  expiryDate: { type: Date },
  grade: { type: String, enum: ['distinction', 'merit', 'pass'], default: 'pass' },
  score: { type: Number, default: 100, min: 0, max: 100 },
  skills: [{ type: String }],
  projectsCompleted: { type: Number, default: 0 },
  automationsBuilt: { type: Number, default: 0 },
  verificationHash: { type: String },
  isRevoked: { type: Boolean, default: false },
  verified: { type: Boolean, default: true },
}, {
  timestamps: true,
})

CertificateSchema.index({ user: 1 })

export default mongoose.models.Certificate || mongoose.model<ICertificate>('Certificate', CertificateSchema)
