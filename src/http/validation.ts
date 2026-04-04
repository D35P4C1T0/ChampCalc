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

interface FastifyValidationIssue {
  instancePath?: string;
  keyword?: string;
  message?: string;
  params?: Record<string, unknown>;
}

export function fastifyValidationErrorBody(validation: FastifyValidationIssue[]): {
  error: string;
  details: Array<{ field: string; message: string }>;
} {
  return {
    error: "Invalid request payload",
    details: validation.map((issue) => ({
      field: readIssueField(issue),
      message: readIssueMessage(issue),
    })),
  };
}

function readIssueField(issue: FastifyValidationIssue): string {
  const missingProperty = issue.params?.missingProperty;
  if (typeof missingProperty === "string" && missingProperty.length > 0) {
    return missingProperty;
  }

  if (typeof issue.instancePath === "string" && issue.instancePath.length > 0) {
    return issue.instancePath.replace(/^\//, "").replaceAll("/", ".");
  }

  return "request";
}

function readIssueMessage(issue: FastifyValidationIssue): string {
  if (issue.keyword === "maximum" && typeof issue.params?.limit === "number") {
    return `EVs cannot exceed ${issue.params.limit}`;
  }

  if (issue.keyword === "minimum" && typeof issue.params?.limit === "number") {
    return `EVs cannot be below ${issue.params.limit}`;
  }

  if (issue.keyword === "required") {
    return "This field is required";
  }

  return issue.message ?? "Invalid value";
}
