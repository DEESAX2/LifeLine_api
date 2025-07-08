import {model, Schema} from 'mongoose';
import normalize  from 'normalize-mongoose';

const donorSchema = new Schema ({
  fullName: String,
  age: Number,
  bloodType: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+','O-', 'I Dont Know' ],
    default: 'I Dont Know'
  },
  phone: {
    type: String
  },
  email: {
    type: String
  },
  appointment: { 
    type: Schema.Types.ObjectId, ref: 'Appointment' }
}, {timestamps: true});

donorSchema.plugin(normalize)
export const Donor = model('Donor', donorSchema);
