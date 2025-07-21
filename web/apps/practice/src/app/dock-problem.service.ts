import { Injectable } from '@angular/core';

export interface Employee {
  id: number;
  name: string;
  townId: number;
}

export interface Town {
  id: number;
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class DockProblemService {
  mockTowns: Town[] = [
    { id: 1, name: 'A' },
    { id: 2, name: 'B' },
    { id: 3, name: 'C' },
    { id: 4, name: 'D' },
    { id: 5, name: 'E' },
    { id: 6, name: 'F' },
    { id: 7, name: 'G' },
    { id: 8, name: 'H' },
  ];

  mockEmployees: Employee[] = [
    { id: 1, name: 'Allen', townId: 1 },
    { id: 2, name: 'Barry', townId: 2 },
    { id: 3, name: 'Cody', townId: 3 },
    { id: 4, name: 'David', townId: 4 },
    { id: 5, name: 'Eric', townId: 5 },
    { id: 6, name: 'Frank', townId: 6 },
    { id: 7, name: 'George', townId: 7 },
    { id: 8, name: 'Hank', townId: 8 },
  ];

  getEmployees(): Employee[] {
    return this.mockEmployees;
  }

  getTownName(townId: number): string {
    const town = this.mockTowns.find((towns) => towns.id === townId);
    return town ? town.name : 'unknown';
  }

  getEmployeesWithTownName(): Array<Employee & { townName: string }> {
    return this.mockEmployees.map((employee) => ({
      ...employee,
      townName: this.getTownName(employee.townId),
    }));
  }
}
