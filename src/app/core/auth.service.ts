import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenKey = 'authToken';

  // Simulated login method (replace with real API call)
  login(username: string, password: string): boolean {
    // Normally, perform an API call to validate credentials.
    const fakeToken = 'fake-jwt-token';
    localStorage.setItem(this.tokenKey, fakeToken);
    return true;
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }
}
