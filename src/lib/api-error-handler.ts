import { ApiError } from "./core/ApiError";

/**
 * Extracts a user-friendly error message from an ApiError or generic Error.
 * Handles Spring Boot / JSR-303 validation error structures.
 */
export function getApiErrorMessage(err: any): string {
  // If it's not an ApiError, return the standard message
  if (!(err instanceof ApiError)) {
    return err.message || "Une erreur inattendue est survenue.";
  }

  const { status, body } = err;

  // 1. Try to extract detailed messages from the response body
  if (body) {
    // Handle Spring Boot Validation Errors (array of field errors)
    if (Array.isArray(body.errors)) {
      return body.errors
        .map((e: any) => e.defaultMessage || e.message)
        .filter(Boolean)
        .join(". ");
    }

    // Handle generic message or detail fields
    if (body.message) return body.message;
    if (body.detail) return body.detail;
    if (body.error && typeof body.error === 'string') return body.error;
    
    // If body is just a string
    if (typeof body === 'string') return body;
  }

  // 2. Fallback to status-based messages
  switch (status) {
    case 400:
      return "Requête invalide. Veuillez vérifier les informations saisies.";
    case 401:
      return "Session expirée ou non autorisée. Veuillez vous reconnecter.";
    case 403:
      return "Vous n'avez pas l'autorisation d'effectuer cette action.";
    case 404:
      return "La ressource demandée est introuvable.";
    case 409:
      return "Un conflit est survenu (cette donnée existe probablement déjà).";
    case 500:
      return "Erreur interne du serveur. Veuillez réessayer plus tard.";
    case 502:
    case 503:
    case 504:
      return "Le serveur est temporairement indisponible. Veuillez réessayer dans quelques instants.";
    default:
      return `Une erreur serveur est survenue (Code: ${status}).`;
  }
}
