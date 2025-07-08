import { model, Schema } from 'mongoose';
import normalize from 'normalize-mongoose';

const hospitalSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    isApproved: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        enum: ['hospital', 'admin'],
        default: 'hospital'
    },

    status: {
        type: String,
        enum: ['pending', 'approved', 'declined'],
        default: 'pending'
    }
}, { timestamps: true });

hospitalSchema.plugin(normalize)
export const Hospital = model('Hospital', hospitalSchema)