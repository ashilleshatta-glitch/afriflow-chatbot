import mongoose, { Schema, Document, Types } from 'mongoose'

export interface IGiftSubscription extends Document {
  gifterId: Types.ObjectId | null
  gifterEmail: string
  gifterName: string
  gifterCountry: string
  recipientEmail: string
  recipientName: string
  recipientCountry: string
  message: string
  plan: '1month' | '6months' | '12months' | 'scholarship'
  amountChargedUSD: number
  currency: string
  amountChargedLocal: number
  paymentProvider: 'stripe' | 'paystack' | 'flutterwave'
  paymentReference: string
  paymentStatus: 'pending' | 'paid' | 'failed'
  recipientUserId: Types.ObjectId | null
  claimToken: string
  isClaimed: boolean
  claimedAt: Date | null
  subscriptionStartDate: Date | null
  subscriptionEndDate: Date | null
  isRenewed: boolean
  createdAt: Date
  updatedAt: Date
}

const GiftSubscriptionSchema = new Schema<IGiftSubscription>(
  {
    gifterId:           { type: Schema.Types.ObjectId, ref: 'User', default: null },
    gifterEmail:        { type: String, required: true, lowercase: true, trim: true },
    gifterName:         { type: String, required: true, trim: true },
    gifterCountry:      { type: String, default: '' },
    recipientEmail:     { type: String, required: true, lowercase: true, trim: true },
    recipientName:      { type: String, required: true, trim: true },
    recipientCountry:   { type: String, default: '' },
    message:            { type: String, default: '' },
    plan:               { type: String, enum: ['1month', '6months', '12months', 'scholarship'], required: true },
    amountChargedUSD:   { type: Number, required: true },
    currency:           { type: String, default: 'USD' },
    amountChargedLocal: { type: Number, default: 0 },
    paymentProvider:    { type: String, enum: ['stripe', 'paystack', 'flutterwave'], required: true },
    paymentReference:   { type: String, default: '' },
    paymentStatus:      { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
    recipientUserId:    { type: Schema.Types.ObjectId, ref: 'User', default: null },
    claimToken:         { type: String, required: true, unique: true, index: true },
    isClaimed:          { type: Boolean, default: false },
    claimedAt:          { type: Date, default: null },
    subscriptionStartDate: { type: Date, default: null },
    subscriptionEndDate:   { type: Date, default: null },
    isRenewed:          { type: Boolean, default: false },
  },
  { timestamps: true }
)

export default mongoose.models.GiftSubscription ||
  mongoose.model<IGiftSubscription>('GiftSubscription', GiftSubscriptionSchema)
