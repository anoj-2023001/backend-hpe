import InformationResource from './informationResource.model.js'

// Get all information resources with pagination
export const getAllInformationResources = async (req, res) => {
  try {
    const { limit = 10, skip = 0 } = req.query

    const informationResources = await InformationResource.find()
      .skip(Number(skip))
      .limit(Number(limit))

    const total = await InformationResource.countDocuments()

    if (informationResources.length === 0) return res.status(404).send
      (
        {
          success: false,
          message: 'No information resources found'
        }
      )

    return res.send
      (
        {
          success: true,
          message: 'Information resources retrieved successfully',
          informationResources,
          total
        }
      )
  } catch (error) {
    console.error(error)
    return res.status(500).send
      (
        {
          success: false,
          message: 'Error retrieving information resources',
          error
        }
      )
  }
}

// Get information resource by ID
export const getInformationResourceById = async (req, res) => {
  try {
    const { id } = req.params
    const informationResource = await InformationResource.findById(id)

    if (!informationResource) return res.status(404).send
      (
        {
          success: false,
          message: 'Information resource not found'
        }
      )

    return res.send
      (
        {
          success: true,
          message: 'Information resource found',
          informationResource
        }
      )
  } catch (error) {
    console.error(error)
    return res.status(500).send
      (
        {
          success: false,
          message: 'Error finding information resource',
          error
        }
      )
  }
}

// Create new information resource
export const createInformationResource = async (req, res) => {
  try {
    const data = req.body

    const newInformationResource = new InformationResource(data)
    const saved = await newInformationResource.save()

    return res.status(201).send
      (
        {
          success: true,
          message: 'Information resource created successfully',
          informationResource: saved
        }
      )
  } catch (error) {
    console.error(error)
    return res.status(500).send
      (
        {
          success: false,
          message: 'Error creating information resource',
          error
        }
      )
  }
}

// Update information resource
export const updateInformationResource = async (req, res) => {
  try {
    const { id } = req.params
    const data = req.body

    const updated = await InformationResource.findByIdAndUpdate
      (
        id,
        data,
        { new: true }
      )

    if (!updated) return res.status(404).send
      (
        {
          success: false,
          message: 'Information resource not found or not updated'
        }
      )

    return res.send
      (
        {
          success: true,
          message: 'Information resource updated successfully',
          updated
        }
      )
  } catch (error) {
    console.error(error)
    return res.status(500).send
      (
        {
          success: false,
          message: 'Error updating information resource',
          error
        }
      )
  }
}

// Delete information resource
export const deleteInformationResource = async (req, res) => {
  try {
    const { id } = req.params
    const deleted = await InformationResource.findByIdAndDelete(id)

    if (!deleted) return res.status(404).send
      (
        {
          success: false,
          message: 'Information resource not found'
        }
      )

    return res.send
      (
        {
          success: true,
          message: 'Information resource deleted successfully'
        }
      )
  } catch (error) {
    console.error(error)
    return res.status(500).send
      (
        {
          success: false,
          message: 'Error deleting information resource',
          error
        }
      )
  }
}

// Search information resources by title
export const searchInformationResourceByTitle = async (req, res) => {
  try {
    const { title, limit = 10, skip = 0 } = req.body

    const informationResources = await InformationResource.find
      (
        {
          title: new RegExp(title, 'i')
        }
      )
      .skip(Number(skip))
      .limit(Number(limit))

    if (informationResources.length === 0) return res.status(404).send
      (
        {
          success: false,
          message: 'No matching information resources found'
        }
      )

    return res.send
      (
        {
          success: true,
          message: 'Information resources found by title',
          informationResources,
          total: informationResources.length
        }
      )
  } catch (error) {
    console.error(error)
    return res.status(500).send
      (
        {
          success: false,
          message: 'Error searching information resource by title',
          error
        }
      )
  }
}

// Filter by category
export const filterByCategory = async (req, res) => {
  try {
    const { category, limit = 10, skip = 0 } = req.body

    const informationResources = await InformationResource.find
      (
        { category }
      )
      .skip(Number(skip))
      .limit(Number(limit))

    if (informationResources.length === 0) return res.status(404).send
      (
        {
          success: false,
          message: 'No information resources found with specified category'
        }
      )

    return res.send
      (
        {
          success: true,
          message: 'Information resources filtered by category',
          informationResources,
          total: informationResources.length
        }
      )
  } catch (error) {
    console.error(error)
    return res.status(500).send
      (
        {
          success: false,
          message: 'Error filtering by category',
          error
        }
      )
  }
}

// Filter by type
export const filterByType = async (req, res) => {
  try {
    const { type, limit = 10, skip = 0 } = req.body

    const informationResources = await InformationResource.find
      (
        { type }
      )
      .skip(Number(skip))
      .limit(Number(limit))

    if (informationResources.length === 0) return res.status(404).send
      (
        {
          success: false,
          message: 'No information resources found with specified type'
        }
      )

    return res.send
      (
        {
          success: true,
          message: 'Information resources filtered by type',
          informationResources,
          total: informationResources.length
        }
      )
  } catch (error) {
    console.error(error)
    return res.status(500).send
      (
        {
          success: false,
          message: 'Error filtering by type',
          error
        }
      )
  }
}