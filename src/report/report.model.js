//Report model

import { Schema, model } from 'mongoose';

const reportSchema = new Schema(
  {
    // Doctor (Usuario) que emite el reporte
    doctor: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Doctor is required'],
    },

    // Historial médico al que pertenece este reporte
    medicalHistory: {
      type: Schema.Types.ObjectId,
      ref: 'MedicalHistory',
      required: [true, 'MedicalHistory is required'],
    },

    // (Opcional) Si el reporte nace de una cita concreta:
    appointment: {
      type: Schema.Types.ObjectId,
      ref: 'Appointment',
      default: null,
    },

    // (Opcional) Si el reporte nace de un resultado concreto:
    result: {
      type: Schema.Types.ObjectId,
      ref: 'Result',
      default: null,
    },

    // Título del reporte
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },

    // Cuerpo o contenido principal del reporte
    content: {
      type: String,
      required: [true, 'Content is required'],
    },

    // Notas adicionales (opcional)
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true, // crea createdAt y updatedAt automáticamente
  }
);

export default model('Report', reportSchema);
