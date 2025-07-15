import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MockImageService {
  images = signal<string[]>([
    './mock-images/buddha_1.png',
    './mock-images/buddha_2.png',
    './mock-images/buddha_3.png',
    './mock-images/buddha_4.png',
    './mock-images/buddha_5.png',
  ]);

  // constructor() {

  // }
}
