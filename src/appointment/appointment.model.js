// Appointment model

import { Schema, model } from 'mongoose';

const appointmentSchema = Schema(
  {
    patient: {
      type: Schema.Types.ObjectId,
      ref: 'Patient',
      required: [true, 'Patient for Visit is required'],
    },
    doctor: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Doctor for Visit is required'],
    },
    date: {
      type: Date,
      required: [true, 'Date for Visit is required'],
    },
    timeSlot: {
      type: String,
      required: [true, 'Time Slot for Visit is required'],
    },
    reason: {
      type: String,
      required: [true, 'Reason for Visit is required'],
    },
    status: {
      type: String,
      enum: ['scheduled', 'completed', 'cancelled', 'no-show'],
      default: 'scheduled',
    },
    notes: {
      type: String,
      required: [true, 'Notes for Visit is required'],
    },
    medicalHistory: {
      type: Schema.Types.ObjectId,
      ref: 'MedicalHistory',
      required: false,
    },
  },
  {
    timestamps: true 
  }
)

export default model('Appointment', appointmentSchema);
