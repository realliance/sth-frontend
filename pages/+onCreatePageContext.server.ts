import { authService } from "../services/auth.service";

export async function onCreatePageContext(pageContext: any) {
  // Retrieve the current user
  pageContext.user = await authService.getCurrentUser(pageContext.headers?.cookie);
}
