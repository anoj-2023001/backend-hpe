// Patient model
import { Schema, model } from 'mongoose'

const patientSchema = Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    birthDate: {
      type: Date,
      required: [true, 'Birth date is required']
    },
    gender: {
      type: String,
      required: [true, 'Gender is required'],
      enum: ['MALE', 'FEMALE']
    },
    address: {
      type: String,
      maxLength: [100, `Can't be over 100 characters`]
    },
    bloodType: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
      required: [true, 'Blood type is required']
    },
    allergies: {
      type: [String],
      default: []
    },
    chronicDiseases: {
      type: [String],
      default: []
    }
  },
  {
    timestamps: true
  }
)

export default model('Patient', patientSchema)
