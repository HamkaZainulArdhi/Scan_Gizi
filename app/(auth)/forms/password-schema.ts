import { z } from 'zod';

export const getPasswordSchema = (minLength = 8) => {
  return z
    .string()
    .min(minLength, {
      message: `Password harus terdiridari minimal ${minLength} karakter.`,
    })
    .regex(/[A-Z]/, {
      message: 'Kata sandi harus mengandung setidaknya satu huruf Besar.',
    })
    .regex(/[a-z]/, {
      message: 'Kata sandi harus mengandung setidaknya satu huruf kecil.',
    });
};
