export interface validationResult {
  errors: Array<validationError>;
  isValid: boolean;
}

export interface validationError {
  field: string;
  message: string;
}
