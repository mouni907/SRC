import mongoose from 'mongoose';

const certificateSchema = new mongoose.Schema({
	certificateId: { type: String, required: true, unique: true, index: true },
	verificationCode: { type: String, required: true, unique: true, index: true },
	studentId: { type: String, required: true, index: true },
	issuedAt: { type: Date, required: true },
	status: { type: String, enum: ['issued', 'revoked'], default: 'issued' },
	departments: { type: mongoose.Schema.Types.Mixed, required: true }
}, { timestamps: true });

export default mongoose.models.Certificate || mongoose.model('Certificate', certificateSchema);
