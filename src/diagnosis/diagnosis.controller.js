//Diagnosis controller

import Diagnosis from "./diagnosis.model.js"

//Añadir un diagnóstico (Administrador)

export const createDiagnosis = async (req, res) => {
  try {
    let data = req.body
    let diagnosis = new Diagnosis(data)

    await diagnosis.save();
    return res.send({
      success: true,
      message: `${diagnosis.name}, with code ${diagnosis.code} saved successfully`
    })
  } catch (err) {
    console.error(err);
    return res.status(500).send({
      message: 'General error when adding diagnosis',
      success: false
    })
  }
}

// Obtener todos los diagnósticos (Administrador)
export const getAllDiagnoses = async (req, res) => {
    try {
        const { limit = 20, skip = 0 } = req.query;
        
        const diagnoses = await Diagnosis.find()
            .skip(skip)
            .limit(limit);

        if (diagnoses.length === 0) {
            return res.status(404).send({
                message: 'No diagnoses found',
                success: false,
            });
        }

        return res.send({
            success: true,
            message: 'Diagnoses found',
            diagnoses,
            total: diagnoses.length,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).send({
            success: false,
            message: 'General error while fetching diagnoses',
            error: err,
        });
    }
};

// Obtener un diagnóstico (por id, code o name)
export const getDiagnosis = async (req, res) => {
    try {
        const { id, code, name } = req.params;

        // Validar si se pasa id, code o name
        if (!id && !code && !name) {
            return res.status(400).send({
                success: false,
                message: 'At least one of the parameters (id, code, or name) is required',
            })
        }

        let diagnosis;

        if (id) {
            diagnosis = await Diagnosis.findById(id)
        } else if (code) {
            diagnosis = await Diagnosis.findOne({ code })
        } else if (name) {
            diagnosis = await Diagnosis.findOne({ name: new RegExp(name, 'i') }); 
        }

        if (!diagnosis) {
            return res.status(404).send({
                success: false,
                message: 'Diagnosis not found',
            })
        }

        return res.send({
            success: true,
            message: 'Diagnosis found',
            diagnosis,
        })
    } catch (err) {
        console.error(err);
        return res.status(500).send({
            success: false,
            message: 'General error while fetching diagnosis',
            error: err,
        })
    }
}


// Actualizar un diagnóstico (Administrador)
export const updateDiagnosis = async (req, res) => {
    try {
        
        const id = req.params.id
        const data = req.body

        
        if (!data.confirmation || data.confirmation !== 'YES') {
            return res.status(400).send({
                success: false,
                message: 'Confirmation not received. Please confirm the action by setting confirmation: "YES" in your request.',
            })
        }

        
        const user = req.user; 
        
        
        if (!user) {
            return res.status(403).send({
                success: false,
                message: 'User not authenticated or not found',
            })
        }

        const updatedData = {
            ...data,
            updatedBy: user.name || user.id 
        }

        
        const updatedDiagnosis = await Diagnosis.findByIdAndUpdate(
            id,
            updatedData,
            { new: true }
        )

        
        if (!updatedDiagnosis) {
            return res.status(404).send({
                success: false,
                message: 'Diagnosis not found and not updated',
            })
        }

        
        return res.send({
            success: true,
            message: 'Diagnosis updated successfully',
            updatedDiagnosis,
            updatedBy: user.name || user.id, 
        })

    } catch (error) {
        console.error('General error', error);
        return res.status(500).send({
            message: 'General error during update',
            error,
            success: false,
        })
    }
}

