import mongoose, { Document, Schema } from 'mongoose'

export type ApplicationStatus =
  | 'applied'
  | 'viewed'
  | 'shortlisted'
  | 'interview'
  | 'hired'
  | 'rejected'

export interface IJobApplication extends Document {
  jobId: mongoose.Types.ObjectId
  applicantId: mongoose.Types.ObjectId
  afriflowIdPublicId: string
  coverNote?: string
  status: ApplicationStatus
  appliedAt: Date
  statusUpdatedAt: Date
  createdAt: Date
  updatedAt: Date
}

const JobApplicationSchema = new Schema<IJobApplication>(
  {
    jobId: { type: Schema.Types.ObjectId, ref: 'JobListing', required: true },
    applicantId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    afriflowIdPublicId: { type: String, required: true },
    coverNote: { type: String, maxlength: 1000 },
    status: {
      type: String,
      enum: ['applied', 'viewed', 'shortlisted', 'interview', 'hired', 'rejected'],
      default: 'applied',
    },
    appliedAt: { type: Date, default: Date.now },
    statusUpdatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
)

JobApplicationSchema.index({ applicantId: 1, appliedAt: -1 })
JobApplicationSchema.index({ jobId: 1, status: 1 })
// Prevent duplicate applications
JobApplicationSchema.index({ jobId: 1, applicantId: 1 }, { unique: true })

export default mongoose.models.JobApplication ||
  mongoose.model<IJobApplication>('JobApplication', JobApplicationSchema)
