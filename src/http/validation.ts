import { ZodError } from "zod";

export function validationErrorBody(error: ZodError): {
  error: string;
  details: Array<{ field: string; message: string }>;
} {
  return {
    error: "Invalid request payload",
    details: error.issues.map((issue) => ({
      field: issue.path.length > 0 ? issue.path.join(".") : "request",
      message: issue.message,
    })),
  };
}
