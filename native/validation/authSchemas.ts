import {z} from 'zod';
import i18next from 'i18next';

const t = (key: string) => i18next.t(key);

export const loginSchema = z.object({
  loginEmail: z
    .string()
    .min(1, t('auth.errors.invalidEmail'))
    .email(t('auth.errors.invalidEmail')),
  loginPassword: z
    .string()
    .min(1, t('auth.errors.passwordRequired'))
    .min(8, t('auth.errors.passwordLength'))
    .regex(/[0-9]/, t('auth.errors.passwordRequiresNumber'))
    .regex(/[A-Z]/, t('auth.errors.passwordRequiresUppercase'))
    .regex(/[a-z]/, t('auth.errors.passwordRequiresLowercase')),
});

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, t('auth.errors.invalidEmail'))
    .email(t('auth.errors.invalidEmail')),
});

export const signupSchema = z
  .object({
    firstName: z.string().min(1, t('auth.errors.firstNameRequired')),
    lastName: z.string().min(1, t('auth.errors.lastNameRequired')),
    signupEmail: z
      .string()
      .min(1, t('auth.errors.invalidEmail'))
      .email(t('auth.errors.invalidEmail')),
    confirmPassword: z
      .string()
      .min(1, t('auth.errors.passwordRequired')),
    signupPassword: z
      .string()
      .min(1, t('auth.errors.passwordRequired'))
      .min(8, t('auth.errors.passwordLength'))
      .regex(/[0-9]/, t('auth.errors.passwordRequiresNumber'))
      .regex(/[A-Z]/, t('auth.errors.passwordRequiresUppercase'))
      .regex(/[a-z]/, t('auth.errors.passwordRequiresLowercase')),
  })
  .refine(data => data.signupPassword === data.confirmPassword, {
    message: t('auth.errors.passwordMatch'),
    path: ['confirmPassword'],
  });

export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
