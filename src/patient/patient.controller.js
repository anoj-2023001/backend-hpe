// Patient controller
import Patient from './patient.model.js'
import User from '../user/user.model.js'

// Obtener todos los pacientes con paginación
export const getAllPatients = async (req, res) => {
  try {
    const { limit = 10, skip = 0 } = req.query

    const patients = await Patient.find()
      .populate('user', '-password')
      .skip(Number(skip))
      .limit(Number(limit))

    const total = await Patient.countDocuments()

    if (patients.length === 0) return res.status(404).send
      (
        {
          success: false,
          message: 'No patients found'
        }
      )

    return res.send
      (
        {
          success: true,
          message: 'Patients retrieved successfully',
          patients,
          total
        }
      )
  } catch (error) {
    console.error(error)
    return res.status(500).send
      (
        {
          success: false,
          message: 'Error retrieving patients',
          error
        }
      )
  }
}

// Obtener un paciente por ID
export const getPatientById = async (req, res) => {
  try {
    const { id } = req.params
    const patient = await Patient.findById(id).populate('user', '-password')

    if (!patient) return res.status(404).send
      (
        {
          success: false,
          message: 'Patient not found'
        }
      )

    return res.send
      (
        {
          success: true,
          message: 'Patient found',
          patient
        }
      )
  } catch (error) {
    console.error(error)
    return res.status(500).send
      (
        {
          success: false,
          message: 'Error finding patient',
          error
        }
      )
  }
}

// Actualizar datos clínicos
export const updatePatient= async (req, res) => {
  try {
    const { id } = req.params
    const data = req.body

    const updated = await Patient.findByIdAndUpdate(id, {
      bloodType: data.bloodType,
      allergy: data.allergy,
      chronicDisease: data.chronicDisease
    }, { new: true })

    if (!updated) {
      return res.status(404).send({ success: false, message: 'Paciente no encontrado' })
    }

    return res.send({ success: true, message: 'Datos clínicos actualizados', patient: updated })
  } catch (err) {
    return res.status(500).send({ success: false, message: 'Error al actualizar', error: err })
  }
}

// Eliminar paciente (cambiar status del usuario a false)
export const deletePatient = async (req, res) => {
  try {
    const { id } = req.params

    // Buscar al paciente
    const patient = await Patient.findById(id)
    if (!patient)
      return res.status(404).send({
        success: false,
        message: 'Paciente no encontrado'
      })

    // Cambiar el estado del usuario relacionado
    await User.findByIdAndUpdate(patient.user, { status: false })

    // Eliminar al paciente (opcional: si no quieres borrarlo físicamente, comenta esta línea)
    await Patient.findByIdAndDelete(id)

    return res.send({
      success: true,
      message: 'Paciente eliminado correctamente'
    })
  } catch (error) {
    console.error(error)
    return res.status(500).send({
      success: false,
      message: 'Error al eliminar paciente',
      error
    })
  }
}

// Buscar por nombre o apellido con paginación
export const searchPatientByName = async (req, res) => {
  try {
    const { name, limit = 10, skip = 0 } = req.body

    const users = await User.find
      (
        {
          role: 'PATIENT',
          status: true,
          $or: [
            { name: new RegExp(name, 'i') },
            { surname: new RegExp(name, 'i') }
          ]
        }
      )

    const patients = await Patient.find
      (
        { user: { $in: users.map(u => u._id) } }
      )
      .populate('user', '-password')
      .skip(Number(skip))
      .limit(Number(limit))

    if (patients.length === 0) return res.status(404).send
      (
        {
          success: false,
          message: 'No matching patients found'
        }
      )

    return res.send
      (
        {
          success: true,
          message: 'Patients found by name',
          patients,
          total: patients.length
        }
      )
  } catch (error) {
    console.error(error)
    return res.status(500).send
      (
        {
          success: false,
          message: 'Error searching patient by name',
          error
        }
      )
  }
}

// Filtrar por tipo de sangre con paginación
export const filterByBloodType = async (req, res) => {
  try {
    const { bloodType, limit = 10, skip = 0 } = req.body

    const patients = await Patient.find({ bloodType })
      .populate('user', '-password')
      .skip(Number(skip))
      .limit(Number(limit))

    if (patients.length === 0) {
      return res.status(404).send({
        success: false,
        message: 'No patients with specified blood type'
      })
    }

    return res.send({
      success: true,
      message: 'Patients filtered by blood type',
      patients,
      total: patients.length
    })
  } catch (error) {
    console.error(error)
    return res.status(500).send({
      success: false,
      message: 'Error filtering by blood type',
      error
    })
  }
}

// Filtrar por enfermedad crónica con paginación
export const filterByDisease = async (req, res) => {
  try {
    const { disease, limit = 10, skip = 0 } = req.body

    const patients = await Patient.find
      (
        { chronicDiseases: disease }
      )
      .populate('user', '-password')
      .skip(Number(skip))
      .limit(Number(limit))

    if (patients.length === 0) return res.status(404).send
      (
        {
          success: false,
          message: 'No patients found with specified chronic disease'
        }
      )

    return res.send
      (
        {
          success: true,
          message: 'Patients filtered by chronic disease',
          patients,
          total: patients.length
        }
      )
  } catch (error) {
    console.error(error)
    return res.status(500).send
      (
        {
          success: false,
          message: 'Error filtering by chronic disease',
          error
        }
      )
  }
}

// Filtrar por alergia con paginación
export const filterByAllergy = async (req, res) => {
  try {
    const { allergy, limit = 10, skip = 0 } = req.body

    const patients = await Patient.find
      (
        { allergies: allergy }
      )
      .populate('user', '-password')
      .skip(Number(skip))
      .limit(Number(limit))

    if (patients.length === 0) return res.status(404).send
      (
        {
          success: false,
          message: 'No patients found with specified allergy'
        }
      )

    return res.send
      (
        {
          success: true,
          message: 'Patients filtered by allergy',
          patients,
          total: patients.length
        }
      )
  } catch (error) {
    console.error(error)
    return res.status(500).send
      (
        {
          success: false,
          message: 'Error filtering by allergy',
          error
        }
      )
  }
}

// Filtrar por género con paginación
export const filterByGender = async (req, res) => {
  try {
    const { gender, limit = 10, skip = 0 } = req.body

    const patients = await Patient.find
      (
        { gender }
      )
      .populate('user', '-password')
      .skip(Number(skip))
      .limit(Number(limit))

    if (patients.length === 0) return res.status(404).send
      (
        {
          success: false,
          message: 'No patients found with specified gender'
        }
      )

    return res.send
      (
        {
          success: true,
          message: 'Patients filtered by gender',
          patients,
          total: patients.length
        }
      )
  } catch (error) {
    console.error(error)
    return res.status(500).send
      (
        {
          success: false,
          message: 'Error filtering by gender',
          error
        }
      )
  }
}
