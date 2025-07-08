import{ model, Schema}from 'mongoose';
import normalize  from 'normalize-mongoose';

const bloodRequestSchema = new Schema({
  hospital: { 
    type: Schema.Types.ObjectId, ref: 'Hospital' },
  bloodType: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+','O-', 'Any Blood group type'],
    default: 'Any Blood group type'
  },
  urgency:{
    type: String,
    enum: ['critical', 'high', 'medium', 'low'],
    default:'critical'
  },
  quantity:{
    type: String
  },
  message:{
    type: String
  },
  date: { 
    type: Date, 
    default: Date.now }
},{timestamps: true});

bloodRequestSchema.plugin(normalize)
export const BloodRequest = model('BloodRequest', bloodRequestSchema);
