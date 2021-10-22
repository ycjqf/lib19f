interface validationResult {
  errors: Array<validationError>;
  isValid: boolean;
}

interface validationError {
  field: string;
  message: string;
}
