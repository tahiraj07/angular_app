import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';  
import { map } from 'rxjs/operators';    
import { User } from '../_models/user';
import { PaginateResult } from '../_models/pagination';
import { Message } from '../_models/message';
import { Task } from '../_models/task';

const httpOptions = {
  headers: new HttpHeaders ({
    'Authorization': 'Bearer' + localStorage.getItem('token')
  })
}; 


@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrl = environment.apiUrl;

constructor(private http: HttpClient) { }
formData: Task = new Task();
list: Task[];
//MERR TBL E USERAVE NGA DATABASA API
 
  getUsers(page?, itemsPerPage?,userParams?, likesParam?): Observable<PaginateResult<User[]>> {
    const paginatedResult: PaginateResult<User[]> = new PaginateResult<User[]>();

    let params = new HttpParams();

    if (page != null && itemsPerPage != null) {
      params = params.append('pageNumber', page);
      params = params.append('pageSize', itemsPerPage);
    }

    if (userParams != null) {
      params = params.append('minAge', userParams.minAge);
      params = params.append('maxAge', userParams.maxAge);
      params = params.append('gender', userParams.gender);
      params = params.append('orderBy', userParams.orderBy);
    }

    if (likesParam === 'Likers') {
      params = params.append('likers', 'true');
    }

    if (likesParam === 'Likees') {
      params = params.append('likees', 'true');
    }

    return this.http.get<User[]>(this.baseUrl + 'user', { observe: 'response', params})
        .pipe(
          map(response => {
            paginatedResult.result = response.body;
            if (response.headers.get('Pagination') != null) {
              paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'))
            }
            return paginatedResult;
          })
        );
  }

  getUser(id): Observable<User> {
    return this.http.get<User>(this.baseUrl + 'user/' + id, httpOptions);
  }

  updateUser(id: number, user: User) {
    return this.http.put(this.baseUrl + 'user/' + id, user)
  }

  setMainPhoto(userId: number, id: number) {
    return this.http.post(this.baseUrl + 'user/' + userId + '/photos/' + id + '/setMain', {});
  }

  deletePhoto(userId: number, id: number) {
    return this.http.delete(this.baseUrl + 'user/' + userId + '/photos/' + id);
  }

  sendLike(id: number, recipientId: number) {
    return this.http.post(this.baseUrl + 'user/' + id + '/like/' + recipientId, {});
  }

  getMessages(id: number, page?, itemsPerPage?, messageContainer?) {
    const paginatedResult: PaginateResult<Message[]> = new PaginateResult<Message[]>();

    let params = new HttpParams();

    params = params.append('MessageContainer', messageContainer);

    if (page != null && itemsPerPage != null) {
      params = params.append('pageNumber', page);
      params = params.append('pageSize', itemsPerPage);
    }

    return this.http.get<Message[]>(this.baseUrl + 'user/' + id + '/messages', {observe: 'response', params})
      .pipe(
        map(response => {
          paginatedResult.result = response.body;
          if (response.headers.get('Pagination') != null) {
            paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
          }

          return paginatedResult;
        })
      );
  }

  getMessageThread(id: number, recipientId: number) {
    return this.http.get<Message[]>(this.baseUrl + 'user/' + id + '/messages/thread/' + recipientId);
  }

  sendMessage(id: number, message: Message) {
    return this.http.post(this.baseUrl + 'user/' + id + '/messages', message);
  }
   
  deleteMessage(id: number, userId: number) {
    return this.http.post(this.baseUrl + 'user/' + userId + '/messages/' + id, {});
  }

  markAsRead(userId: number, messageId: number) {
    this.http.post(this.baseUrl + 'user/' + userId + '/messages/' + messageId + '/read', {})
    .subscribe();
  }

  addtask(id: number, task: Task) {
    return this.http.post(this.baseUrl + 'user/' + id + '/tasks', this.formData); 
  }
  deletePaymentDetail(id: number, userId: number) {
    return this.http.delete(this.baseUrl + 'user/' + userId + '/tasks/' + id, {});
  }
  getTask(id: number) {
    this.http.get(this.baseUrl + 'user/' + id + '/tasks' )
      .toPromise()
      .then(res =>this.list = res as Task[]); 
      
  }
} 
