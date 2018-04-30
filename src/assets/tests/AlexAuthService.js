import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/operators/concatMap';
import { tap, concatMap } from 'rxjs/operators';
import { CONFIG } from "../config";

const httpOptions = { headers: { 'Content-Type': 'application/json' } };

@Injectable()
export class AuthService {

    public username: string;
    public role: string;
    public token: string;

    constructor(
        private http: HttpClient,
        private router: Router
    ) {
        this.username = localStorage.getItem("username");
        this.role = localStorage.getItem("role");
        this.token = localStorage.getItem("token");
    }

    public login(data): Observable<string> {

        const loginUrl = CONFIG.baseUrl + "login";
        const accountUrl = CONFIG.baseUrl + "account/me";

        return this.http.post(loginUrl, data).pipe(
                concatMap((res: any): Observable<string> => {

                    localStorage.setItem("token", this.token = res.data);

                    return this.http.get(accountUrl, { headers: { token: res.data }}).pipe(
                        tap((res: any) => {
                            localStorage.setItem("username", this.username = res.data.username);
                            localStorage.setItem("role", this.role = res.data.role);
                        })
                    );

                })
            );

    }

    public logoff(): void {

        localStorage.removeItem("token");

        this.router.navigate(['login']);

    }

    public register(data): Observable<string> {

        const url = CONFIG.baseUrl + "account";

        return this.http.post(url, data, httpOptions)
            .pipe(
                tap((res: any) => {
                    localStorage.setItem("token", this.token = res.data.token);
                    localStorage.setItem("username", this.username = res.data.username);
                    localStorage.setItem("role", this.role = res.data.role);
                })
            );

    }

    public isAuthenticated(): boolean {

        return !!this.token;

    }

}