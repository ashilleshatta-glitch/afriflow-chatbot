import mongoose, { Document, Schema } from 'mongoose'

export interface INotification extends Document {
  user: mongoose.Types.ObjectId
  type: 'achievement' | 'enrollment' | 'completion' | 'certificate' | 'streak' | 'system' | 'social'
  title: string
  message: string
  icon: string
  link?: string
  isRead: boolean
  createdAt: Date
}

const NotificationSchema = new Schema<INotification>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: {
    type: String,
    enum: ['achievement', 'enrollment', 'completion', 'certificate', 'streak', 'system', 'social'],
    default: 'system',
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  icon: { type: String, default: '🔔' },
  link: { type: String },
  isRead: { type: Boolean, default: false },
}, {
  timestamps: true,
})

NotificationSchema.index({ user: 1, createdAt: -1 })
NotificationSchema.index({ user: 1, isRead: 1 })

export default mongoose.models.Notification || mongoose.model<INotification>('Notification', NotificationSchema)
