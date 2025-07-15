package employeeapi

import (
	"time"

	"github.com/mayainfo/employee-practice-be/internal/app/domain/townapi"
	"github.com/mayainfo/employee-practice-be/internal/business/domain/employee"
	"github.com/mayainfo/employee-practice-be/internal/framework/validate"
)

// AppEmployee represents an individual employee.
type AppEmployee struct {
	ID         int             `json:"id"`
	FirstName  string          `json:"firstName"`
	LastName   string          `json:"lastName"`
	NationalID string          `json:"nationalId"`
	Email      string          `json:"email"`
	Cellphone  string          `json:"cellphone"`
	Town       townapi.AppTown `json:"town"`
	CreatedAt  time.Time       `json:"createdAt"`
	UpdatedAt  time.Time       `json:"updatedAt"`
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
		CreatedAt: emp.CreatedAt,
		UpdatedAt: emp.UpdatedAt,
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
	FirstName  string `json:"firstName"`
	LastName   string `json:"lastName"`
	NationalID string `json:"nationalId"`
	Email      string `json:"email"`
	Cellphone  string `json:"cellphone"`
	TownID     int    `json:"townId"`
	// codegen:{AN}
}

func (app AppNewEmployee) Validate() error {
	if err := validate.Check(app); err != nil {
		return err
	}

	return nil
}

func toCoreNewEmployee(app AppNewEmployee) (employee.NewEmployee, error) {
	// codegen:{tManyBN}
	nEmp := employee.NewEmployee{
		FirstName:  app.FirstName,
		LastName:   app.LastName,
		NationalID: app.NationalID,
		Email:      app.Email,
		Cellphone:  app.Cellphone,
		TownID:     app.TownID,
		// codegen:{tBN}
	}

	return nEmp, nil
}

// =============================================================================

type AppUpdateEmployee struct {
	FirstName  string `json:"firstName"`
	LastName   string `json:"lastName"`
	NationalID string `json:"nationalId"`
	Email      string `json:"email"`
	Cellphone  string `json:"cellphone"`
	TownID     int    `json:"townId"`
	// codegen:{AU}
}

func (app AppUpdateEmployee) Validate() error {
	if err := validate.Check(app); err != nil {
		return err
	}

	return nil
}

func toCoreUpdateEmployee(app AppUpdateEmployee) (employee.UpdateEmployee, error) {
	// codegen:{tManyBU}
	uEmp := employee.UpdateEmployee{
		FirstName:  app.FirstName,
		LastName:   app.LastName,
		NationalID: app.NationalID,
		Email:      app.Email,
		Cellphone:  app.Cellphone,
		TownID:     app.TownID,
		// codegen:{tBU}
	}

	return uEmp, nil
}
