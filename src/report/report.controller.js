// src/report/report.controller.js
import PDFDocument from 'pdfkit'
import Report from './report.model.js'
import Patient from '../patient/patient.model.js'
import Appointment from '../appointment/appointment.model.js'
import Result from '../result/result.model.js'
import Prescription from '../prescription/prescription.model.js'

/**
 * Ahora usamos POST + x-www-form-urlencoded.
 * Body: {
 *   type: 'year' | 'quarter' | 'month',
 *   year: 2025,
 *   quarter: 1..4,   // solo si type='quarter'
 *   month: 1..12     // solo si type='month'
 * }
 */
export const downloadHospitalReport = async (req, res) => {
  try {
    // ──────────────────────────────────────────────────────────────────────────
    // 1) Leemos parámetros del body y hacemos un console.log para debugging
    // ──────────────────────────────────────────────────────────────────────────
    const typeParam = (req.body.type || 'year').toString().trim().toLowerCase()
    const yearParam = parseInt(req.body.year) || new Date().getFullYear()
    const quarterParam = parseInt(req.body.quarter)    // puede ser NaN si no existe
    const monthParam = parseInt(req.body.month)        // puede ser NaN si no existe

    console.log('>>> [downloadHospitalReport] typeParam =', typeParam,
                'yearParam =', yearParam,
                'quarterParam =', quarterParam,
                'monthParam =', monthParam)

    let startDate, endDate
    let categories = []
    let labelPeriodo = ''

    if (typeParam === 'year') {
      // ─── Año completo ───
      startDate = new Date(yearParam, 0, 1, 0, 0, 0)
      endDate = new Date(yearParam + 1, 0, 1, 0, 0, 0)
      categories = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic']
      labelPeriodo = `Año ${yearParam}`

    } else if (typeParam === 'quarter') {
      // ─── Trimestre específico ───
      if (!quarterParam || quarterParam < 1 || quarterParam > 4) {
        return res.status(400).json({
          message: "Si type='quarter', debes enviar quarter=1..4."
        })
      }
      const q = quarterParam
      const startMonth = (q - 1) * 3
      startDate = new Date(yearParam, startMonth, 1, 0, 0, 0)
      endDate   = new Date(yearParam, startMonth + 3, 1, 0, 0, 0)

      const allMonths = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic']
      categories = allMonths.slice(startMonth, startMonth + 3)
      labelPeriodo = `Trimestre ${q} / ${yearParam}`

    } else if (typeParam === 'month') {
      // ─── Mes específico ───
      if (!monthParam || monthParam < 1 || monthParam > 12) {
        return res.status(400).json({
          message: "Si type='month', debes enviar month=1..12."
        })
      }
      const m = monthParam
      startDate = new Date(yearParam, m - 1, 1, 0, 0, 0)
      endDate   = new Date(yearParam, m, 1, 0, 0, 0)
      // ¿Cuántos días tiene ese mes?
      const daysInMonth = new Date(yearParam, m, 0).getDate()
      categories = Array.from({ length: daysInMonth }, (_, i) => `${i + 1}`)  // ["1","2",...]
      labelPeriodo = `Mes ${m}/${yearParam}`

    } else {
      // ─── Si no es ni year, ni quarter, ni month ───
      return res.status(400).json({
        message: "Parámetro 'type' inválido. Debe ser 'year', 'quarter' o 'month'."
      })
    }

    // ──────────────────────────────────────────────────────────────────────────
    // 2) Hacemos las agregaciones (count por mes o por día, según corresponda)
    // ──────────────────────────────────────────────────────────────────────────
    const groupBy = (typeParam === 'month') ? 'day' : 'month'

    const getCounts = async (Model) => {
      const groupId = (groupBy === 'month')
        ? { $month: '$createdAt' }
        : { $dayOfMonth: '$createdAt' }

      const pipeline = [
        { $match: { createdAt: { $gte: startDate, $lt: endDate } } },
        { $group: { _id: groupId, count: { $sum: 1 } } }
      ]
      return Model.aggregate(pipeline)
    }

    // Ejecutamos en paralelo las 5 consultas
    const [
      aggPatients,
      aggAppointments,
      aggReports,
      aggResults,
      aggPrescriptions
    ] = await Promise.all([
      getCounts(Patient),
      getCounts(Appointment),
      getCounts(Report),
      getCounts(Result),
      getCounts(Prescription)
    ])

    // ──────────────────────────────────────────────────────────────────────────
    // 3) Inicializamos arrays en cero con longitud = categories.length
    // ──────────────────────────────────────────────────────────────────────────
    const n = categories.length
    const patientCounts      = Array(n).fill(0)
    const appointmentCounts  = Array(n).fill(0)
    const reportCounts       = Array(n).fill(0)
    const resultCounts       = Array(n).fill(0)
    const prescriptionCounts = Array(n).fill(0)

    // ──────────────────────────────────────────────────────────────────────────
    // 4) Función auxiliar para calcular el índice en el array
    // ──────────────────────────────────────────────────────────────────────────
    const calcularIndice = (idValue) => {
      if (typeParam === 'year') {
        // idValue viene 1..12  → índice 0..11
        return idValue - 1
      }
      if (typeParam === 'quarter') {
        const q = quarterParam
        const startMonth = (q - 1) * 3      // 0-indexed (p.ej trimestre 2 → startMonth=3)
        // idValue = mes del 1..12. Para que abril (4) sea idx=0:  4 - (3+1) = 0
        return idValue - (startMonth + 1)
      }
      if (typeParam === 'month') {
        // idValue viene 1..díasDelMes → índice 0..díasDelMes-1
        return idValue - 1
      }
      return -1
    }

    // ──────────────────────────────────────────────────────────────────────────
    // 5) Volcamos los resultados de la agregación en nuestros arrays
    // ──────────────────────────────────────────────────────────────────────────
    aggPatients.forEach(item => {
      const idx = calcularIndice(item._id)
      if (idx >= 0 && idx < n) patientCounts[idx] = item.count
    })
    aggAppointments.forEach(item => {
      const idx = calcularIndice(item._id)
      if (idx >= 0 && idx < n) appointmentCounts[idx] = item.count
    })
    aggReports.forEach(item => {
      const idx = calcularIndice(item._id)
      if (idx >= 0 && idx < n) reportCounts[idx] = item.count
    })
    aggResults.forEach(item => {
      const idx = calcularIndice(item._id)
      if (idx >= 0 && idx < n) resultCounts[idx] = item.count
    })
    aggPrescriptions.forEach(item => {
      const idx = calcularIndice(item._id)
      if (idx >= 0 && idx < n) prescriptionCounts[idx] = item.count
    })

    // ──────────────────────────────────────────────────────────────────────────
    // 6) Generar el PDF
    // ──────────────────────────────────────────────────────────────────────────
    const doc = new PDFDocument({ size: 'A4', margin: 50 })

    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="hospital-estadisticas-${labelPeriodo}.pdf"`
    )
    doc.pipe(res)

    // --- Título ---
    doc
      .fontSize(20)
      .fillColor('#333333')
      .text('Reporte de Estadísticas - HOPE', 50, 60, {
        align: 'center',
        width: 500
      })

    // --- Subtítulo con el periodo ---
    doc
      .fontSize(14)
      .fillColor('#2c3e50')
      .text(`Periodo: ${labelPeriodo}`, 50, doc.y + 5, {
        align: 'center',
        width: 500
      })

    // --- Fecha de generación ---
    const ahora = new Date()
    doc
      .fontSize(10)
      .fillColor('#555555')
      .text(
        `Fecha de generación: ${ahora.toLocaleDateString()} ${ahora.toLocaleTimeString()}`,
        50,
        doc.y + 5,
        {
          align: 'right',
          width: 500
        }
      )

    doc.moveDown(2)

    // --- Sección 1: Totales Generales ---
    doc
      .fontSize(14)
      .fillColor('#2c3e50')
      .text('1. Totales Generales (en periodo)', 50, doc.y, {
        underline: true,
        width: 500
      })
      .moveDown(0.5)

    // Sumar cada array para obtener el total del periodo
    const sumaArray = arr => arr.reduce((acc, x) => acc + x, 0)
    const totalPatients      = sumaArray(patientCounts)
    const totalAppointments  = sumaArray(appointmentCounts)
    const totalReports       = sumaArray(reportCounts)
    const totalResults       = sumaArray(resultCounts)
    const totalPrescriptions = sumaArray(prescriptionCounts)

    doc
      .fontSize(12)
      .fillColor('#000000')
      .list(
        [
          `Pacientes nuevos: ${totalPatients}`,
          `Citas en rango: ${totalAppointments}`,
          `Reportes generados: ${totalReports}`,
          `Resultados de laboratorio: ${totalResults}`,
          `Prescripciones: ${totalPrescriptions}`
        ],
        {
          bulletRadius: 2,
          textIndent: 20,
          width: 500
        }
      )
      .moveDown(1)

    // --- Divisoria ---
    doc
      .strokeColor('#aaaaaa')
      .moveTo(50, doc.y)
      .lineTo(545, doc.y)
      .stroke()
      .moveDown(1)

    // --- Sección 2: Gráfica de Barras ---
    doc
      .fontSize(14)
      .fillColor('#2c3e50')
      .text('2. Gráfica Comparativa', 50, doc.y, {
        underline: true,
        width: 500
      })
      .moveDown(0.5)

    // Definimos área de la gráfica
    const chartX = 50
    const chartY = doc.y
    const chartWidth = 500
    const chartHeight = 200

    const maxCount = Math.max(
      ...patientCounts,
      ...appointmentCounts,
      ...reportCounts,
      ...resultCounts,
      ...prescriptionCounts,
      1
    )

    const barCount   = n
    const totalBarWidth = chartWidth * 0.8
    const barWidth      = totalBarWidth / barCount
    const spaceLeft     = chartWidth - totalBarWidth
    const spaceBetween  = spaceLeft / (barCount + 1)

    // Dibujar ejes
    doc
      .save()
      .strokeColor('#000000')
      .lineWidth(1)
      .moveTo(chartX, chartY)
      .lineTo(chartX, chartY + chartHeight)
      .stroke()
      .moveTo(chartX, chartY + chartHeight)
      .lineTo(chartX + chartWidth, chartY + chartHeight)
      .stroke()
      .restore()

    // Colores para las cinco series
    const colors = [
      'rgba(52,152,219,0.8)',   // Pacientes
      'rgba(46,204,113,0.8)',   // Citas
      'rgba(231,76,60,0.8)',    // Reportes
      'rgba(155,89,182,0.8)',   // Resultados
      'rgba(241,196,15,0.8)'    // Prescripciones
    ]

    // Función para dibujar las sub-barras (5 series)
    const drawBarSeries = (dataArray, seriesIndex) => {
      dataArray.forEach((count, i) => {
        const barHeight = (count / maxCount) * (chartHeight - 20)
        const x =
          chartX +
          spaceBetween * (i + 1) +
          barWidth * i +
          (barWidth / 6) * seriesIndex
        const y = chartY + chartHeight - barHeight

        doc
          .save()
          .rect(x, y, barWidth / 6, barHeight)
          .fillColor(colors[seriesIndex])
          .fill()
          .restore()
      })
    }

    drawBarSeries(patientCounts, 0)
    drawBarSeries(appointmentCounts, 1)
    drawBarSeries(reportCounts, 2)
    drawBarSeries(resultCounts, 3)
    drawBarSeries(prescriptionCounts, 4)

    // Etiquetas (categorías: mes o día)
    categories.forEach((label, i) => {
      const xText =
        chartX +
        spaceBetween * (i + 1) +
        barWidth * i +
        (barWidth / 2) -
        10
      doc
        .fontSize(8)
        .fillColor('#000000')
        .text(label, xText, chartY + chartHeight + 5, {
          width: barWidth,
          align: 'center'
        })
    })

    // Leyenda
    const leyendaX = chartX
    const leyendaY = chartY + chartHeight + 25
    const leyendas = ['Pacientes','Citas','Reportes','Resultados','Prescripciones']
    leyendas.forEach((texto, idx) => {
      doc
        .save()
        .rect(leyendaX + idx * 100, leyendaY, 10, 10)
        .fillColor(colors[idx])
        .fill()
        .restore()
      doc
        .fontSize(9)
        .fillColor('#000000')
        .text(texto, leyendaX + idx * 100 + 15, leyendaY - 1)
    })

    // ----- SECCIÓN 3: Resumen Breve -----
    // Calculamos una Y de inicio que esté bien debajo de la leyenda:
    const yResumenTitulo = leyendaY + 30
    doc
      .fontSize(14)
      .fillColor('#2c3e50')
      .text('3. Resumen Breve del Hospital', 50, yResumenTitulo, {
        underline: true,
        width: 500
      })

    const yTextoResumen = yResumenTitulo + 20
    const textoResumen = `
El presente reporte cubre el periodo ${labelPeriodo}. En este lapso se registraron ${totalPatients} pacientes nuevos, ${totalAppointments} citas, ${totalReports} reportes clínicos, ${totalResults} resultados de laboratorio y ${totalPrescriptions} prescripciones.

El equipo médico de HOPE se enfoca en la atención oportuna y personalizada. Agradecemos a todo el personal y a nuestros pacientes por la confianza depositada en nosotros.
    `.trim()

    doc
      .fontSize(12)
      .fillColor('#000000')
      .text(textoResumen, 50, yTextoResumen, {
        align: 'justify',
        lineGap: 4,
        width: 500
      })

    // Pie de página
    doc
      .fontSize(8)
      .fillColor('#888888')
      .text(
        'Hospital HOPE • Dirección: Calle Falsa 123, Ciudad • Teléfono: +502 1234-5678',
        50,
        780,
        {
          align: 'center',
          width: 500
        }
      )

    doc.end()
  } catch (err) {
    console.error('Error generando PDF:', err)
    return res.status(500).json({
      message: 'Ocurrió un error al generar el PDF',
      error: err.message
    })
  }
}

