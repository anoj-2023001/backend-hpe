//Pharmacy model
import { Schema, model } from 'mongoose'

const pharmacySchema = Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      maxLength: [100, 'Name must be less than 100 characters']
    },
    description: {
      type: String,
      maxLength: [300, 'Description must be less than 300 characters']
    },
    stock: {
      type: Number,
      required: [true, 'Stock is required'],
      min: [0, 'Stock cannot be negative']
    },
    expirationDate: {
      type: Date,
      required: [true, 'Expiration date is required']
    },
    provider: {
      type: String,
      required: [true, 'Provider is required']
    },
    status: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
)

export default model('Pharmacy', pharmacySchema)
