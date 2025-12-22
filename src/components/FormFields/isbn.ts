export const isValidIsbn13 = (value: string): boolean => {
  const digits = value.replace(/[\s-]/g, '');
  if (!/^\d{13}$/.test(digits)) return false;

  const checksum = digits
    .slice(0, 12)
    .split('')
    .reduce((sum, d, i) => sum + Number(d) * (i % 2 === 0 ? 1 : 3), 0);

  return (10 - (checksum % 10)) % 10 === +digits[12];
};
