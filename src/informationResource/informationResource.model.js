import { Schema, model } from 'mongoose'
 
const resourceInformationSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
      trim: true
    },
    category: {
      type: String,
      enum: ['Prevention', 'Diseases', 'Tips', 'Other'],
      default: 'Other'
    },
    author: {
      type: String,
      required: [true, 'Author is required']
    },
    image: {
      type: String,
      default: ''
    },
    status: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
)
 
export default model('Information', resourceInformationSchema)