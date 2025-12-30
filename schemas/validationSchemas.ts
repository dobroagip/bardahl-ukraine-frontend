
import { z } from 'zod';

export const PhoneSchema = z.string()
  .min(10, "Номер телефона слишком короткий")
  .max(15, "Номер телефона слишком длинный")
  .regex(/^\+?[0-9\s\-()]+$/, "Неверный формат номера");

export const CustomerDetailsSchema = z.object({
  firstName: z.string().min(2, "Имя должно быть не менее 2 символов"),
  lastName: z.string().min(2, "Фамилия должна быть не менее 2 символов"),
  phone: PhoneSchema,
  email: z.string().email("Некорректный email").or(z.literal('')),
  city: z.string().min(2, "Укажите город"),
  deliveryMethod: z.enum(['nova_poshta_dept', 'courier', 'pickup']),
  paymentMethod: z.enum(['card_online', 'cod', 'iban']),
  comment: z.string().optional(),
  honeypot: z.string().max(0, "Bot detected").optional(),
});

export const VinRequestSchema = z.object({
  car: z.string().min(3, "Укажите марку и модель"),
  engine: z.string().min(2, "Укажите данные двигателя"),
  year: z.string().regex(/^\d{4}$/, "Укажите 4 цифры года"),
  phone: PhoneSchema,
  honeypot: z.string().max(0, "Bot detected").optional(),
});
