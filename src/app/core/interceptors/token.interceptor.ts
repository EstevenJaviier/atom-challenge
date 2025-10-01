import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, throwError } from 'rxjs';

export const tokenInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const router = inject(Router);
  const token = localStorage.getItem('token') ?? '';

  if (token && !req.url.includes('/api/users')) {
    req = req.clone({
      setHeaders: { Authorization: 'Bearer ' + token },
    });
  }

  return next(req).pipe(
    catchError((error: HttpEvent<any>) => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        localStorage.removeItem('token');
        router.navigate(['/login']);
        return throwError(() => error);
      }

      return throwError(() => error);
    })
  );
};
