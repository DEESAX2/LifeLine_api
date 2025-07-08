import { Hospital } from '../models/hospital_model.js';

// GET all pending hospitals
export const getPendingHospitals = async (req, res) => {
  try {
    const hospitals = await Hospital.find({ isApproved: false });
    res.status(200).json(hospitals);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get pending hospitals', error: error.message });
  }
};

// Approve hospital
export const approveHospital = async (req, res) => {
  try {
    const { hospitalId } = req.params;
    const hospital = await Hospital.findByIdAndUpdate(
      hospitalId,
      { isApproved: true, status: 'approved' },
      { new: true }
    );
    if (!hospital) {
      return res.status(404).json({ message: 'Hospital not found' });
    }
    res.json({ message: 'Hospital approved successfully', hospital });
  } catch (error) {
    res.status(500).json({ message: 'Approval failed', error: error.message });
  }
};

// Decline hospital 
export const declineHospital = async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.params.hospitalId);
    if (!hospital) {
      return res.status(404).json({ message: 'Hospital not found' });
    }

    hospital.status = 'declined';
    hospital.isApproved = false;
    await hospital.save();

    res.status(200).json({ message: 'Hospital declined successfully', hospital });
  } catch (error) {
    res.status(500).json({ message: 'Decline failed', error: error.message });
  }
};

