import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IAPIClient extends Document {
  organizationName: string
  contactEmail: string
  apiKey: string          // bcrypt-hashed full key (never returned)
  apiKeyPrefix: string    // first 8 chars shown in UI e.g. "afr_live_"
  apiKeyPlain?: string    // only set once on creation, then discarded
  plan: 'free' | 'starter' | 'growth' | 'enterprise'
  monthlyCallLimit: number
  callsThisMonth: number
  callsTotal: number
  resetDate: Date         // next monthly reset
  allowedEndpoints: string[]
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const PLAN_LIMITS: Record<string, number> = {
  free: 500,
  starter: 5000,
  growth: 50000,
  enterprise: 1000000,
}

const APIClientSchema = new Schema<IAPIClient>(
  {
    organizationName: { type: String, required: true },
    contactEmail: { type: String, required: true, lowercase: true },
    apiKey: { type: String, required: true },
    apiKeyPrefix: { type: String, required: true },
    plan: {
      type: String,
      enum: ['free', 'starter', 'growth', 'enterprise'],
      default: 'free',
    },
    monthlyCallLimit: { type: Number, default: 500 },
    callsThisMonth: { type: Number, default: 0 },
    callsTotal: { type: Number, default: 0 },
    resetDate: { type: Date, default: () => {
      const d = new Date()
      d.setMonth(d.getMonth() + 1, 1)
      d.setHours(0, 0, 0, 0)
      return d
    }},
    allowedEndpoints: { type: [String], default: ['verify/certificate', 'verify/id'] },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
)

// Auto-set monthlyCallLimit from plan before saving
APIClientSchema.pre('save', function (next) {
  if (this.isModified('plan')) {
    this.monthlyCallLimit = PLAN_LIMITS[this.plan] ?? 500
  }
  next()
})

APIClientSchema.index({ apiKeyPrefix: 1 })
APIClientSchema.index({ contactEmail: 1 })

const APIClient: Model<IAPIClient> =
  mongoose.models.APIClient ?? mongoose.model<IAPIClient>('APIClient', APIClientSchema)

export default APIClient
export { PLAN_LIMITS }
