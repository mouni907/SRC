// server/utils/generateId.js
export const generateCertificateId = (sequence = 1) => {
  const year = new Date().getFullYear();
  return `NDC-${year}-${String(sequence).padStart(5, '0')}`;
};

export default { generateCertificateId };
