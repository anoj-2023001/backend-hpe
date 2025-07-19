//Diagnosis model

import {Schema, model} from 'mongoose'




const diagnosisSchema = Schema(
  {
    code: {
      type: String,
      required:[true, 'Code is required'],
      unique: true,
      minLength: [25, `Can't be overcome 25 characters`],
      trim: true
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    severity: {
      type: String,
      enum: ['mild', 'moderate', 'severe', 'chronic'],
      default: 'mild'
    },
    symptoms: [String],
    recommendedTests: [String],
    treatmentGuidelines: String
  },
  {
    timestamps: true
  }
)


export default model('Diagnosis', diagnosisSchema);