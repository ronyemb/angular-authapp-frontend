import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { AuthStatus } from '../interfaces';
/**
 * A route guard that redirects to the login page if the user is not authenticated.
 *
 * @param route The route being navigated to.
 * @param state The router state.
 * @returns true if the user is authenticated, false if the user is checking, and redirects to the login page if the user is not authenticated.
 */
export const isAuthenticatedGuard = (
  route: import('@angular/router').ActivatedRouteSnapshot,
  state: import('@angular/router').RouterStateSnapshot,
): boolean => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const authStatus = authService.authStatus();

  console.log(state.url); // --> /dashboar

  if (authStatus === AuthStatus.AUTHENTICATED) {
    return true;
  }

  // if (authStatus === AuthStatus.CHECKING) {
  //   return false;
  // }

  localStorage.setItem('url', state.url);
  router.navigate(['/auth/login']);

  return false;
};


