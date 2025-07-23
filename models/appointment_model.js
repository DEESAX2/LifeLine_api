import { model, Schema} from 'mongoose';
import normalize from 'normalize-mongoose';

const appointmentSchema = new Schema({
  hospital: { 
    type: Schema.Types.ObjectId, ref: 'Hospital' },
  donor: { 
    type: Schema.Types.ObjectId, ref: 'Donor' },
  bloodRequest: {  
    type: Schema.Types.ObjectId,
    ref: 'BloodRequest'
  },
  date: Date,
//   status: {
//     type: String,
//     enum: ['pending', 'approved', 'rejected'],
//     default: 'pending'
//   },
  hasDonated: {
    type: Boolean,
    default: false},
  message: {
    type: String
  }
},{timestamps: true});

appointmentSchema.plugin(normalize)

export const Appointment = model('Appointment', appointmentSchema);
