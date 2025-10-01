import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ITask } from '../interfaces/task.interface';
import { environment } from '../../../environments/environment';
import { IResponseGlobal } from './response.interface';

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  constructor(private http: HttpClient) {}

  getTasks(): Observable<ITask[]> {
    return this.http
      .get<ITask[]>(environment.apiBaseUrl + 'tasks')
      .pipe(map((data) => data));
  }

  createTask(task: ITask): Observable<ITask> {
    return this.http
      .post<IResponseGlobal<ITask>>(environment.apiBaseUrl + 'tasks', task)
      .pipe(map((data) => data.data));
  }

  updateTask(id: string, task: ITask): Observable<ITask> {
    return this.http
      .put<IResponseGlobal<ITask>>(environment.apiBaseUrl + `tasks/${id}`, task)
      .pipe(map((data) => data.data));
  }

  deleteTask(id: string): Observable<string> {
    return this.http
      .delete<any>(environment.apiBaseUrl + `tasks/${id}`)
      .pipe(map((data) => data));
  }
}
