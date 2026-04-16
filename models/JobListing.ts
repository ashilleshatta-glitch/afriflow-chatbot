import mongoose, { Document, Schema } from 'mongoose'

export interface IJobListing extends Document {
  companyName: string
  companyLogoUrl?: string
  companySize?: string
  companyCountry: string

  title: string
  description: string
  responsibilities: string[]
  requirements: string[]

  requiredCertifications: string[]
  requiredSkills: string[]
  niceToHaveSkills: string[]
  minimumVerificationScore: number

  type: 'fulltime' | 'parttime' | 'freelance' | 'internship' | 'contract'
  remote: boolean
  location: string

  salaryMin?: number
  salaryMax?: number
  currency: string
  salaryPeriod: 'monthly' | 'annual' | 'per_project'

  applicationDeadline?: Date
  applicationCount: number

  postedBy?: mongoose.Types.ObjectId
  isVerifiedEmployer: boolean
  isFeatured: boolean
  isActive: boolean

  createdAt: Date
  updatedAt: Date
}

const JobListingSchema = new Schema<IJobListing>(
  {
    companyName: { type: String, required: true, trim: true },
    companyLogoUrl: { type: String },
    companySize: { type: String },
    companyCountry: { type: String, required: true },

    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    responsibilities: [{ type: String }],
    requirements: [{ type: String }],

    requiredCertifications: [{ type: String }],
    requiredSkills: [{ type: String }],
    niceToHaveSkills: [{ type: String }],
    minimumVerificationScore: { type: Number, default: 0, min: 0, max: 100 },

    type: {
      type: String,
      enum: ['fulltime', 'parttime', 'freelance', 'internship', 'contract'],
      default: 'fulltime',
    },
    remote: { type: Boolean, default: false },
    location: { type: String, default: 'Africa' },

    salaryMin: { type: Number },
    salaryMax: { type: Number },
    currency: { type: String, default: 'USD' },
    salaryPeriod: {
      type: String,
      enum: ['monthly', 'annual', 'per_project'],
      default: 'monthly',
    },

    applicationDeadline: { type: Date },
    applicationCount: { type: Number, default: 0 },

    postedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    isVerifiedEmployer: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
)

JobListingSchema.index({ isActive: 1, isFeatured: -1, createdAt: -1 })
JobListingSchema.index({ requiredSkills: 1 })
JobListingSchema.index({ requiredCertifications: 1 })
JobListingSchema.index({ type: 1, remote: 1 })
JobListingSchema.index({ companyCountry: 1 })

export default mongoose.models.JobListing ||
  mongoose.model<IJobListing>('JobListing', JobListingSchema)
