import { Router } from "express";
import {
  getAppointments,
  createBloodRequest,
  searchDonors,
  getDonorList,
  getSingleHospitalDonor,
  getHospitalDashboardStats,
  markAppointmentAsDonated,
  getHospitalBloodRequests,
  deleteBloodRequest,
  getSingleBloodRequest,
  getHospitalProfile
} from "../controllers/hospital_controller.js";

import { protect, checkHospitalApproval } from "../middleware/auth.js";
import { checkRole } from "../utils/roles.js";

export const hospitalRouter = Router();

// Appointment-related
hospitalRouter.get('/appointments', protect, checkRole('hospital'), checkHospitalApproval, getAppointments);
hospitalRouter.patch('/appointments/:id/donated', protect, checkRole('hospital'), checkHospitalApproval, markAppointmentAsDonated);

// Donor-related
hospitalRouter.get('/donors/filter', protect, checkRole('hospital'), checkHospitalApproval, searchDonors);
hospitalRouter.get('/donors', protect, checkRole('hospital'), checkHospitalApproval, getDonorList);
hospitalRouter.get('/donors/:donorId', protect,checkRole('hospital'),checkHospitalApproval, getSingleHospitalDonor);

// Blood requests
hospitalRouter.post('/requests', protect, checkRole('hospital'), checkHospitalApproval, createBloodRequest);
hospitalRouter.get('/blood-requests', protect, checkRole('hospital'), checkHospitalApproval, getHospitalBloodRequests);
hospitalRouter.delete('/delete/blood-requests/:id', protect, checkRole('hospital'), checkHospitalApproval, deleteBloodRequest);
hospitalRouter.get('/blood-requests/:id', protect, checkRole('hospital'), checkHospitalApproval, getSingleBloodRequest);

// Dashboard
hospitalRouter.get('/dashboard/stats', protect, checkRole('hospital'), getHospitalDashboardStats);
// hospital profile
hospitalRouter.get('/profile', protect,checkRole('hospital'), getHospitalProfile);