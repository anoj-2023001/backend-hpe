//Notification model

import { Schema, model } from 'mongoose';

const notificationSchema = new Schema(
  {
    // Usuario que recibe la notificación
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },

    // Si la notificación viene de una cita, aquí la referenciamos
    appointment: {
      type: Schema.Types.ObjectId,
      ref: 'Appointment',
      default: null,
    },

    // Si la notificación viene de un resultado, aquí la referenciamos
    result: {
      type: Schema.Types.ObjectId,
      ref: 'Result',
      default: null,
    },

    // Título o asunto de la notificación
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },

    // Cuerpo o mensaje de la notificación
    message: {
      type: String,
      required: [true, 'Message is required'],
    },

    // Campo para marcar si ya fue leída o no y de ahi no se me ocurre nada mas xd
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default model('Notification', notificationSchema);
