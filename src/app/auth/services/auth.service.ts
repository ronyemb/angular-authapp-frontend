import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environments';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, of, tap, throwError } from 'rxjs';
import { User, AuthStatus, LoginResponse, CheckTokenResponse } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private readonly baseUrl = environment.baseUrl;
  private http = inject(HttpClient);

  private _currentUser = signal<User | null>(null);
  private _authStatus = signal<AuthStatus>(AuthStatus.CHECKING);

  public currentUser = computed(() => this._currentUser());
  public authStatus = computed(() => this._authStatus());

  constructor() {
    this.checkAuthStatus()
      .subscribe();
  }

  /**
   * Sets the current user as authenticated and stores the auth token.
   *
   * @param user - The authenticated user object.
   * @param token - The authentication token.
   * @returns Always returns true.
   */
  private setAuthentication(user: User, token: string): boolean {
    this._currentUser.set(user);
    this._authStatus.set(AuthStatus.AUTHENTICATED);
    localStorage.setItem('token', token);
    return true;
  }

  /**
   * Logs in the user with the given email and password.
   *
   * @param email The user's email.
   * @param password The user's password.
   * @returns An observable that resolves to true if the login was successful, or errors with a message if not.
   */
  login(email: string, password: string): Observable<boolean> {
    const body = { email, password };

    return this.http.post<LoginResponse>(`${this.baseUrl}/auth/login`, body).pipe(
      map(({ user, token }) => this.setAuthentication(user, token)),
      catchError((error) => throwError(() => error.error.message))
    );
  }


  /**
   * Checks the authentication status of the current user.
   *
   * @returns An Observable that resolves to a boolean indicating whether the user is authenticated.
   */
  checkAuthStatus(): Observable<boolean> {
    const token: string | null = localStorage.getItem('token');

    if (!token) {
      this.logout();
      return of(false);
    }

    const headers: HttpHeaders = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<CheckTokenResponse>(`${this.baseUrl}/auth/check-token`, { headers })
      .pipe(
        map(({ user, token }: CheckTokenResponse) => this.setAuthentication(user, token)),
        catchError(() => {
          this.logout();
          return of(false);
        })
      );
  }

  /**
   * Logs out the user by removing the authentication token from local storage and
   * setting the authentication status to not authenticated.
   */
  logout(): void {
    localStorage.removeItem('token');
    this._authStatus.set(AuthStatus.NOT_AUTHENTICATED);
    this._currentUser.set(null);
  }

}
