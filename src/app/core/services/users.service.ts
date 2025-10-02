import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { IUser } from '../interfaces/user.interface';
import { HttpClient } from '@angular/common/http';
import { IResponseGlobal } from './response.interface';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(private http: HttpClient) {}

  findUser(email: string): Observable<string> {
    return this.http
      .get<{ token: string }>(environment.apiBaseUrl + `users/${email}`)
      .pipe(map((data) => data.token));
  }

  createUser(user: IUser): Observable<string> {
    return this.http
      .post<{ token: string }>(environment.apiBaseUrl + 'users', user)
      .pipe(map((data) => data.token));
  }
}
