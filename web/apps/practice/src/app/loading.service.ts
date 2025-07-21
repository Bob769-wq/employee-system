import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class loadingService {
  show() {
    console.log('loading');
  }

  hide() {
    console.log('');
  }
}
