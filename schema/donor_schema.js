import Joi from 'joi';

export const donorSchema = Joi.object({
  fullName: Joi.string().min(2).max(100).required(),
  age: Joi.number().integer().min(16).max(100).required(),
  bloodType: Joi.string()
    .valid('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'I Dont Know')
    .default('I Dont Know'),
  phone: Joi.string().required(),
  email: Joi.string().email().required()
});
