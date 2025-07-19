'use strict'
import dotenv from 'dotenv';
import express from 'express'
import morgan from 'morgan'
import helmet from 'helmet' 
import cors from 'cors' 
import { limiter } from '../middlewares/rate.limit.js'
import authRoutes from '../src/auth/auth.routes.js'
import reportRoutes from '../src/report/report.routes.js'
import prescriptionRoutes from '../src/prescription/prescription.routes.js'
import { createDefaultAdmin } from '../src/auth/auth.controller.js'
import diagnosisRoutes from '../src/diagnosis/diagnosis.routes.js'
import appointmentRoutes from '../src/appointment/appointment.routes.js'
import medicalHistoryRoutes from '../src/medicalHistory/medicalHistory.routes.js'
import patientRoutes from '../src/patient/patient.routes.js'
import pharmacyRoutes from '../src/pharmacy/pharmacy.routes.js'
import informationResourceRoutes from '../src/informationResource/informationResource.routes.js'

dotenv.config();

const configs = (app)=>{
    app.use(express.json())
    app.use(express.urlencoded({extended: true}))
    app.use(cors())
    app.use(helmet())
    app.use(limiter)
    app.use(morgan('dev'))
    
}

export const initServer = async () => {
    const app = express();
    try {
        configs(app);
        routes(app);
        // Ejecutar antes de levantar el servidor
        await createDefaultAdmin()
        app.listen(process.env.PORT);
        console.log(`Server running in port ${process.env.PORT}`);
    } catch (err) {
        console.error('Servidor init failed', err);
    }
}

const routes = (app)=>{
    app.use(authRoutes)
    app.use('/v1/diagnosis',diagnosisRoutes)
    app.use('/v1/appointment', appointmentRoutes)
    app.use('/v1/medicalHistory', medicalHistoryRoutes)
    app.use('/v1/patients', patientRoutes)
    app.use('/v1/pharmacy', pharmacyRoutes)
    app.use('/v1/report', reportRoutes)
    app.use('/v1/prescription', prescriptionRoutes)
    app.use('/v1/informationResource', informationResourceRoutes)
}