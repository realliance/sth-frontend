import { authService } from "../services/auth.service";

export async function onCreatePageContext(pageContext: any) {
  // On client-side navigation, re-fetch the current user to ensure auth state is fresh
  try {
    pageContext.user = await authService.getCurrentUser();
  } catch (error) {
    console.error('Failed to get current user on client:', error);
    pageContext.user = null;
  }
}