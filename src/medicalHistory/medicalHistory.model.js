//MedicalHistory model

import {Schema, model} from 'mongoose'

const medicalHistorySchema = Schema (
        {
        patient: {
            type: Schema.Types.ObjectId,
            ref: 'Patient',
            required: [true, 'Patient is required'],
        },
        doctor: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Doctor is required'],
        },
        date: {
        type: Date,
        default: Date.now
        },
        reasonForVisit: {
            type: String,
            required: [true, 'Reason for Visit is required'],
        },
    //    symptoms: {
     //       type: [String], 
     //       required: [true, 'Symptoms is required'],
    //    },
        diagnosis: {
            type: Schema.Types.ObjectId,
            ref: 'Diagnosis',
            required: [true, 'Diagnosis is required'],
        },
        vitalSigns: {
        temperature: Number,
        heartRate: Number,
        respiratoryRate: Number,
        bloodPressure: String,
        oxygenSaturation: Number
    },
    physicalExam: {
        type: String
    },
    personalHistory: {
        type: String 
    },
    familyHistory: {
        type: String 
    },
    treatmentPlan: {
        type: String
    },
//    prescriptions: [{
 //       type: Schema.Types.ObjectId,
 //       ref: 'Prescription',
   //     required: [true, 'Prescription is required'],
  //  }],
//    testResults: [{
 //       type: Schema.Types.ObjectId,
    //    ref: 'Result'
  //  }],
    followUp: {
        type: String 
    },
    notes: {
        type: String
    }
  },
  {
    timestamps: true,
  }
)


export default model('MedicalHistory', medicalHistorySchema);