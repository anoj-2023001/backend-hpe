// Validaciones con relacion entidad - base de datos
import User from '../src/user/user.model.js'
import Pharmacy from '../src/pharmacy/pharmacy.model.js'

export const existUsername = async(username)=>{
    const alreadyUsername = await User.findOne({username})
    if(alreadyUsername){
        console.error(`Username ${username} is already taken`)
        throw new Error(`Username ${username} is already taken`)
    }
}

export const existEmail = async(email)=>{
    const alreadyEmail = await User.findOne({email}) 
        if(alreadyEmail){
        console.error(`Email ${email} is already taken`)
        throw new Error(`Email ${email} is already taken`)
    }
}

export const existDPI = async (dpi = '') => {
  const exist = await User.findOne({ DPI: dpi })
  if (exist) throw new Error(`DPI already registered`)
}

export const findUser = async(id)=>{
    try{
        const userExist = await User.findById(id)
        if(!userExist) return false
        return userExist
    }catch(err){
        console.error(err)
        return false
    }
}

// Para citas
// Verifica si ya hay una cita programada con mismo doctor, fecha y hora
export const existAppointmentById = async (id = '') => {
  const exist = await Appointment.findById(id)
  if (!exist) {
    console.error(`Appointment with ID ${id} does not exist`)
    throw new Error(`Appointment with ID ${id} does not exist`)
  }
}


//Para diagnostico


export const diagnosisCodeExists = async (code = '') => {
  const exist = await Diagnosis.findOne({ code })
  if (exist) {
    console.error(`Diagnosis code ${code} is already taken`)
    throw new Error(`Diagnosis code ${code} is already taken`)
  }
}

// Validaciones para el historial medico

export const patientExists = async (id = '') => {
  const exist = await Patient.findById(id)
  if (!exist) {
    console.error(`Patient with ID ${id} does not exist`)
    throw new Error(`Patient with ID ${id} does not exist`)
  }
}

export const doctorExists = async (id = '') => {
  const exist = await User.findById(id)
  if (!exist) {
    console.error(`Doctor with ID ${id} does not exist`)
    throw new Error(`Doctor with ID ${id} does not exist`)
  }
}

export const diagnosesExist = async (id = '') => {
  const exist = await Diagnosis.findById(id)
  if (!exist) {
    console.error(`Doctor with ID ${id} does not exist`)
    throw new Error(`Doctor with ID ${id} does not exist`)
  }
}

/** 
export const prescriptionsExist = async (ids = []) => {
  for (let id of ids) {
    const exists = await Prescription.findById(id)
    if (!exists) {
      console.error(`Prescription with ID ${id} does not exist`)
      throw new Error(`Prescription with ID ${id} does not exist`)
    }
  }
}

*/

export const existMedicineName = async (name = '') => {
  const exists = await Pharmacy.findOne({ name })
    if (exists) throw new Error(`Medicine ${name} already exists`)
}

export const existDrug = async (id) => {
    const drug = await Pharmacy.findById(id)
    if (!drug) {
      console.error(`Drug with ID ${id} does not exist in Pharmacy`)
      throw new Error(`Drug with ID ${id} does not exist in Pharmacy`)
    }
    return true
}  

export const existMedicalHistory = async (id) => {
    const mh = await MedicalHistory.findById(id)
    if (!mh) {
      console.error(`MedicalHistory with ID ${id} does not exist`)
      throw new Error(`MedicalHistory with ID ${id} does not exist`)
    }
    return true
}

export const existUser = async (id) => {
    const user = await User.findById(id)
    if (!user) {
      console.error(`User con ID ${id} no existe`)
      throw new Error(`User con ID ${id} no existe`)
    }
    return true
}
