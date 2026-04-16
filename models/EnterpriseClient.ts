import mongoose, { Schema, Document, Types } from 'mongoose'

export interface IEnterpriseClient extends Document {
  organizationName: string
  slug: string
  branding: {
    logoUrl: string
    primaryColor: string
    secondaryColor: string
    favicon: string
    customDomain: string
  }
  plan: 'starter' | 'growth' | 'enterprise'
  seatLimit: number
  usedSeats: number
  customCurriculum: Types.ObjectId[]
  customCourses: {
    title: string
    videoUrl: string
    content: string
    isPublished: boolean
  }[]
  adminUsers: Types.ObjectId[]
  learners: Types.ObjectId[]
  features: {
    customCertificates: boolean
    customBranding: boolean
    apiAccess: boolean
    dedicatedSupport: boolean
    offlineContent: boolean
    analytics: boolean
  }
  contractStartDate: Date
  contractEndDate: Date
  annualFeeUSD: number
  paymentStatus: 'active' | 'past_due' | 'cancelled'
  contactName: string
  contactEmail: string
  country: string
  welcomeMessage: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const EnterpriseClientSchema = new Schema<IEnterpriseClient>(
  {
    organizationName: { type: String, required: true, trim: true },
    slug:             { type: String, required: true, unique: true, trim: true, lowercase: true, index: true },
    branding: {
      logoUrl:      { type: String, default: '' },
      primaryColor: { type: String, default: '#FF7A00' },
      secondaryColor: { type: String, default: '#22C55E' },
      favicon:      { type: String, default: '' },
      customDomain: { type: String, default: '' },
    },
    plan:       { type: String, enum: ['starter', 'growth', 'enterprise'], default: 'starter' },
    seatLimit:  { type: Number, default: 50 },
    usedSeats:  { type: Number, default: 0 },
    customCurriculum: [{ type: Schema.Types.ObjectId, ref: 'Course' }],
    customCourses: [{
      title:       { type: String, default: '' },
      videoUrl:    { type: String, default: '' },
      content:     { type: String, default: '' },
      isPublished: { type: Boolean, default: false },
    }],
    adminUsers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    learners:   [{ type: Schema.Types.ObjectId, ref: 'User' }],
    features: {
      customCertificates: { type: Boolean, default: false },
      customBranding:     { type: Boolean, default: false },
      apiAccess:          { type: Boolean, default: false },
      dedicatedSupport:   { type: Boolean, default: false },
      offlineContent:     { type: Boolean, default: false },
      analytics:          { type: Boolean, default: true },
    },
    contractStartDate: { type: Date, default: Date.now },
    contractEndDate:   { type: Date, default: () => new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) },
    annualFeeUSD:   { type: Number, default: 3000 },
    paymentStatus:  { type: String, enum: ['active', 'past_due', 'cancelled'], default: 'active' },
    contactName:    { type: String, default: '' },
    contactEmail:   { type: String, default: '', lowercase: true },
    country:        { type: String, default: '' },
    welcomeMessage: { type: String, default: '' },
    isActive:       { type: Boolean, default: true },
  },
  { timestamps: true }
)

export default mongoose.models.EnterpriseClient ||
  mongoose.model<IEnterpriseClient>('EnterpriseClient', EnterpriseClientSchema)
