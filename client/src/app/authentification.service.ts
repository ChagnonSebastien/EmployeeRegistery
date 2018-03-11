import { Injectable } from '@angular/core';
import { DiffieHellmanGroup } from 'diffie-hellman';
import { Http } from '@angular/http';

@Injectable()
export class AuthentificationService {

  private token: String;

  constructor(private http: Http) {
  }

}
