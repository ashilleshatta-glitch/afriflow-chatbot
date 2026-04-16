import mongoose, { Document, Schema } from 'mongoose'

export interface INewsletter extends Document {
  email: string
  name?: string
  source: string // Where they subscribed from (blog, footer, homepage, etc.)
  isActive: boolean
  subscribedAt: Date
}

const NewsletterSchema = new Schema<INewsletter>({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  name: { type: String, trim: true },
  source: { type: String, default: 'website' },
  isActive: { type: Boolean, default: true },
  subscribedAt: { type: Date, default: Date.now },
}, {
  timestamps: true,
})

export default mongoose.models.Newsletter || mongoose.model<INewsletter>('Newsletter', NewsletterSchema)
