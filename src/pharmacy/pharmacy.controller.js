//Pharmacy controller
import Pharmacy from './pharmacy.model.js'

// Agregar un nuevo medicamento
export const addMedicine = async (req, res) => {
  try {
    let data = req.body
    let medicine = new Pharmacy(data)

    await medicine.save()

    return res.send
      (
        {
          success: true,
          message: `Medicine ${medicine.name} saved successfully`
        }
      )
  } catch (error) {
    console.error(error)
    return res.status(500).send
      (
        {
          success: false,
          message: 'Error saving medicine',
          error
        }
      )
  }
}

// Obtener todos los medicamentos con paginación
export const getAllMedicines = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10
    const skip = parseInt(req.query.skip) || 0

    const medicines = await Pharmacy.find({ status: true })
      .skip(skip)
      .limit(limit)

    const total = await Pharmacy.countDocuments({ status: true })

    if (medicines.length === 0) {
      return res.status(404).send({
        success: false,
        message: 'No medicines found'
      })
    }

    return res.send({
      success: true,
      message: 'Medicines retrieved successfully',
      medicines,
      total
    })
  } catch (error) {
    console.error(error)
    return res.status(500).send({
      success: false,
      message: 'Error retrieving medicines',
      error
    })
  }
}
// Obtener un medicamento por ID
export const getMedicineById = async (req, res) => {
  try {
    const { id } = req.params

    const medicine = await Pharmacy.findById(id)

    if (!medicine || medicine.status === false) return res.status(404).send
      (
        {
          success: false,
          message: 'Medicine not found'
        }
      )

    return res.send
      (
        {
          success: true,
          message: 'Medicine found',
          medicine
        }
      )
  } catch (error) {
    console.error(error)
    return res.status(500).send
      (
        {
          success: false,
          message: 'Error retrieving medicine',
          error
        }
      )
  }
}

// Actualizar medicamento
export const updateMedicine = async (req, res) => {
  try {
    const { id } = req.params
    const data = req.body

    const updated = await Pharmacy.findByIdAndUpdate
      (
        id,
        data,
        { new: true }
      )

    if (!updated || updated.status === false) return res.status(404).send
      (
        {
          success: false,
          message: 'Medicine not found or inactive'
        }
      )

    return res.send
      (
        {
          success: true,
          message: 'Medicine updated successfully',
          updated
        }
      )
  } catch (error) {
    console.error(error)
    return res.status(500).send
      (
        {
          success: false,
          message: 'Error updating medicine',
          error
        }
      )
  }
}

// Eliminar medicamento (cambiar status a false)
export const deleteMedicine = async (req, res) => {
  try {
    const { id } = req.params

    const deleted = await Pharmacy.findByIdAndUpdate
      (
        id,
        { status: false },
        { new: true }
      )

    if (!deleted) return res.status(404).send
      (
        {
          success: false,
          message: 'Medicine not found or already inactive'
        }
      )

    return res.send
      (
        {
          success: true,
          message: 'Medicine deactivated successfully'
        }
      )
  } catch (error) {
    console.error(error)
    return res.status(500).send
      (
        {
          success: false,
          message: 'Error deleting medicine',
          error
        }
      )
  }
}

// Filtrar por proveedor
export const filterByProvider = async (req, res) => {
  try {
    const { provider, limit = 10, skip = 0 } = req.body

    const medicines = await Pharmacy.find
      (
        { provider, status: true }
      )
      .skip(Number(skip))
      .limit(Number(limit))

    if (medicines.length === 0) return res.status(404).send
      (
        {
          success: false,
          message: 'No medicines found with specified provider'
        }
      )

    return res.send
      (
        {
          success: true,
          message: 'Medicines filtered by provider',
          medicines
        }
      )
  } catch (error) {
    console.error(error)
    return res.status(500).send
      (
        {
          success: false,
          message: 'Error filtering by provider',
          error
        }
      )
  }
}

// Filtrar por fecha de vencimiento
export const filterByExpiration = async (req, res) => {
  try {
    const { date } = req.body

    const medicines = await Pharmacy.find
      (
        {
          expirationDate: { $lte: new Date(date) },
          status: true
        }
      )

    if (medicines.length === 0) return res.status(404).send
      (
        {
          success: false,
          message: 'No medicines found expiring before the specified date'
        }
      )

    return res.send
      (
        {
          success: true,
          message: 'Medicines filtered by expiration date',
          medicines
        }
      )
  } catch (error) {
    console.error(error)
    return res.status(500).send
      (
        {
          success: false,
          message: 'Error filtering by expiration date',
          error
        }
      )
  }
}

// Filtrar por bajo stock (ej. menor a 10)
export const filterByLowStock = async (req, res) => {
  try {
    const { threshold = 10 } = req.body

    const medicines = await Pharmacy.find
      (
        { stock: { $lt: Number(threshold) }, status: true }
      )

    if (medicines.length === 0) return res.status(404).send
      (
        {
          success: false,
          message: 'No medicines found with low stock'
        }
      )

    return res.send
      (
        {
          success: true,
          message: 'Medicines filtered by low stock',
          medicines
        }
      )
  } catch (error) {
    console.error(error)
    return res.status(500).send
      (
        {
          success: false,
          message: 'Error filtering by stock',
          error
        }
      )
  }
}