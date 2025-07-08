import {Hospital} from '../models/hospital_model.js';
import { secret } from "../config/env.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const registerHospital = async (req, res) => {
  try {
    const { name, email, password, location, phone } = req.body;
    const existing = await Hospital.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Hospital already exists' });

    const hashedPassword = await bcrypt.hash(password, 12);
    const hospital = new Hospital({ name, email, password: hashedPassword, location, phone });
    await hospital.save();
    res.status(201).json({ message: 'Hospital is submitted for verification and approval' });
  } catch (error) {
    res.status(500).json({ message: 'Error registering hospital', error: error.message });
  }
};

export const loginHospital = async (req, res) => {
  try {
    const { email, password } = req.body;
    const hospital = await Hospital.findOne({ email });
    if (!hospital || !hospital.isApproved)
      return res.status(403).json({ message: 'incorrect credentials or pending approval' });

    // Prevent login if declined
    if (hospital.status === 'declined') {
      return res.status(403).json({ message: 'Your hospital registration was declined. Contact our team for more info.' });
    }

    const isMatch = await bcrypt.compare(password, hospital.password);
    if (!isMatch) return res.status(401).json({ message: 'Incorrect credentials or pending approval' });

    const token = jwt.sign({ id: hospital.id, role: hospital.role }, secret, { expiresIn: '1d' });
    res.json({ token, role: hospital.role });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
};
