import mongoose, { Document, Schema } from 'mongoose'

export interface IBenchmarkDownload extends Document {
  name: string
  email: string
  organization?: string
  country?: string
  reportYear: number
  reportQuarter: string
  downloadedAt: Date
  ipAddress?: string
  source?: string   // 'web' | 'api'
}

const BenchmarkDownloadSchema = new Schema<IBenchmarkDownload>({
  name: { type: String, default: '' },
  email: { type: String, required: true, lowercase: true, trim: true },
  organization: { type: String, default: '' },
  country: { type: String, default: '' },
  reportYear: { type: Number, default: 2026 },
  reportQuarter: { type: String, default: 'Q1' },
  downloadedAt: { type: Date, default: Date.now },
  ipAddress: { type: String },
  source: { type: String, default: 'web' },
})

BenchmarkDownloadSchema.index({ email: 1 })
BenchmarkDownloadSchema.index({ downloadedAt: -1 })

export default mongoose.models.BenchmarkDownload ||
  mongoose.model<IBenchmarkDownload>('BenchmarkDownload', BenchmarkDownloadSchema)
