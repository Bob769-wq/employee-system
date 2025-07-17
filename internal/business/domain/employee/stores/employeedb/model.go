package employeedb

import (
	"fmt"
	"time"

	"github.com/mayainfo/employee-practice-be/internal/business/domain/employee"
)

// dbEmployee represents an individual employee.
type dbEmployee struct {
	ID            int       `db:"employee_id"`
	FirstName     string    `db:"first_name"`
	LastName      string    `db:"last_name"`
	NationalID    string    `db:"national_id"`
	Email         string    `db:"email"`
	Cellphone     string    `db:"cellphone"`
	TownID        int       `db:"town_id"`
	TownName      string    `db:"town_name"`
	PostCode      string    `db:"post_code"`
	CityID        int       `db:"city_id"`
	CityName      string    `db:"city_name"`
	CreatedAt     time.Time `db:"created_at"`
	UpdatedAt     time.Time `db:"updated_at"`
	AddressDetail string    `db:"addressdetail"`
	// codegen:{SD}
}

func toDBEmployee(emp employee.Employee) dbEmployee {
	dbEmp := dbEmployee{
		ID:            emp.ID,
		FirstName:     emp.FirstName,
		LastName:      emp.LastName,
		NationalID:    emp.NationalID,
		Email:         emp.Email,
		Cellphone:     emp.Cellphone,
		TownID:        emp.TownID,
		TownName:      emp.TownName,
		PostCode:      emp.PostCode,
		CityID:        emp.CityID,
		CityName:      emp.CityName,
		CreatedAt:     emp.CreatedAt,
		UpdatedAt:     emp.UpdatedAt,
		AddressDetail: emp.AddressDetail,
		// codegen:{tSD}
	}

	return dbEmp
}

func toCoreEmployee(dbEmp dbEmployee) (employee.Employee, error) {
	emp := employee.Employee{
		ID:            dbEmp.ID,
		FirstName:     dbEmp.FirstName,
		LastName:      dbEmp.LastName,
		NationalID:    dbEmp.NationalID,
		Email:         dbEmp.Email,
		Cellphone:     dbEmp.Cellphone,
		TownID:        dbEmp.TownID,
		TownName:      dbEmp.TownName,
		PostCode:      dbEmp.PostCode,
		CityID:        dbEmp.CityID,
		CityName:      dbEmp.CityName,
		CreatedAt:     dbEmp.CreatedAt,
		UpdatedAt:     dbEmp.UpdatedAt,
		AddressDetail: dbEmp.AddressDetail,
		// codegen:{tBD}
	}

	return emp, nil
}

func toCoreEmployees(dbEmployees []dbEmployee) ([]employee.Employee, error) {
	emps := make([]employee.Employee, len(dbEmployees))
	for i, dbEmp := range dbEmployees {
		emp, err := toCoreEmployee(dbEmp)
		if err != nil {
			return nil, fmt.Errorf("parse type: %w", err)
		}
		emps[i] = emp
	}

	return emps, nil
}
