import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const requiredRoles: string[] = route.data['roles'] || [];
  const user = auth.currentUser;

  if (user && requiredRoles.includes(user.role)) return true;

  // Redirect to correct dashboard
  if (user) auth.redirectByRole(user.role);
  else router.navigate(['/auth/login']);
  return false;
};
