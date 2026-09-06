import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
	id: { type: String, required: true, unique: true, index: true },
	name: { type: String, required: true },
	email: { type: String, required: true, unique: true, lowercase: true, trim: true },
	password: { type: String, required: true },
	role: { type: String, required: true, enum: ['admin', 'department', 'student'] },
	department: { type: String, default: null },
	studentId: { type: String, default: null },
	rollNo: { type: String, default: null },
	collegeId: { type: String, default: null },
	degree: { type: String, default: null },
	semester: { type: String, default: null },
	batch: { type: String, default: null },
	hallTicket: { type: String, default: null },
	avatar: { type: String, default: null }
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', userSchema);
