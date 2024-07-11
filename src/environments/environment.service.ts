import { Injectable } from '@angular/core';
import * as dotenv from 'dotenv'

@Injectable({
  providedIn: 'root'
})
export class EnvironmentService {

  constructor() { dotenv.config({ path: '.env' }) }

  get apiUrl() {
    return process.env['API_URL']
  }
}
