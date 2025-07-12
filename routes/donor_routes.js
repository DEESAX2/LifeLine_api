import { Router } from "express";
import { createAppointment, viewBloodRequests,getSingleBloodRequest,createAppointmentFromRequest,getApprovedHospitals } from "../controllers/donor_controller.js";

export const donorRouter = Router();

donorRouter.post('/appointment', createAppointment);
donorRouter.get('/blood/request', viewBloodRequests);
donorRouter.get('/blood/request/:id', getSingleBloodRequest);
donorRouter.post('/blood/request/:requestId/appointment', createAppointmentFromRequest);
donorRouter.get('/hospitals', getApprovedHospitals);

