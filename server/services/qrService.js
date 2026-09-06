import crypto from 'crypto';

export const createVerificationCode = () => crypto.randomBytes(18).toString('base64url');

export const createVerificationUrl = (verificationCode) => {
	const baseUrl = process.env.PUBLIC_APP_URL || process.env.APP_URL || 'http://localhost:3000';
	return `${baseUrl.replace(/\/$/, '')}/verify/${encodeURIComponent(verificationCode)}`;
};

export default { createVerificationCode, createVerificationUrl };
