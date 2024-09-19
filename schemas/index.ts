import { z } from "zod";

export const formGeneratorSchema = z.object({
  length: z.number().int(),
  character_sets: z
    .array(z.string())
    .refine((value) => value.some((item) => item), {
      message: "Please select at least one character set",
    }),
});

export type FormGeneratorSchemaType = z.infer<typeof formGeneratorSchema>;
