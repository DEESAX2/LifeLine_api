import { Router } from "express";
import { approveHospital, declineHospital, getPendingHospitals,getAdminDashboardStats } from "../controllers/admin_controller.js";
import { checkRole } from "../utils/roles.js";
import { protect } from "../middleware/auth.js";

export const adminRouter = Router();

adminRouter.get('/pending/hospitals',protect, checkRole('admin'),getPendingHospitals);
adminRouter.patch('/approve/:hospitalId',protect, checkRole('admin'), approveHospital);
adminRouter.patch('/decline/:hospitalId',protect, checkRole('admin'), declineHospital);
adminRouter.get('/dashboard/stats', protect, checkRole('admin'), getAdminDashboardStats);