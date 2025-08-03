import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AppService {
  constructor(private http: HttpClient) {}
  mock(data: string) {
    this.http
      .post(
        'https://forma-ws-api-d4f0hafxfugrhnd3.germanywestcentral-01.azurewebsites.net/api',
        { email: data }
      )
      .subscribe((res) => {
        console.log(res);
      });
  }
}
