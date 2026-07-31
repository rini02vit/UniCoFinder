/**
 * Maps backend validation errors (e.g., from 422 responses) to standard frontend form errors.
 * 
 * Assumes backend returns errors in a format like:
 * {
 *   errors: {
 *     email: ["Email already exists"],
 *     password: ["Password is too weak"]
 *   }
 * }
 * or a general message:
 * { message: "Invalid credentials" }
 *
 * @param {Object} error - The caught axios error
 * @param {Function} setError - The react-hook-form setError function
 * @returns {string|null} - Returns a global form error message if applicable
 */
export const mapBackendErrorsToForm = (error, setError) => {
  if (!error.response) {
    return 'Network error. Please check your connection and try again.';
  }

  const { status, data } = error.response;

  // Handle specific field validation errors (e.g. 422 Unprocessable Entity)
  if (status === 422 && data.errors) {
    Object.keys(data.errors).forEach((field) => {
      setError(field, {
        type: 'server',
        message: Array.isArray(data.errors[field]) ? data.errors[field][0] : data.errors[field]
      });
    });
    return null; // Errors handled at field level
  }

  // Handle general authentication errors (e.g. 401 Unauthorized)
  if (status === 401) {
    return data.message || 'Invalid email or password.';
  }

  // Fallback for other server errors
  return data.message || 'An unexpected error occurred. Please try again.';
};
