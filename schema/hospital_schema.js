import Joi from "joi";


export const registerHospitalSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  confirmPassword: Joi.string()
    .valid(Joi.ref('password'))
    .required(),
  location: Joi.string().min(3).max(200).required(),
  phone: Joi.number().required(),
  role: Joi.string().valid('hospital', 'admin').default('hospital'),
  isApproved: Joi.boolean().optional(),
  status: Joi.string().valid('pending', 'approved', 'declined').default('pending')
});


export const loginHospitalSchema = Joi.object ({
  email: Joi.string().email().required(),

  password: Joi.string().required()
});

