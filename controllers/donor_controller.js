import { Donor } from '../models/donor_model.js';
import { Appointment } from '../models/appointment_model.js';
import { BloodRequest } from '../models/bloodRequest_model.js';
import { donorSchema } from '../schema/donor_schema.js';
import { appointmentSchema } from '../schema/appointment_schema.js';
import { Hospital } from '../models/hospital_model.js';
export const createAppointment = async (req, res) => {
  try {
    const { fullName, age, bloodType, phone, email, date, hospitalId, message } = req.body;

    // Validate donor details
    const donorValidation = donorSchema.validate({ fullName, age, bloodType, phone, email });
    if (donorValidation.error)
      return res.status(400).json({ message: donorValidation.error.details[0].message });

    // Validate appointment details (excluding references)
    const appointmentValidation = appointmentSchema.validate({ date, message });
    if (appointmentValidation.error)
      return res.status(400).json({ message: appointmentValidation.error.details[0].message });

    // Save donor
    const donor = new Donor({ fullName, age, bloodType, phone, email });
    await donor.save();

    // Create appointment
    const appointment = new Appointment({
      hospital: hospitalId,
      donor: donor.id,
      date,
      message
    });
    await appointment.save();

    // Link appointment to donor
    donor.appointment = appointment.id;
    await donor.save();

    res.status(201).json({ message: 'Appointment booked successfully', donor, appointment });
  } catch (error) {
    res.status(500).json({ message: 'Failed to book appointment', error: error.message });
  }
};


//  Book appointment in response to a specific blood request
export const createAppointmentFromRequest = async (req, res) => {
  try {
    const { fullName, age, bloodType, phone, email, date, message } = req.body;
    const { requestId } = req.params;

    // Validate donor input
    const { error } = donorSchema.validate({ fullName, age, bloodType, phone, email });
    if (error) return res.status(400).json({ message: error.details[0].message });

    // Find the blood request
    const bloodRequest = await BloodRequest.findById(requestId);
    if (!bloodRequest) {
      return res.status(404).json({ message: 'Blood request not found' });
    }

    // Create donor
    const donor = new Donor({ fullName, age, bloodType, phone, email });
    await donor.save();

    // Create appointment linked to blood request's hospital
    const appointment = new Appointment({
      hospital: bloodRequest.hospital,
      donor: donor.id,
      bloodRequest: bloodRequest.id,
      date,
      message
    });
    await appointment.save();

    donor.appointment = appointment.id;
    await donor.save();

    // Populate hospital details
const populatedAppointment = await Appointment.findById(appointment.id)
  .populate('hospital', 'name location email')
  .populate('bloodRequest');

    res.status(201).json({ message: 'Appointment booked for this blood request', donor, appointment: populatedAppointment });
  } catch (error) {
    res.status(500).json({ message: 'Failed to book appointment from request', error: error.message });
  }
};

export const viewBloodRequests = async (req, res) => {
  try {
    const { bloodType, urgency, page = 1, limit = 10 } = req.query;

    const filter = {};
    if (bloodType) filter.bloodType = bloodType;
    if (urgency) filter.urgency = urgency;

    const requests = await BloodRequest.find(filter)
      .populate('hospital', 'name location')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await BloodRequest.countDocuments(filter);

    res.status(200).json({
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
      requests
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch blood requests', error: error.message });
  }
};

// getting a single blood request 
export const getSingleBloodRequest = async (req, res) => {
  try {
    const request = await BloodRequest.findById(req.params.id).populate('hospital', 'name location');
    if (!request) {
      return res.status(404).json({ message: 'Blood request not found' });
    }

    res.status(200).json(request);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve blood request', error: error.message });
  }
};
// this is to get only approved hospitals in the system by donor to book appointment 
export const getApprovedHospitals = async (req, res) => {
  try {
    const hospitals = await Hospital.find({
      isApproved: true,
      status: 'approved',
      role:'hospital'
    }).select('name location email phone');

    res.status(200).json(hospitals);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch approved hospitals', error: error.message });
  }
};