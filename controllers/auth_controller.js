import { Hospital } from '../models/hospital_model.js';
import { secret } from "../config/env.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { registerHospitalSchema, loginHospitalSchema } from '../schema/hospital_schema.js';

export const registerHospital = async (req, res) => {

  const { error } = registerHospitalSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    const { name, email, password, location, phone } = req.body;

    const existing = await Hospital.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Hospital already exists' });

    const hashedPassword = await bcrypt.hash(password, 12);

    const hospital = new Hospital({
      name,
      email,
      password: hashedPassword,
      location,
      phone,

    });

    await hospital.save();
    res.status(201).json({ message: 'Hospital is succesfully registered and submitted for verification and approval, please proceed to login' });
  } catch (error) {
    res.status(500).json({ message: 'Error registering hospital', error: error.message });
  }
};

export const loginHospital = async (req, res) => {

  const { error } = loginHospitalSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    const { email, password } = req.body;
    const hospital = await Hospital.findOne({ email });

    if (!hospital) {
      return res.status(403).json({ message: 'Incorrect credentials' });
    }
    const isMatch = await bcrypt.compare(password, hospital.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect credentials' });
    }

    if (hospital.status === 'declined') {
      return res.status(403).json({
        message: 'Your hospital registration was declined. Contact our team for more info.'
      });
    }
    const token = jwt.sign(
      { id: hospital.id, role: hospital.role, isApproved: hospital.isApproved },
      secret,
      { expiresIn: '1d' }
    );

    res.json({
      token,
      role: hospital.role,
      isApproved: hospital.isApproved,
      message: hospital.isApproved
        ? 'Login successful'
        : 'Login successful. Pending admin approval for full access.'
    });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
};

//     if (!hospital.isApproved){
//         return res.status(403).json({
//             message: 'This hospital is pending approval.'
//         })
//     }

//     const isMatch = await bcrypt.compare(password, hospital.password);
//     if (!isMatch) {
//       return res.status(401).json({ message: 'Incorrect credentials' });
//     }

//     const token = jwt.sign({ id: hospital.id, role: hospital.role }, secret, { expiresIn: '1d' });
//     res.json({ token, role: hospital.role });
//   } catch (error) {
//     res.status(500).json({ message: 'Login failed', error: error.message });
//   }
// };
