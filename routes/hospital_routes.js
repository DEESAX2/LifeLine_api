import { Router } from "express";
import {
  getAppointments,
  createBloodRequest,
  searchDonors,
  getDonorList,
  getSingleHospitalDonor,
  getHospitalDashboardStats,
  markAppointmentAsDonated,
  getHospitalBloodRequests
} from "../controllers/hospital_controller.js";

import { protect } from "../middleware/auth.js";

export const hospitalRouter = Router();

// Appointment-related
hospitalRouter.get('/appointments', protect, getAppointments);
hospitalRouter.patch('/appointments/:id/donated', protect, markAppointmentAsDonated);

// Donor-related
hospitalRouter.get('/donors/filter', protect, searchDonors);
hospitalRouter.get('/donors', protect, getDonorList);
hospitalRouter.get('/donors/:donorId', protect, getSingleHospitalDonor);

// Blood requests
hospitalRouter.post('/requests', protect, createBloodRequest);
hospitalRouter.get('/blood-requests', protect, getHospitalBloodRequests);

// Dashboard
hospitalRouter.get('/dashboard/stats', protect, getHospitalDashboardStats);
