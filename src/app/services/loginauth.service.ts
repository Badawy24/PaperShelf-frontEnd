// src/app/services/loginauth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// قمنا بإضافة of و throwError لمساعدتنا في محاكاة الاستجابات
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root' // هذا يجعل الخدمة متاحة على مستوى التطبيق بالكامل
})
export class LoginauthService {

  // يمكنك تغيير هذا الـ URL إلى نقطة النهاية (API) الحقيقية الخاصة بك لتسجيل الدخول لاحقاً
  private readonly LOGIN_API_URL = 'https://reqres.in/api/login';

  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<any> {
    console.log('Attempting login with:', { username, password });

    

    if (username === 'test@example.com' && password === 'password123') {
      console.log('Simulating SUCCESSFUL login');
      return of({ token: 'fake_jwt_token_12345' }).pipe(delay(1000));
    } else if (username === 'user@example.com' && password === 'wrongpass') {
        console.log('Simulating FAILED login (Unauthorized)');
        return throwError(() => new Error('اسم المستخدم أو كلمة المرور غير صحيحة. يرجى المحاولة مرة أخرى.'));
    } else {
        
        console.log('Using reqres.in API for login attempt...');
        const payload = {
            email: username, 
            password: password
        };

        return this.http.post<any>(this.LOGIN_API_URL, payload).pipe(
            delay(1000), 
            map(response => {
                console.log('API Response (Success):', response);
                return response;
            }),
            catchError(error => {
                console.error('API Response (Error):', error);
                let errorMessage = 'حدث خطأ غير متوقع أثناء تسجيل الدخول.';
                if (error.error && typeof error.error === 'string') {
                    errorMessage = error.error; 
                } else if (error.error && error.error.error) {
                    errorMessage = error.error.error;
                } else if (error.status === 400) {
                    errorMessage = 'بيانات الاعتماد غير صالحة. يرجى التحقق من اسم المستخدم/البريد الإلكتروني وكلمة المرور.';
                } else if (error.status === 401) {
                    errorMessage = 'غير مصرح به. بيانات الاعتماد غير صالحة أو مفتاح API مفقود.';
                } else if (error.status === 0) {
                    errorMessage = 'خطأ في الشبكة أو الخادم لا يمكن الوصول إليه. يرجى المحاولة لاحقاً.';
                }
                return throwError(() => new Error(errorMessage));
            })
        );
    }
  }
}