import { authService } from "../services/auth.service";
import { api } from "../lib/api";

export async function onCreatePageContext(pageContext: any) {
  // Set cookie for API client during SSR
  if (pageContext.headers?.cookie) {
    api.setServerCookie(pageContext.headers.cookie);
  }
  
  // Retrieve the current user
  try {
    pageContext.user = await authService.getCurrentUser(pageContext.headers?.cookie);
  } catch (error) {
    console.error('Failed to get current user:', error);
    pageContext.user = null;
  }
}
