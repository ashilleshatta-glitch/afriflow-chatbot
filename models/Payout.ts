import mongoose, { Schema, Document } from 'mongoose'

export type PayoutStatus = 'requested' | 'processing' | 'completed' | 'failed' | 'cancelled'
export type PayoutMethod = 'mobilemoney' | 'bank' | 'crypto' | 'card'

export interface IPayout extends Document {
  userId: mongoose.Types.ObjectId
  amount: number
  currency: string
  amountUSD: number
  fee: number
  netAmount: number
  method: PayoutMethod
  provider: string        // MTN, Airtel, Flutterwave, etc.
  destination: string     // phone, IBAN, wallet address
  destinationLabel?: string
  status: PayoutStatus
  requestedAt: Date
  processedAt?: Date
  completedAt?: Date
  failureReason?: string
  externalRef?: string
  adminNote?: string
  createdAt: Date
  updatedAt: Date
}

const PayoutSchema = new Schema<IPayout>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    amountUSD: { type: Number, required: true },
    fee: { type: Number, default: 0 },
    netAmount: { type: Number, required: true },
    method: { type: String, enum: ['mobilemoney', 'bank', 'crypto', 'card'], required: true },
    provider: { type: String, required: true },
    destination: { type: String, required: true },
    destinationLabel: String,
    status: {
      type: String,
      enum: ['requested', 'processing', 'completed', 'failed', 'cancelled'],
      default: 'requested',
    },
    requestedAt: { type: Date, default: Date.now },
    processedAt: Date,
    completedAt: Date,
    failureReason: String,
    externalRef: String,
    adminNote: String,
  },
  { timestamps: true }
)

PayoutSchema.index({ userId: 1, createdAt: -1 })
PayoutSchema.index({ status: 1, requestedAt: 1 })

export default mongoose.models.Payout || mongoose.model<IPayout>('Payout', PayoutSchema)
