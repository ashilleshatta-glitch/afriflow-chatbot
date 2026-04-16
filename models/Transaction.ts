import mongoose, { Schema, Document } from 'mongoose'

export type TxType =
  | 'course_purchase'
  | 'course_refund'
  | 'instructor_earning'
  | 'payout'
  | 'peer_transfer'
  | 'freelance_payment'
  | 'subscription'
  | 'reward'
  | 'bonus'
  | 'fee'
  | 'topup'
  | 'adjustment'

export type TxStatus = 'pending' | 'completed' | 'failed' | 'reversed'

export interface ITransaction extends Document {
  // Parties
  fromUserId?: mongoose.Types.ObjectId  // null for topup/external
  toUserId?: mongoose.Types.ObjectId    // null for payout/external
  // Financial details
  amount: number
  currency: string
  exchangeRate?: number      // if cross-currency
  amountUSD: number          // normalised for analytics
  fee: number                // platform fee deducted
  netAmount: number          // amount - fee
  // Type & status
  type: TxType
  status: TxStatus
  // References
  courseId?: mongoose.Types.ObjectId
  jobId?: mongoose.Types.ObjectId
  payoutId?: mongoose.Types.ObjectId
  externalRef?: string       // Flutterwave/Stripe/MoMo ref
  // Descriptions
  description: string
  note?: string              // user-provided note for peer transfers
  // Metadata
  ipAddress?: string
  createdAt: Date
  updatedAt: Date
}

const TransactionSchema = new Schema<ITransaction>(
  {
    fromUserId: { type: Schema.Types.ObjectId, ref: 'User' },
    toUserId: { type: Schema.Types.ObjectId, ref: 'User' },
    amount: { type: Number, required: true },
    currency: { type: String, required: true, default: 'USD' },
    exchangeRate: Number,
    amountUSD: { type: Number, required: true },
    fee: { type: Number, default: 0 },
    netAmount: { type: Number, required: true },
    type: {
      type: String,
      enum: [
        'course_purchase', 'course_refund', 'instructor_earning',
        'payout', 'peer_transfer', 'freelance_payment',
        'subscription', 'reward', 'bonus', 'fee', 'topup', 'adjustment',
      ],
      required: true,
    },
    status: { type: String, enum: ['pending', 'completed', 'failed', 'reversed'], default: 'pending' },
    courseId: { type: Schema.Types.ObjectId, ref: 'Course' },
    jobId: { type: Schema.Types.ObjectId, ref: 'JobListing' },
    payoutId: { type: Schema.Types.ObjectId, ref: 'Payout' },
    externalRef: String,
    description: { type: String, required: true },
    note: String,
    ipAddress: String,
  },
  { timestamps: true }
)

TransactionSchema.index({ fromUserId: 1, createdAt: -1 })
TransactionSchema.index({ toUserId: 1, createdAt: -1 })
TransactionSchema.index({ status: 1, type: 1 })
TransactionSchema.index({ courseId: 1 })
TransactionSchema.index({ createdAt: -1 })

export default mongoose.models.Transaction ||
  mongoose.model<ITransaction>('Transaction', TransactionSchema)
