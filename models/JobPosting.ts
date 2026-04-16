import mongoose, { Schema, Document } from 'mongoose'

export interface IJobPosting extends Document {
  companyName: string
  companyEmail: string
  companyCountry: string
  companyWebsite?: string
  title: string
  description: string
  requiredSkills: string[]
  requiredCertificates: string[]
  location: string
  isRemote: boolean
  salaryMin?: number
  salaryMax?: number
  currency: string
  type: 'full-time' | 'part-time' | 'contract' | 'internship'
  level: 'junior' | 'mid' | 'senior' | 'any'
  deadline?: Date
  isActive: boolean
  isPremium: boolean
  views: number
  applicants: number
  createdAt: Date
}

const JobPostingSchema = new Schema<IJobPosting>(
  {
    companyName: { type: String, required: true, trim: true },
    companyEmail: { type: String, required: true, lowercase: true, trim: true },
    companyCountry: { type: String, required: true },
    companyWebsite: { type: String, trim: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    requiredSkills: [{ type: String }],
    requiredCertificates: [{ type: String }],
    location: { type: String, default: 'Africa' },
    isRemote: { type: Boolean, default: false },
    salaryMin: { type: Number },
    salaryMax: { type: Number },
    currency: { type: String, default: 'USD' },
    type: { type: String, enum: ['full-time', 'part-time', 'contract', 'internship'], default: 'full-time' },
    level: { type: String, enum: ['junior', 'mid', 'senior', 'any'], default: 'any' },
    deadline: { type: Date },
    isActive: { type: Boolean, default: true },
    isPremium: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
    applicants: { type: Number, default: 0 },
  },
  { timestamps: true }
)

JobPostingSchema.index({ isActive: 1, createdAt: -1 })
JobPostingSchema.index({ requiredSkills: 1 })
JobPostingSchema.index({ requiredCertificates: 1 })

export default mongoose.models.JobPosting ||
  mongoose.model<IJobPosting>('JobPosting', JobPostingSchema)
