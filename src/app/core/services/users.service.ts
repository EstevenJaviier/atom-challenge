import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { IUser } from '../interfaces/user.interface';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(private http: HttpClient) {}

  findUser(id: number): Observable<IUser> {
    return this.http
      .get<IUser>(environment.apiBaseUrl + `users/${id}`)
      .pipe(map((data) => data));
  }

  createUser(user: IUser): Observable<IUser> {
    return this.http
      .post<IUser>(environment.apiBaseUrl + 'users', user)
      .pipe(map((data) => data));
  }
}
