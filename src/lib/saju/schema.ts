import { z } from "zod";

export const birthInputSchema = z.object({
  name: z.string().max(40).optional(),
  gender: z.enum(["male", "female"]),
  calendar: z.enum(["solar", "lunar"]),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  isLeapMonth: z.boolean().optional(),
  timeKnowledge: z.enum(["exact", "approximate", "unknown"]),
  time: z
    .string()
    .regex(/^\d{2}:\d{2}$/)
    .optional(),
  timeRangeStart: z
    .string()
    .regex(/^\d{2}:\d{2}$/)
    .optional(),
  timeRangeEnd: z
    .string()
    .regex(/^\d{2}:\d{2}$/)
    .optional(),
  timeAccuracy: z.enum(["exact", "about_1h", "about_2_3h", "uncertain"]).optional(),
  country: z.string().min(1),
  city: z.string().min(1),
  residenceCountry: z.string().optional(),
  residenceCity: z.string().optional(),
  useLocalMeanCorrection: z.boolean().optional(),
  useYajaSi: z.boolean().optional(),
  useTrueSolarTime: z.boolean().optional(),
  unlockFull: z.boolean().optional(),
  useLlm: z.boolean().optional(),
});

export type BirthInputPayload = z.infer<typeof birthInputSchema>;
