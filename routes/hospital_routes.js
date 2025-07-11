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
import { checkRole } from "../utils/roles.js";

export const hospitalRouter = Router();

// Appointment-related
hospitalRouter.get('/appointments', protect, checkRole('hospital'), getAppointments);
hospitalRouter.patch('/appointments/:id/donated', protect, checkRole('hospital',), markAppointmentAsDonated);

// Donor-related
hospitalRouter.get('/donors/filter', protect, checkRole('hospital'), searchDonors);
hospitalRouter.get('/donors', protect, checkRole('hospital'), getDonorList);
hospitalRouter.get('/donors/:donorId', protect,checkRole('hospital'), getSingleHospitalDonor);

// Blood requests
hospitalRouter.post('/requests', protect, checkRole('hospital'), createBloodRequest);
hospitalRouter.get('/blood-requests', protect, checkRole('hospital'), getHospitalBloodRequests);

// Dashboard
hospitalRouter.get('/dashboard/stats', protect, checkRole('hospital'), getHospitalDashboardStats);
