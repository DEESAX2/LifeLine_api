import { Hospital } from '../models/hospital_model.js';

// GET all pending hospitals
export const getPendingHospitals = async (req, res) => {
  try {
    const hospitals = await Hospital.find({ isApproved: false }).select('-password');
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
    ).select('-password');
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
    const hospital = await Hospital.findById(req.params.hospitalId).select('-password');
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

// Admin dashboard summary
export const getAdminDashboardStats = async (req, res) => {
  try {
    const pendingCount = await Hospital.countDocuments({ status: 'pending' , role: 'hospital'});
    const approvedCount = await Hospital.countDocuments({ status: 'approved',role: 'hospital' });
    const declinedCount = await Hospital.countDocuments({ status: 'declined', role: 'hospital'});

    res.status(200).json({
      pending: pendingCount,
      approved: approvedCount,
      declined: declinedCount
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch dashboard data', error: error.message });
  }
};
// Get all approved hospitals (excluding admin)
export const getApprovedHospitals = async (req, res) => {
  try {
    const approvedHospitals = await Hospital.find({
      status: 'approved',
      role: 'hospital'
    }).select('-password');

    res.status(200).json(approvedHospitals);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get approved hospitals', error: error.message });
  }
};

// Get all declined hospitals (excluding admin)
export const getDeclinedHospitals = async (req, res) => {
  try {
    const declinedHospitals = await Hospital.find({
      status: 'declined',
      role: 'hospital'
    }).select('-password');

    res.status(200).json(declinedHospitals);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get declined hospitals', error: error.message });
  }
};

