import z from "zod";
import { ValidationError } from "../types/errors";

export const validate = (data: any, schema: z.ZodObject<any>) => {
  try {
    return schema.parse(data);
  } catch (error) {
    throw new ValidationError("Bad input");
  }
};
