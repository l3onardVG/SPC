// Tipos de validación
export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

// Validaciones para el formulario de usuarios
export const validateUserForm = (formData: any): ValidationResult => {
  const errors: ValidationError[] = [];

  // Validar nombre
  if (!formData.name || formData.name.trim().length === 0) {
    errors.push({ field: 'name', message: 'El nombre es requerido' });
  } else if (formData.name.trim().length < 2) {
    errors.push({ field: 'name', message: 'El nombre debe tener al menos 2 caracteres' });
  }

  // Validar apellido
  if (!formData.surname || formData.surname.trim().length === 0) {
    errors.push({ field: 'surname', message: 'El apellido es requerido' });
  } else if (formData.surname.trim().length < 2) {
    errors.push({ field: 'surname', message: 'El apellido debe tener al menos 2 caracteres' });
  }

  // Validar email
  if (!formData.email || formData.email.trim().length === 0) {
    errors.push({ field: 'email', message: 'El email es requerido' });
  } else if (!isValidEmail(formData.email)) {
    errors.push({ field: 'email', message: 'El formato del email no es válido' });
  }

  // Validar contraseña
  if (!formData.password || formData.password.length === 0) {
    errors.push({ field: 'password', message: 'La contraseña es requerida' });
  } else if (formData.password.length < 6) {
    errors.push({ field: 'password', message: 'La contraseña debe tener al menos 6 caracteres' });
  } else if (!isValidPassword(formData.password)) {
    errors.push({ 
      field: 'password', 
      message: 'La contraseña debe contener al menos una mayúscula, una minúscula y un número' 
    });
  }

  // Validar tipo de documento
  if (!formData.documentType || formData.documentType.trim().length === 0) {
    errors.push({ field: 'documentType', message: 'El tipo de documento es requerido' });
  }

  // Validar número de documento
  if (!formData.documentNumber || formData.documentNumber.trim().length === 0) {
    errors.push({ field: 'documentNumber', message: 'El número de documento es requerido' });
  } else if (formData.documentNumber.trim().length < 8) {
    errors.push({ field: 'documentNumber', message: 'El número de documento debe tener al menos 8 dígitos' });
  }

  // Validar tipo de usuario
  if (!formData.userType || formData.userType.trim().length === 0) {
    errors.push({ field: 'userType', message: 'El tipo de usuario es requerido' });
  }

  // Validar términos y condiciones
  if (!formData.termsAceptance) {
    errors.push({ field: 'termsAceptance', message: 'Debe aceptar los términos y condiciones' });
  }

  // Validar teléfono (opcional pero si se proporciona debe ser válido)
  if (formData.phoneNumber && formData.phoneNumber.trim().length > 0) {
    if (!isValidPhone(formData.phoneNumber)) {
      errors.push({ field: 'phoneNumber', message: 'El formato del teléfono no es válido' });
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Función para validar email
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Función para validar contraseña
export const isValidPassword = (password: string): boolean => {
  // Al menos 6 caracteres, una mayúscula, una minúscula y un número
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
  return passwordRegex.test(password);
};

// Función para validar teléfono
export const isValidPhone = (phone: string): boolean => {
  // Acepta números, espacios, guiones y paréntesis
  const phoneRegex = /^[\d\s\-\(\)\+]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 7;
};

// Función para obtener mensaje de error por campo
export const getFieldError = (errors: ValidationError[], field: string): string => {
  const error = errors.find(err => err.field === field);
  return error ? error.message : '';
};

// Función para limpiar errores de un campo específico
export const clearFieldError = (errors: ValidationError[], field: string): ValidationError[] => {
  return errors.filter(err => err.field !== field);
}; 