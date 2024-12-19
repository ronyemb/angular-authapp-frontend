import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css',
})
export class LoginPageComponent {
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private router = inject(Router)
  public formError: string | null = null;

  public myForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  login() {
    if (this.myForm.invalid) {
      this.formError = 'Por favor, complete los campos correctamente.';
      return;
    }
    const { email, password } = this.myForm.value as {
      email: string;
      password: string;
    };
    this.authService.login(email, password).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: (message) => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: message,
        });
      },
    });
  }
}
