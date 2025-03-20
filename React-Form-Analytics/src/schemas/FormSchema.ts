import { z } from "zod";

// Define form schema with Zod
export const formSchema = z.object({
  // Personal Information
  firstName: z
    .string()
    .min(2, { message: "First name must be at least 2 characters" }),
  lastName: z
    .string()
    .min(2, { message: "Last name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  dateOfBirth: z.date({ required_error: "Please select a date of birth" }),
  gender: z.enum(["male", "female", "non-binary", "prefer-not-to-say"], {
    required_error: "Please select a gender option",
  }),

  // Contact Information
  phone: z
    .string()
    .regex(/^\d{10}$/, { message: "Phone number must be 10 digits" }),
  address: z
    .string()
    .min(5, { message: "Address must be at least 5 characters" }),
  city: z.string().min(2, { message: "City must be at least 2 characters" }),
  country: z
    .string()
    .min(2, { message: "Country must be at least 2 characters" }),
  zipCode: z
    .string()
    .regex(/^\d{5}(-\d{4})?$/, { message: "Enter a valid ZIP code" }),

  // Professional Information
  occupation: z
    .string()
    .min(2, { message: "Occupation must be at least 2 characters" }),
  companyName: z.string().optional(),
  yearsOfExperience: z
    .number()
    .min(0, { message: "Experience can't be negative" }),
  skills: z.string().min(3, { message: "Please list at least some skills" }),
  educationLevel: z.enum(
    ["high-school", "bachelors", "masters", "phd", "other"],
    {
      required_error: "Please select your education level",
    }
  ),

  // Credit Card Information
  cardNumber: z
    .string()
    .regex(/^\d{16}$/, { message: "Card number must be 16 digits" }),
  cardName: z.string().min(2, { message: "Cardholder name is required" }),
  expiryDate: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, { message: "Use format MM/YY" }),
  cvv: z.string().regex(/^\d{3,4}$/, { message: "CVV must be 3 or 4 digits" }),

  // Personal Experience & Thoughts
  lifeGoals: z
    .string()
    .min(20, { message: "Please share at least 20 characters" }),
  problemSolvingApproach: z
    .string()
    .min(50, { message: "Please elaborate your approach (min 50 chars)" }),
  ethicalDilemma: z.string().min(100, {
    message: "Please provide a thoughtful response (min 100 chars)",
  }),
  satisfactionLevel: z.number().min(1).max(10),
  receiveUpdates: z.boolean().default(false),
});

export type FormValues = z.infer<typeof formSchema>;