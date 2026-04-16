import mongoose, { Document, Schema } from 'mongoose'

export interface ILesson {
  _id: string
  title: string
  description: string
  videoUrl?: string
  duration: number
  content: string
  order: number
  isFree: boolean
  resources: { title: string; url: string; type: string }[]
}

export interface ICourse extends Document {
  title: string
  slug: string
  description: string
  longDescription: string
  thumbnail: string
  instructor: mongoose.Types.ObjectId
  instructorName: string
  school: string
  category: string
  level: 'beginner' | 'intermediate' | 'advanced'
  tags: string[]
  lessons: ILesson[]
  duration: number
  enrolledCount: number
  rating: number
  reviewCount: number
  price: number
  isFree: boolean
  isPremium: boolean
  isPublished: boolean
  language: string
  outcomes: string[]
  requirements: string[]
  africanFocused: boolean
  toolsCovered: string[]
  createdAt: Date
  updatedAt: Date
}

const LessonSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  videoUrl: { type: String },
  duration: { type: Number, default: 0 },
  content: { type: String, default: '' },
  order: { type: Number, required: true },
  isFree: { type: Boolean, default: false },
  resources: [{
    title: String,
    url: String,
    type: { type: String, enum: ['pdf', 'template', 'link', 'video'] }
  }]
})

const CourseSchema = new Schema<ICourse>({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  longDescription: { type: String },
  thumbnail: { type: String, default: '' },
  instructor: { type: Schema.Types.ObjectId, ref: 'User' },
  instructorName: { type: String, default: 'AfriFlow Team' },
  school: { type: String, required: true },
  category: { type: String, required: true },
  level: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
  tags: [{ type: String }],
  lessons: [LessonSchema],
  duration: { type: Number, default: 0 },
  enrolledCount: { type: Number, default: 0 },
  rating: { type: Number, default: 4.5 },
  reviewCount: { type: Number, default: 0 },
  price: { type: Number, default: 0 },
  isFree: { type: Boolean, default: false },
  isPremium: { type: Boolean, default: false },
  isPublished: { type: Boolean, default: true },
  language: { type: String, default: 'English' },
  outcomes: [{ type: String }],
  requirements: [{ type: String }],
  africanFocused: { type: Boolean, default: true },
  toolsCovered: [{ type: String }],
}, {
  timestamps: true,
})

export default mongoose.models.Course || mongoose.model<ICourse>('Course', CourseSchema)
