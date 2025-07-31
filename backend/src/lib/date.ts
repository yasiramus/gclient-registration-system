// expiration date for verification codes
//by default set to 24 hours 1day
export const generateExpirationDate = (hours = 24, minutes = 0): Date => {
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + hours);
  expiresAt.setMinutes(expiresAt.getMinutes() + minutes);
  return expiresAt;
};
