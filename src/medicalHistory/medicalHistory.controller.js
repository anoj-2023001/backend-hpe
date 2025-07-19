// MedicalHistory controller

import MedicalHistory from './medicalHistory.model.js'
import Patient from '../patient/patient.model.js';

export const createMedicalHistory = async (req, res) => {
  try {
    let data = req.body
    let medicalHistory = new MedicalHistory(data)

    await medicalHistory.save();
    return res.send({
      success: true,
      message: 'Medical history created successfully', medicalHistory
    })
  } catch (err) {
    return res.status(500).send({
      message: 'General error when creating medical history',
      success: false
    })
  }
}

// Obtener todos los historiales médicos (Administrador)
export const getAllMedicalHistories = async (req, res) => {
  try {
    const { limit = 20, skip = 0 } = req.query

    const histories = await MedicalHistory.find()
      .skip(skip)
      .limit(limit)

    if (histories.length === 0) {
      return res.status(404).send({
        message: 'No medical histories found',
        success: false,
      })
    }

    return res.send({
      success: true,
      message: 'Medical histories found',
      histories,
      total: histories.length,
    })
  } catch (err) {
    console.error(err)
    return res.status(500).send({
      success: false,
      message: 'General error while fetching medical histories',
      error: err,
    })
  }
}

// Obtener un historial médico (por id)
export const getMedicalHistory = async (req, res) => {
  try {
    const { id } = req.params

    if (!id) {
      return res.status(400).send({
        success: false,
        message: 'Parameter id is required',
      })
    }

    const history = await MedicalHistory.findById(id)

    if (!history) {
      return res.status(404).send({
        success: false,
        message: 'Medical history not found',
      })
    }

    return res.send({
      success: true,
      message: 'Medical history found',
      history,
    })
  } catch (err) {
    console.error(err)
    return res.status(500).send({
      success: false,
      message: 'General error while fetching medical history',
      error: err,
    })
  }
}

export const updateMedicalHistory = async (req, res) => {
  try {
    const id = req.params.id
    const data = req.body

    if (!data.confirmation || data.confirmation !== 'YES') {
      return res.status(400).send({
        success: false,
        message:
          'Confirmation not received. Please confirm the action by setting confirmation: "YES".',
      })
    }

    const user = req.user
    if (!user) {
      return res.status(403).send({
        success: false,
        message: 'User not authenticated or not found.',
      })
    }

    const updatedFields = {
      ...data,
      updatedBy: user.name || user.id,
    }

    const updatedMedicalHistory = await MedicalHistory.findByIdAndUpdate(
      id,
      updatedFields,
      { new: true }
    )

    if (!updatedMedicalHistory) {
      return res.status(404).send({
        success: false,
        message: 'Medical history not found and not updated.',
      })
    }

    return res.send({
      success: true,
      message: 'Medical history updated successfully.',
      updatedMedicalHistory,
      updatedBy: user.name || user.id,
    })
  } catch (error) {
    console.error('Error updating medical history:', error)
    return res.status(500).send({
      success: false,
      message: 'Error updating medical history.',
      error: error.message,
    })
  }
}

export const getMedicalHistoriesByRole = async (req, res) => {
  try {
    const user = req.user; // Esto asume que req.user ya está poblado por un middleware de autenticación
    let histories;

    // Si el usuario es ADMINISTRADOR, obtiene todos los historiales
    if (user.role === 'ADMIN') {
      histories = await MedicalHistory.find()
        .populate('doctor patient diagnosis'); // Rellena las referencias
    } else {
      // Si el usuario NO es ADMINISTRADOR (asumimos que es 'PATIENT' según tu enum)
      // Primero, busca el documento del paciente asociado al _id del usuario
      const patient = await Patient.findOne({ user: user._id });

      // Si no se encuentra un perfil de paciente para este usuario
      if (!patient) {
        return res.status(404).json({
          success: false,
          message: 'Patient profile not found for this user.'
        });
      }

      // Una vez que tenemos el ID del paciente, buscamos sus historiales médicos
      histories = await MedicalHistory.find({ patient: patient._id })
        .populate('doctor patient diagnosis'); // Rellena las referencias
    }

    // Envía una respuesta exitosa con los historiales encontrados
    return res.status(200).json({
      success: true,
      message: 'Histories retrieved successfully',
      histories
    });
  } catch (error) {
    // Captura y maneja cualquier error que ocurra durante el proceso
    console.error('Error fetching medical histories:', error); // Mensaje de error más descriptivo
    return res.status(500).json({
      success: false,
      message: 'Error fetching medical histories',
      error: error.message
    });
  }
};