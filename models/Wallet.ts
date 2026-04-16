import mongoose, { Schema, Document } from 'mongoose'

export interface IWallet extends Document {
  userId: mongoose.Types.ObjectId
  // balances keyed by currency code
  balances: Map<string, number>
  defaultCurrency: string
  // linked payment methods
  linkedAccounts: {
    type: 'mobilemoney' | 'bank' | 'crypto' | 'card'
    provider: string      // e.g. MTN, Airtel, Flutterwave, USDC
    identifier: string    // phone, IBAN, wallet address, last4
    label?: string
    isVerified: boolean
    isDefault: boolean
    addedAt: Date
  }[]
  // spend/earn totals for analytics
  totalEarned: number
  totalSpent: number
  totalPaidOut: number
  kycLevel: 0 | 1 | 2 | 3    // 0=none,1=email,2=phone+ID,3=full
  isSuspended: boolean
  suspendedReason?: string
  createdAt: Date
  updatedAt: Date
}

const WalletSchema = new Schema<IWallet>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    balances: { type: Map, of: Number, default: () => new Map([['USD', 0]]) },
    defaultCurrency: { type: String, default: 'USD' },
    linkedAccounts: [
      {
        type: { type: String, enum: ['mobilemoney', 'bank', 'crypto', 'card'], required: true },
        provider: { type: String, required: true },
        identifier: { type: String, required: true },
        label: String,
        isVerified: { type: Boolean, default: false },
        isDefault: { type: Boolean, default: false },
        addedAt: { type: Date, default: Date.now },
      },
    ],
    totalEarned: { type: Number, default: 0 },
    totalSpent: { type: Number, default: 0 },
    totalPaidOut: { type: Number, default: 0 },
    kycLevel: { type: Number, enum: [0, 1, 2, 3], default: 0 },
    isSuspended: { type: Boolean, default: false },
    suspendedReason: String,
  },
  { timestamps: true }
)

export default mongoose.models.Wallet || mongoose.model<IWallet>('Wallet', WalletSchema)
