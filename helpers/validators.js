// src/helpers/validators.js

import { body } from 'express-validator'
import { validateErrors } from './validate.error.js'
import { existEmail, existUsername, existDPI, existMedicineName, diagnosisCodeExists, doctorExists, patientExists, diagnosesExist, existMedicalHistory, existUser, existDrug,} from './db.validators.js'

export const registerPatientValidator = [
  body('name', 'Name cannot be empty').notEmpty(),
  body('surname', 'Surname cannot be empty').notEmpty(),
  body('DPI', 'DPI must be a valid 13-digit number')
    .notEmpty()
    .isLength({ min: 13, max: 13 })
    .isNumeric()
    .custom(existDPI),
  body('email', 'Email cannot be empty or is not a valid email')
    .notEmpty()
    .isEmail()
    .custom(existEmail),
  body('username', 'Username cannot be empty')
    .notEmpty()
    .toLowerCase()
    .custom(existUsername),
  body('password', 'Password must be strong and at least 8 characters')
    .notEmpty()
    .isLength({ min: 8 })
    .isStrongPassword(),
  body('birthDate', 'Birth date is required').notEmpty().isDate(),
  body('gender', 'Gender is required and must be valid')
    .notEmpty()
    .isIn(['MALE', 'FEMALE']),
  body('bloodType', 'Blood type is required')
    .notEmpty()
    .isIn(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']),
  validateErrors
]

export const loginValidatorPatient = [
  body('email', 'Email cannot be empty').notEmpty().isEmail(),
  body('password', 'Password must be strong and at least 8 characters')
    .notEmpty()
    .isLength({ min: 8 })
    .isStrongPassword(),
  validateErrors
]

export const loginValidator = [
  body('userLoggin', 'Username or email cannot be empty')
    .notEmpty()
    .toLowerCase(),
  body('password', 'Password must be strong and at least 8 characters')
    .notEmpty()
    .isLength({ min: 8 })
    .isStrongPassword(),
  validateErrors
]

export const appointmentValidator = [
  body('patient', 'Patient ID cannot be empty').notEmpty(),
  body('doctor', 'Doctor ID cannot be empty').notEmpty(),
  body('date', 'Date cannot be empty').notEmpty(),
  body('timeSlot', 'Time Slot cannot be empty').notEmpty(),
  body('reason', 'Reason cannot be empty').notEmpty(),
  body('status').optional().isIn(['scheduled', 'completed', 'cancelled', 'no-show']),
  body('notes', 'Notes cannot be empty').notEmpty(),
  validateErrors
]

export const diagnosisValidator = [
  body('code', 'Code cannot be empty').notEmpty().custom(diagnosisCodeExists),
  body('name', 'Name cannot be empty').notEmpty(),
  body('description', 'Description cannot be empty').notEmpty(),
  body('severity').optional().isIn(['mild', 'moderate', 'severe', 'chronic']),
  validateErrors
]

export const medicalHistoryValidator = [
  body('patient', 'Patient ID cannot be empty').notEmpty().bail().custom(patientExists),
  body('doctor', 'Doctor ID cannot be empty').notEmpty().bail().custom(doctorExists),
  body('reasonForVisit', 'Reason for Visit cannot be empty').notEmpty(),
//  body('symptoms', 'Symptoms cannot be empty and must be an array').isArray({ min: 1 }),
  body('diagnosis', 'Diagnosis must be an array of IDs').notEmpty().custom(diagnosesExist),
  body('vitalSigns.temperature').optional().isNumeric(),
  body('vitalSigns.heartRate').optional().isNumeric(),
  body('vitalSigns.respiratoryRate').optional().isNumeric(),
  body('vitalSigns.bloodPressure').optional().isString(),
  body('vitalSigns.oxygenSaturation').optional().isNumeric(),
//  body('prescriptions', 'Prescriptions must be an array of IDs').isArray({ min: 1 }).bail().custom(prescriptionsExist),
  body('testResults').optional().isArray(),
]
export const updatePatientValidator = [
  body('birthDate', 'Invalid birth date')
    .optional()
    .isDate(),
  body('gender', 'Invalid gender')
    .optional()
    .isIn(['MALE', 'FEMALE']),
  body('address', 'Address must be less than 100 characters')
    .optional()
    .isLength({ max: 100 }),
  body('bloodType', 'Invalid blood type')
    .optional()
    .isIn(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']),
  validateErrors
]

export const addMedicineValidator = [
  body('name', 'Medicine name cannot be empty')
    .notEmpty()
    .custom(existMedicineName),
  body('description', 'Description cannot be empty')
    .notEmpty(),
  body('expirationDate', 'Expiration date must be a valid date')
    .notEmpty()
    .isISO8601()
    .toDate(),
  body('stock', 'Stock must be a number greater than or equal to 0')
    .notEmpty()
    .isInt({ min: 0 }),
  body('provider', 'Provider name cannot be empty')
    .notEmpty(),
  validateErrors
]

export const updateMedicineValidator = [
  body('name')
    .optional()
    .notEmpty()
    .withMessage('Name must not be empty if provided'),

  body('description')
    .optional()
    .notEmpty()
    .withMessage('Description must not be empty if provided'),

  body('expirationDate')
    .optional()
    .isISO8601()
    .withMessage('Expiration date must be valid'),

  body('stock')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Stock must be a non-negative number'),

  body('provider')
    .optional()
    .notEmpty()
    .withMessage('Provider must not be empty if provided'),
  validateErrors
]


export const prescriptionValidator = [
  // medicalHistory: requerido, debe ser ObjectId válido y existir en MedicalHistory
  body('medicalHistory', 'medicalHistory es requerido')
    .notEmpty()
    .isMongoId()
    .withMessage('medicalHistory debe ser un ID válido')
    .bail()
    .custom(existMedicalHistory),

  // doctor: requerido, debe ser ObjectId válido y existir en User
  body('doctor', 'Doctor es requerido')
    .notEmpty()
    .isMongoId()
    .withMessage('doctor debe ser un ID válido')
    .bail()
    .custom(existUser),

  // medications: arreglo con al menos un elemento
  body('medications', 'Medications debe ser un arreglo con al menos un elemento')
    .isArray({ min: 1 }),

  // Para cada elemento de medications:
  body('medications.*.drug', 'Drug es requerido')
    .notEmpty()
    .isMongoId()
    .withMessage('Drug debe ser un ID válido')
    .bail()
    .custom(existDrug),

  body('medications.*.dosage', 'Dosage es requerido')
    .notEmpty()
    .isString()
    .withMessage('Dosage debe ser texto'),

  body('medications.*.frequency', 'Frequency es requerido')
    .notEmpty()
    .isString()
    .withMessage('Frequency debe ser texto'),

  body('medications.*.duration', 'Duration es requerido')
    .notEmpty()
    .isString()
    .withMessage('Duration debe ser texto'),

  body('medications.*.notes')
    .optional()
    .isString()
    .withMessage('Notes debe ser texto'),

  // notes (campo general) es opcional
  body('notes')
    .optional()
    .isString()
    .withMessage('Notes debe ser texto'),

  validateErrors
]
