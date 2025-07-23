import { Appointment } from '../models/appointment_model.js';
import { BloodRequest } from '../models/bloodRequest_model.js';
import { bloodRequestSchema } from '../schema/bloodRequest_schema';
import { Hospital } from '../models/hospital_model.js';

// Get all appointments for a hospital
export const getAppointments = async (req, res) => {
  try {
    const hospitalId = req.user.id;
    const appointments = await Appointment.find({ hospital: hospitalId, hasDonated: false }).populate('donor');
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch appointments', error: error.message });
  }
};

// Create a blood request
export const createBloodRequest = async (req, res) => {
  try {
    const { bloodType, urgency, message, quantity, date } = req.body;

    // Joi validation
    const { error } = bloodRequestSchema.validate({ bloodType, urgency, message, quantity, date });
    if (error) return res.status(400).json({ message: error.details[0].message });

    const request = await BloodRequest.create({
      hospital: req.user.id,
      bloodType,
      urgency,
      message,
      quantity,
      date
    });

    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create blood request', error: error.message });
  }
};


// Search donors by name, age, or blood type
export const searchDonors = async (req, res) => {
  try {
    const hospitalId = req.user.id;
    const { name, age, bloodType } = req.query;

    const appointments = await Appointment.find({ hospital: hospitalId }).populate('donor');
    let donors = appointments.map(app => app.donor).filter(Boolean);

    if (name) {
      donors = donors.filter(d => d.fullName.toLowerCase().includes(name.toLowerCase()));
    }

    if (age) {
      donors = donors.filter(d => d.age === parseInt(age));
    }

    if (bloodType) {
      donors = donors.filter(d => d.bloodType === bloodType);
    }

    res.json(donors);
  } catch (error) {
    res.status(500).json({ message: 'Search failed', error: error.message });
  }
};

// Get donors who have donated to this hospital
export const getDonorList = async (req, res) => {
  try {
    const hospitalId = req.user.id;

    const appointments = await Appointment.find({
      hospital: hospitalId,
      hasDonated: true
    }).populate('donor');

    const donors = appointments.map(app => app.donor).filter(Boolean);

    res.json(donors);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch donors', error: error.message });
  }
};

// Get detailed info for a single donor
export const getSingleHospitalDonor = async (req, res) => {
  try {
    const hospitalId = req.user.id;
    const { donorId } = req.params;

    const appointment = await Appointment.findOne({
      hospital: hospitalId,
      donor: donorId
    }).populate('donor');

    if (!appointment || !appointment.donor) {
      return res.status(404).json({ message: 'Donor not found for this hospital' });
    }

    res.json(appointment.donor);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch donor', error: error.message });
  }
};

// Get hospital dashboard statistics
export const getHospitalDashboardStats = async (req, res) => {
  try {
    const hospitalId = req.user.id;

    const totalDonated = await Appointment.countDocuments({
      hospital: hospitalId,
      hasDonated: true
    });

    const pendingApproved = await Appointment.countDocuments({
      hospital: hospitalId,
    //   status: 'approved',
      hasDonated: false
    });

    // Count total blood requests made by a hospital
    const totalBloodRequests = await BloodRequest.countDocuments({
      hospital: hospitalId
    });
    res.json({
      totalDonors: totalDonated,
      pendingAppointments: pendingApproved,
      totalBloodRequests: totalBloodRequests
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch dashboard stats', error: error.message });
  }
};

// Mark appointment as donated
export const markAppointmentAsDonated = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
     if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
// Check if the appointment belongs to the logged-in hospital
    if (appointment.hospital.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied: You do not own this appointment' });
    }

    const updatedappointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { hasDonated: true },
      { new: true }
    ).populate('donor');
    

    res.json({ message: 'Appointment marked as donated', appointment: updatedappointment });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update donation status', error: error.message });
  }
};

// View all blood requests made by this hospital
export const getHospitalBloodRequests = async (req, res) => {
  try {
    const requests = await BloodRequest.find({ hospital: req.user.id }).sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch blood requests', error: error.message });
  }
};
export const deleteBloodRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const hospitalId = req.user.id; 

    const request = await BloodRequest.findById(id);

    if (!request) {
      return res.status(404).json({ message: 'Blood request not found' });
    }

    if (request.hospital.toString() !== hospitalId) {
      return res.status(403).json({ message: 'Unauthorized: You can only delete your own requests' });
    }

    await BloodRequest.findByIdAndDelete(id);

    res.status(200).json({ message: 'Blood request deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete blood request', error: error.message });
  }
};

// Get a single blood request by ID
export const getSingleBloodRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const request = await BloodRequest.findById(id).populate('hospital', 'name location email');
    if (!request) {
      return res.status(404).json({ message: 'Blood request not found' });
    }
    
    // Ensure only the hospital that created the request can access it
    if (request.hospital.id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied. Not your blood request.' });
    }

    res.status(200).json(request);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch blood request', error: error.message });
  }
};

// Get the logged-in hospital's profile
export const getHospitalProfile = async (req, res) => {
  try {
    const hospitalId = req.user.id;

    const hospital = await Hospital.findById(hospitalId).select('name');
    
    if (!hospital) {
      return res.status(404).json({ message: 'Hospital not found' });
    }

    res.status(200).json(hospital);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch hospital profile', error: error.message });
  }
};