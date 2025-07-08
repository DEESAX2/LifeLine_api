import { Router } from "express";
import { createAppointment, viewBloodRequests } from "../controllers/donor_controller.js";

export const donorRouter = Router();

donorRouter.post('/appointment', createAppointment)
donorRouter.get('/blood/request', viewBloodRequests)