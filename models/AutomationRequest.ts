import mongoose, { Schema, Document } from 'mongoose'

export type AutomationStatus =
  | 'submitted'
  | 'reviewing'
  | 'scoping'
  | 'in_progress'
  | 'review'
  | 'delivered'
  | 'cancelled'

export type AutomationCategory =
  | 'lead_generation'
  | 'crm_integration'
  | 'data_processing'
  | 'email_automation'
  | 'social_media'
  | 'reporting'
  | 'ecommerce'
  | 'hr_ops'
  | 'custom'

export interface IAutomationRequest extends Document {
  // Client info
  user?: mongoose.Types.ObjectId
  clientName: string
  clientEmail: string
  clientPhone?: string
  company?: string
  country: string

  // Request details
  title: string
  description: string
  category: AutomationCategory
  currentProcess: string            // "How do you do this manually today?"
  desiredOutcome: string            // "What should happen automatically?"
  toolsUsed: string[]               // e.g. ['Google Sheets', 'WhatsApp', 'Shopify']
  budget: 'under_500' | '500_2000' | '2000_5000' | '5000_plus' | 'unsure'
  timeline: 'asap' | '1_month' | '3_months' | 'flexible'
  attachmentUrls: string[]

  // Fulfilment
  status: AutomationStatus
  assignedTo?: mongoose.Types.ObjectId   // internal team member
  adminNotes: string
  clientNotes: string
  proposedSolution?: string
  quotedPrice?: number
  quotedHours?: number
  deliveryUrl?: string              // final Zap/Make link or repo

  // Milestones
  statusHistory: {
    status: AutomationStatus
    note: string
    changedAt: Date
    changedBy?: string
  }[]

  // Metadata
  requestRef: string                // e.g. AFR-2026-001
  priority: 'low' | 'medium' | 'high' | 'urgent'
  isPublic: boolean                 // show as case study?
  rating?: number                   // client satisfaction 1-5
  ratingComment?: string
  createdAt: Date
  updatedAt: Date
}

const AutomationRequestSchema = new Schema<IAutomationRequest>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    clientName: { type: String, required: true, trim: true },
    clientEmail: { type: String, required: true, lowercase: true, trim: true },
    clientPhone: { type: String },
    company: { type: String },
    country: { type: String, required: true },

    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: ['lead_generation', 'crm_integration', 'data_processing', 'email_automation',
             'social_media', 'reporting', 'ecommerce', 'hr_ops', 'custom'],
      required: true,
    },
    currentProcess: { type: String, required: true },
    desiredOutcome: { type: String, required: true },
    toolsUsed: [{ type: String }],
    budget: {
      type: String,
      enum: ['under_500', '500_2000', '2000_5000', '5000_plus', 'unsure'],
      required: true,
    },
    timeline: {
      type: String,
      enum: ['asap', '1_month', '3_months', 'flexible'],
      required: true,
    },
    attachmentUrls: [{ type: String }],

    status: {
      type: String,
      enum: ['submitted', 'reviewing', 'scoping', 'in_progress', 'review', 'delivered', 'cancelled'],
      default: 'submitted',
    },
    assignedTo: { type: Schema.Types.ObjectId, ref: 'User' },
    adminNotes: { type: String, default: '' },
    clientNotes: { type: String, default: '' },
    proposedSolution: { type: String },
    quotedPrice: { type: Number },
    quotedHours: { type: Number },
    deliveryUrl: { type: String },

    statusHistory: [
      {
        status: { type: String, required: true },
        note: { type: String, default: '' },
        changedAt: { type: Date, default: Date.now },
        changedBy: { type: String },
      },
    ],

    requestRef: {
      type: String,
      unique: true,
      default: () => `AFR-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    },
    priority: { type: String, enum: ['low', 'medium', 'high', 'urgent'], default: 'medium' },
    isPublic: { type: Boolean, default: false },
    rating: { type: Number, min: 1, max: 5 },
    ratingComment: { type: String },
  },
  { timestamps: true }
)

AutomationRequestSchema.index({ user: 1 })
AutomationRequestSchema.index({ status: 1 })
AutomationRequestSchema.index({ category: 1 })
AutomationRequestSchema.index({ clientEmail: 1 })
AutomationRequestSchema.index({ requestRef: 1 })
AutomationRequestSchema.index({ createdAt: -1 })

export default mongoose.models.AutomationRequest ||
  mongoose.model<IAutomationRequest>('AutomationRequest', AutomationRequestSchema)
