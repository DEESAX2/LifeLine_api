import Joi from 'joi';

export const appointmentSchema = Joi.object({
  date: Joi.date().required(),
  
//   status: Joi.string()
//     .valid('pending', 'approved', 'rejected')
//     .default('pending'),

  hasDonated: Joi.boolean().default(false),

  message: Joi.string().allow('', null)  
});
