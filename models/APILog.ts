import mongoose, { Schema, Document, Model, Types } from 'mongoose'

export interface IAPILog extends Document {
  clientId: Types.ObjectId
  endpoint: string
  method: string
  responseStatus: number
  responseTimeMs: number
  ipAddress?: string
  queryParams?: Record<string, string>
  errorMessage?: string
  createdAt: Date
}

const APILogSchema = new Schema<IAPILog>(
  {
    clientId: { type: Schema.Types.ObjectId, ref: 'APIClient', required: true, index: true },
    endpoint: { type: String, required: true },
    method: { type: String, default: 'GET' },
    responseStatus: { type: Number, required: true },
    responseTimeMs: { type: Number, default: 0 },
    ipAddress: { type: String },
    queryParams: { type: Schema.Types.Mixed },
    errorMessage: { type: String },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
)

APILogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 90 * 24 * 60 * 60 }) // auto-delete after 90 days

const APILog: Model<IAPILog> =
  mongoose.models.APILog ?? mongoose.model<IAPILog>('APILog', APILogSchema)

export default APILog
