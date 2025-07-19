//Prescription model

import { Schema, model } from 'mongoose';

const prescriptionSchema = new Schema(
  {
    // Referencia al historial médico asociado
    medicalHistory: {
      type: Schema.Types.ObjectId,
      ref: 'MedicalHistory',
      required: [true, 'MedicalHistory is required'],
    },

    // Doctor (Usuario) que emite la receta
    doctor: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Doctor is required'],
    },

    // Fecha de emisión de la receta (por defecto ahora)
    issuedAt: {
      type: Date,
      default: Date.now,
    },

    // Lista de medicamentos incluidos en la receta
    medications: [
      {
        // Referencia al medicamento en el catálogo de Pharmacy
        drug: {
          type: Schema.Types.ObjectId,
          ref: 'Pharmacy',
          required: [true, 'Drug is required'],
        },
        dosage: {
          type: String,
          required: [true, 'Dosage is required'], // ej. "500 mg"
        },
        frequency: {
          type: String,
          required: [true, 'Frequency is required'], // ej. "Cada 8 horas"
        },
        duration: {
          type: String,
          required: [true, 'Duration is required'], // ej. "7 días"
        },
        notes: {
          type: String,
          default: '', // notas adicionales para el paciente (opcional)
        },
      },
    ],

    // Observaciones generales de la receta (opcional)
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

export default model('Prescription', prescriptionSchema);
