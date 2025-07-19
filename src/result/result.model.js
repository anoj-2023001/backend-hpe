//Result model

import {Schema, model} from 'mongoose'

const resultSchema = Schema(
  {
    medicalHistory: {
      type: Schema.Types.ObjectId,
      ref: 'MedicalHistory',
      required: [true, 'medicalHistory is required'],
    },
    fileName: {
      type: String,
      required: [true, 'fileName is required'],
    },
    fileType: {
      type: String,
      enum: ['pdf', 'doc', 'docx'],
      required: [true, 'fileType is required'],
    },
    filePath: {
      type: String,
      required: [true, 'filePath is required'],
    },
    uploadDate: {
      type: Date,
      default: Date.now
    },
    description: {
      type: String,
      required: [true, 'Description is required']
    }
  },
  {
    timestamps: true
  }
)


export default model('Result', resultSchema);