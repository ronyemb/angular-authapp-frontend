import { Component, computed, effect, inject } from '@angular/core';
import { AuthService } from './auth/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  public finishedAuthCheck = computed<boolean>(() => {
    return this.authService.authStatus() !== 'checking';
  });

  public authStatusChangedEffect = effect(() => {
    switch (this.authService.authStatus()) {
      case 'checking':
        return;
      case 'not-authenticated':
        this.router.navigate(['/auth/login']);
        return;
      case 'authenticated':
        const url = localStorage.getItem('url');
        this.router.navigate([url || '/dashboard']);
        return;
    }
  })

}
