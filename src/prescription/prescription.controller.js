import Prescription from './prescription.model.js'
import MedicalHistory from '../medicalHistory/medicalHistory.model.js'
import User from '../user/user.model.js'
import Pharmacy from '../pharmacy/pharmacy.model.js'

// Crear una receta (Prescription)
export const createPrescription = async (req, res) => {
  try {
    const data = req.body

    // Verificar que el MedicalHistory exista
    const mh = await MedicalHistory.findById(data.medicalHistory)
    if (!mh) {
      return res.status(404).json({ message: 'MedicalHistory no encontrado' })
    }

    // Verificar que el Doctor exista
    const doc = await User.findById(data.doctor)
    if (!doc) {
      return res.status(404).json({ message: 'Doctor no encontrado' })
    }

    // Verificar que cada medicamento exista en Pharmacy
    for (const med of data.medications) {
      const drug = await Pharmacy.findById(med.drug)
      if (!drug) {
        return res
          .status(404)
          .json({ message: `Drug con ID ${med.drug} no encontrado` })
      }
    }

    const prescription = new Prescription(data)
    await prescription.save()
    return res
      .status(201)
      .json({ message: 'Receta creada exitosamente', prescription })
  } catch (error) {
    console.error(error)
    return res
      .status(500)
      .json({ message: 'Error al crear la receta', error })
  }
}

// Obtener todas las recetas
export const getAllPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.find()
      .populate('medicalHistory')
      .populate('doctor', 'name surname email')
      .populate('medications.drug', 'name price')
    return res.json({ prescriptions })
  } catch (error) {
    console.error(error)
    return res
      .status(500)
      .json({ message: 'Error al obtener recetas', error })
  }
}

// Obtener una receta por ID
export const getPrescription = async (req, res) => {
  try {
    const { id } = req.params
    const prescription = await Prescription.findById(id)
      .populate('medicalHistory')
      .populate('doctor', 'name surname email')
      .populate('medications.drug', 'name price')
    if (!prescription) {
      return res.status(404).json({ message: 'Receta no encontrada' })
    }
    return res.json({ prescription })
  } catch (error) {
    console.error(error)
    return res
      .status(500)
      .json({ message: 'Error al obtener la receta', error })
  }
}

// Actualizar una receta
export const updatePrescription = async (req, res) => {
  try {
    const { id } = req.params
    const data = req.body

    // Si envían medicalHistory, verificar que exista
    if (data.medicalHistory) {
      const mh = await MedicalHistory.findById(data.medicalHistory)
      if (!mh) {
        return res.status(404).json({ message: 'MedicalHistory no encontrado' })
      }
    }
    // Si envían doctor, verificar que exista
    if (data.doctor) {
      const doc = await User.findById(data.doctor)
      if (!doc) {
        return res.status(404).json({ message: 'Doctor no encontrado' })
      }
    }
    // Si envían medications, verificar cada medicamento
    if (data.medications) {
      for (const med of data.medications) {
        const drug = await Pharmacy.findById(med.drug)
        if (!drug) {
          return res
            .status(404)
            .json({ message: `Drug con ID ${med.drug} no encontrado` })
        }
      }
    }

    const updatedPrescription = await Prescription.findByIdAndUpdate(id, data, {
      new: true,
    })
    if (!updatedPrescription) {
      return res.status(404).json({ message: 'Receta no encontrada' })
    }
    return res.json({
      message: 'Receta actualizada correctamente',
      updatedPrescription,
    })
  } catch (error) {
    console.error(error)
    return res
      .status(500)
      .json({ message: 'Error al actualizar la receta', error })
  }
}

// Eliminar una receta
export const deletePrescription = async (req, res) => {
  try {
    const { id } = req.params
    const deletedPrescription = await Prescription.findByIdAndDelete(id)
    if (!deletedPrescription) {
      return res.status(404).json({ message: 'Receta no encontrada' })
    }
    return res.json({
      message: 'Receta eliminada correctamente',
      deletedPrescription,
    })
  } catch (error) {
    console.error(error)
    return res
      .status(500)
      .json({ message: 'Error al eliminar la receta', error })
  }
}
