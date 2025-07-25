import { Injectable, signal } from '@angular/core';
import { EmployeeHobby } from 'web/libs/practice/shared/data-access/api/src/lib/models/employee-hobby';

@Injectable({
  providedIn: 'root',
})
export class EmployeeHobbyService {
  chosenEmployeeHobbies = signal<EmployeeHobby[]>([]);

  resetChosenEmployeeHobbies(employeeHobbies: EmployeeHobby[]) {
    this.chosenEmployeeHobbies.set(employeeHobbies);
  }

  deleteByIndex(index: number) {
    this.chosenEmployeeHobbies.update((hobbies) => {
      return [...hobbies].filter((_, i) => i !== index);
    });
  }

  deleteById(hobbyId: number) {
    this.chosenEmployeeHobbies.update((hobbies) => {
      return [...hobbies].filter((hobby) => hobby.id !== hobbyId);
    });
  }

  chooseEmployeeHobby(employeeHobby: EmployeeHobby) {
    this.chosenEmployeeHobbies.update((hobbies) => {
      return [...hobbies, employeeHobby];
    });
  }
}
