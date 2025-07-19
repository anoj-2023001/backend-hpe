//Appointment controller

import Appointment from "./appointment.model.js"
import Patient from "../patient/patient.model.js"
import User from "../user/user.model.js"

export const createAppointment = async (req, res) => {
    try {
      const { patient, doctor, date, timeSlot, reason, notes } = req.body;
  
      const patientExists = await Patient.findById(patient);
      if (!patientExists) {
        return res.status(404).send({
          success: false,
          message: 'Patient not found'
        });
      }
  
     
      const doctorExists = await User.findById(doctor);
      if (!doctorExists) {
        return res.status(404).send({
          success: false,
          message: 'Doctor (ADMIN) not found'
        });
      }
  
     
      if (doctorExists.role !== 'ADMIN') {
        return res.status(403).send({
          success: false,
          message: 'User is not an ADMIN (Doctor role)'
        });
      }
  
      const existingAppointment = await Appointment.findOne({
        doctor: doctor,
        date: date,
        timeSlot: timeSlot,
        status: { $ne: 'cancelled' }  
      })
  
      if (existingAppointment) {
        return res.status(400).send({
          success: false,
          message: `The time slot ${timeSlot} on ${date} is already booked with this doctor.`
        })
      }
  
     
      const newAppointment = new Appointment({
        patient,
        doctor,
        date,
        timeSlot,
        reason,
        notes,
        status: 'scheduled'  
      })
  
      await newAppointment.save()
  
      return res.send({
        success: true,
        message: `Appointment for patient ${patient} with doctor ${doctor} created successfully on ${date} at ${timeSlot}`,
        appointment: newAppointment
      })
    } catch (err) {
      console.error(err);
      return res.status(500).send({
        success: false,
        message: 'General error when creating appointment',
        error: err.message
      })
    }
  }


export const getAllAppointments = async (req, res) => {
    try {
      const { limit = 20, skip = 0, date, timeSlot, doctorId, patientId, status } = req.query;
  
     
      let filterConditions = {};
  
      
      if (date) {
        filterConditions.date = { $gte: new Date(date) };
      }
  
      
      if (timeSlot) {
        filterConditions.timeSlot = timeSlot;
      }
  
     
      if (doctorId) {
        filterConditions.doctor = doctorId;
      }
  
   
      if (patientId) {
        filterConditions.patient = patientId;
      }
  
      
      if (status) {
        filterConditions.status = status;
      }
  

      const appointments = await Appointment.find(filterConditions)
        .skip(skip) 
        .limit(limit) 
        .populate('patient', 'name surname')  
        .populate('doctor', 'name surname role')
        .sort({ date: 1 })
  
      if (appointments.length === 0) {
        return res.status(404).send({
          success: false,
          message: 'No appointments found'
        });
      }
  
      return res.send({
        success: true,
        appointments,
        total: appointments.length
      });
    } catch (err) {
      console.error('Error getting all appointments:', err);
      return res.status(500).send({
        success: false,
        message: 'Error fetching appointments',
        error: err.message
      });
    }
  };


  // Método para obtener una cita por ID
  export const getAppointment = async (req, res) => {
    try {
      const { id } = req.params
  
      
      const appointment = await Appointment.findById(id)
        .populate('patient', 'name surname') 
        .populate('doctor', 'name surname role')
  
      if (!appointment) {
        return res.status(404).send({
          success: false,
          message: 'Appointment not found'
        })
      }
  
      return res.send({
        success: true,
        appointment
      })
    } catch (err) {
      console.error('Error getting appointment:', err)
      return res.status(500).send({
        success: false,
        message: 'Error fetching appointment',
        error: err.message
      })
    }
  }
  
  // Método para obtener las citas filtradas por varios parámetros
export const getAppointmentsFiltered = async (req, res) => {
    try {
      const {
        date,
        timeSlot,
        doctorId,
        patientId,
        status = 'scheduled',  
      } = req.query
  
      let filterConditions = {}
  
      
      if (date) {
        filterConditions.date = { $gte: new Date(date) }  
      }
  
    
      if (timeSlot) {
        filterConditions.timeSlot = timeSlot
      }
  
      
      if (doctorId) {
        filterConditions.doctor = doctorId
      }
  
      if (patientId) {
        filterConditions.patient = patientId
      }
  
      
      if (status) {
        filterConditions.status = status
      }
  
      
      const appointments = await Appointment.find(filterConditions)
        .populate('patient', 'name surname')  
        .populate('doctor', 'name surname role')
        .sort({ date: 1 })
  
      if (appointments.length === 0) {
        return res.status(404).send({
          success: false,
          message: 'No appointments found with the provided filters'
        })
      }
  
      return res.send({
        success: true,
        appointments
      })
    } catch (err) {
      console.error('Error fetching filtered appointments:', err)
      return res.status(500).send({
        success: false,
        message: 'Error fetching appointments',
        error: err.message
      })
    }
  }

// Actualizar una cita con validaciones y confirmación
export const updateAppointment = async (req, res) => {
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

    
    if (data.date && isNaN(Date.parse(data.date))) {
      return res.status(400).send({
        success: false,
        message: 'Invalid date format. Use YYYY-MM-DD.',
      })
    }

    
    const timeSlotPattern = /^\d{2}:\d{2}-\d{2}:\d{2}$/
    if (data.timeSlot && !timeSlotPattern.test(data.timeSlot)) {
      return res.status(400).send({
        success: false,
        message:
          'Invalid timeSlot format. Use HH:MM-HH:MM, e.g., 09:00-09:30.',
      })
    }

    
    if (data.doctor && !mongoose.Types.ObjectId.isValid(data.doctor)) {
      return res.status(400).send({
        success: false,
        message: 'Invalid doctor ID format.',
      })
    }

    
    if (data.date && data.timeSlot && data.doctor) {
      const existingAppointment = await Appointment.findOne({
        date: new Date(data.date),
        timeSlot: data.timeSlot,
        doctor: data.doctor,
        _id: { $ne: id }, 
      })

      if (existingAppointment) {
        return res.status(409).send({
          success: false,
          message:
            'The selected date and time slot are already booked with this doctor.',
        })
      }
    }

    
    const updatedFields = {
      ...data,
      updatedBy: user.name || user.id,
    }

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      id,
      updatedFields,
      { new: true }
    )

    if (!updatedAppointment) {
      return res.status(404).send({
        success: false,
        message: 'Appointment not found and not updated.',
      })
    }

    return res.send({
      success: true,
      message: 'Appointment updated successfully.',
      updatedAppointment,
      updatedBy: user.name || user.id,
    })
  } catch (error) {
    console.error('Error updating appointment:', error)
    return res.status(500).send({
      success: false,
      message: 'Error updating appointment.',
      error: error.message,
    })
  }
}

//Cancelar una cita

export const cancelAppointment = async (req, res) => {
  try {
    const appointmentId = req.params.id;

    // Buscar la cita
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).send({
        message: 'Appointment not found',
        success: false,
      })
    }

    
    if (['cancelled', 'completed', 'no-show'].includes(appointment.status)) {
      return res.status(400).send({
        message: `Appointment already marked as ${appointment.status}`,
        success: false,
      })
    }

    
    appointment.status = 'cancelled'
    await appointment.save()

    return res.send({
      message: 'Appointment cancelled successfully',
      appointment,
      success: true,
    })

  } catch (error) {
    console.error('Error cancelling appointment:', error)
    return res.status(500).send({
      message: 'Server error cancelling appointment',
      error,
      success: false,
    })
  }
} 