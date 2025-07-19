//Auth controller
import User from '../user/user.model.js'
import Patient from '../patient/patient.model.js'
import { encrypt, checkPassword } from '../../utils/encrypt.js'
import { generateJwt } from '../../utils/jwt.js'

// Registrar paciente
export const registerPatient = async (req, res) => {
  try {
    const data = req.body

    const user = new User({
      name: data.name,
      surname: data.surname,
      username: data.username,
      DPI: data.DPI,
      email: data.email,
      phone: data.phone,
      password: await encrypt(data.password),
      role: 'PATIENT'
    })

    const savedUser = await user.save()

    const patient = new Patient({
      user: savedUser._id,
      birthDate: data.birthDate,
      gender: data.gender,
      address: data.address,
      bloodType: data.bloodType,
      allergies: data.allergies || [],
      chronicDiseases: data.chronicDiseases || []
    })

    await patient.save()

    return res.status(201).send({
      message: 'Patient registered successfully',
      user: savedUser,
      patient
    })
  } catch (err) {
    console.error(err)
    return res.status(500).send({ message: 'Register error', error: err })
  }
}

// Login paciente
export const loginPatient = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })

    if (!user || user.role !== 'PATIENT')
      return res.status(404).send({ message: 'Patient not found' })

    const match = await checkPassword(user.password, password)
    if (!match) return res.status(401).send({ message: 'Invalid password' })

    const token = await generateJwt({
      uid: user._id,
      name: user.name,
      role: user.role
    })

    const patient = await Patient.findOne({ user: user._id })

    return res.send({
      message: `Welcome ${user.name}`,
      user,
      patient,
      token
    })
  } catch (err) {
    console.error(err)
    return res.status(500).send({ message: 'Login error', error: err })
  }
}

// Crear administrador por defecto (una vez)
export const createDefaultAdmin = async () => {
  try {
    const existAdmin = await User.findOne({ role: 'ADMIN' })
    if (existAdmin) return

    const defaultAdmin = new User({
      name: 'Admin',
      surname: 'HOPE',
      username: 'admin',
      DPI: '1234567890123',
      email: 'admin@hope.com',
      password: await encrypt('Admin123!'),
      phone: '12345678',
      role: 'ADMIN'
    })

    await defaultAdmin.save()
    console.log('Default admin created')
  } catch (err) {
    console.error('Failed to create default admin:', err)
  }
}

// Login de administrador
export const loginAdmin = async (req, res) => {
  try {
    const { userLoggin, password } = req.body

    const admin = await User.findOne({
      $or: [
        { email: userLoggin },
        { username: userLoggin }
      ],
      role: 'ADMIN'
    })

    if (!admin)
      return res.status(404).send({ message: 'Admin not found' })

    const validPassword = await checkPassword(admin.password, password)
    if (!validPassword)
      return res.status(401).send({ message: 'Incorrect password' })

    const token = await generateJwt({
      uid: admin._id,
      name: admin.name,
      role: admin.role
    })

    return res.send({
      message: `Welcome ${admin.name}`,
      user: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        DPI: admin.DPI
      },
      token
    })
  } catch (err) {
    console.error(err)
    return res.status(500).send({ message: 'Login error', err })
  }
}