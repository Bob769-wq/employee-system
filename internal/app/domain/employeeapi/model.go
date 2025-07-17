package employeeapi

import (
	"time"

	"github.com/mayainfo/employee-practice-be/internal/app/domain/townapi"
	"github.com/mayainfo/employee-practice-be/internal/business/domain/employee"
	"github.com/mayainfo/employee-practice-be/internal/framework/validate"
)

// AppEmployee represents an individual employee.
type AppEmployee struct {
	ID              int                `json:"id"`
	FirstName       string             `json:"firstName"`
	LastName        string             `json:"lastName"`
	NationalID      string             `json:"nationalId"`
	Email           string             `json:"email"`
	Cellphone       string             `json:"cellphone"`
	Town            townapi.AppTown    `json:"town"`
	CreatedAt       time.Time          `json:"createdAt"`
	UpdatedAt       time.Time          `json:"updatedAt"`
	AddressDetail   string             `json:"addressDetail"`
	EmployeeHobbies []AppEmployeeHobby `json:"employeeHobbies"`
	// codegen:{AD}
}

func toAppEmployee(emp employee.Employee) AppEmployee {
	return AppEmployee{
		ID:         emp.ID,
		FirstName:  emp.FirstName,
		LastName:   emp.LastName,
		NationalID: emp.NationalID,
		Email:      emp.Email,
		Cellphone:  emp.Cellphone,
		Town: townapi.AppTown{
			ID:       emp.TownID,
			Name:     emp.TownName,
			PostCode: emp.PostCode,
			City: townapi.AppCity{
				ID:   emp.CityID,
				Name: emp.CityName,
			},
		},
		CreatedAt:       emp.CreatedAt,
		UpdatedAt:       emp.UpdatedAt,
		AddressDetail:   emp.AddressDetail,
		EmployeeHobbies: toAppEmployeeHobbies(emp.EmployeeHobbies),
		// codegen:{tAD}
	}
}

func toAppEmployees(emps []employee.Employee) []AppEmployee {
	items := make([]AppEmployee, len(emps))
	for i, emp := range emps {
		items[i] = toAppEmployee(emp)
	}

	return items
}

// =============================================================================

type AppNewEmployee struct {
	FirstName       string                   `json:"firstName"`
	LastName        string                   `json:"lastName"`
	NationalID      string                   `json:"nationalId"`
	Email           string                   `json:"email"`
	Cellphone       string                   `json:"cellphone"`
	TownID          int                      `json:"townId"`
	AddressDetail   string                   `json:"addressDetail"`
	EmployeeHobbies []AppUpdateEmployeeHobby `json:"updateEmployeeHobbies"`
	// codegen:{AN}
}

func (app AppNewEmployee) Validate() error {
	if err := validate.Check(app); err != nil {
		return err
	}

	return nil
}

func toCoreNewEmployee(app AppNewEmployee) (employee.NewEmployee, error) {
	employeeHobbies, err := toCoreUpdateEmployeeHobbies(app.EmployeeHobbies)
	if err != nil {
		return employee.NewEmployee{}, err
	}
	// codegen:{tManyBN}
	nEmp := employee.NewEmployee{
		FirstName:       app.FirstName,
		LastName:        app.LastName,
		NationalID:      app.NationalID,
		Email:           app.Email,
		Cellphone:       app.Cellphone,
		TownID:          app.TownID,
		AddressDetail:   app.AddressDetail,
		EmployeeHobbies: employeeHobbies,
		// codegen:{tBN}
	}

	return nEmp, nil
}

// =============================================================================

type AppUpdateEmployee struct {
	FirstName       string                   `json:"firstName"`
	LastName        string                   `json:"lastName"`
	NationalID      string                   `json:"nationalId"`
	Email           string                   `json:"email"`
	Cellphone       string                   `json:"cellphone"`
	TownID          int                      `json:"townId"`
	AddressDetail   string                   `json:"addressDetail"`
	EmployeeHobbies []AppUpdateEmployeeHobby `json:"updateEmployeeHobbies"`
	// codegen:{AU}
}

func (app AppUpdateEmployee) Validate() error {
	if err := validate.Check(app); err != nil {
		return err
	}

	return nil
}

func toCoreUpdateEmployee(app AppUpdateEmployee, empID int) (employee.UpdateEmployee, error) {
	employeeHobbies, err := toCoreUpdateEmployeeHobbies(app.EmployeeHobbies)
	if err != nil {
		return employee.UpdateEmployee{}, err
	}
	// codegen:{tManyBU}
	uEmp := employee.UpdateEmployee{
		FirstName:       app.FirstName,
		LastName:        app.LastName,
		NationalID:      app.NationalID,
		Email:           app.Email,
		Cellphone:       app.Cellphone,
		TownID:          app.TownID,
		AddressDetail:   app.AddressDetail,
		EmployeeHobbies: employeeHobbies,
		// codegen:{tBU}
	}

	return uEmp, nil
}
