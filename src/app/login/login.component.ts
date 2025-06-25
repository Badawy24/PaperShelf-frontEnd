// login.component.ts
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginauthService } from '../services/loginauth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder, private authService: LoginauthService) {
    this.loginForm = this.fb.group({
      // تحديث التحقق لاسم المستخدم/البريد الإلكتروني
      username: ['', [
        Validators.required,
        Validators.minLength(5), // طول أدنى أكبر قليلاً للبريد الإلكتروني
        Validators.email // التأكد من أنه تنسيق بريد إلكتروني صالح
      ]],
      // تحديث التحقق لكلمة المرور (أقوى)
      password: ['', [
        Validators.required,
        Validators.minLength(8), // طول أدنى 8 أحرف
        Validators.maxLength(30), // طول أقصى 30 حرف (يمكنك تعديلها)
        // هذا هو الـ Regex لفرض التعقيد:
        // - (?=.*[a-z]) : على الأقل حرف صغير واحد
        // - (?=.*[A-Z]) : على الأقل حرف كبير واحد
        // - (?=.*\d)   : على الأقل رقم واحد
        // - (?=.*[@$!%*?&]) : على الأقل رمز خاص واحد (يمكنك إضافة المزيد من الرموز هنا)
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,30}$/)
      ]]
    });
  }

  onSubmit() {
    this.errorMessage = null;
    this.loginForm.markAllAsTouched();

    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;

      this.authService.login(username, password).subscribe({
        next: (response) => {
          console.log('Login successful:', response);
          // this.router.navigate(['/home']);
        },
        error: (err: any) => {
          console.error('Login failed:', err);
          this.errorMessage = err.message || 'Login failed. Please try again.';
        }
      });
    } else {
      console.log('Form is invalid. Please check the fields.');
      this.errorMessage = 'Please correct the highlighted errors to proceed.'; 
    }
  }
}