package employeedb

import (
	"context"
	"errors"
	"fmt"

	"github.com/mayainfo/employee-practice-be/internal/business/domain/employee"
	"github.com/mayainfo/employee-practice-be/internal/business/sdk/sqldb"
)

type dbEmployeeHobby struct {
	ID         int    `db:"hobby_id" json:"hobby_id"`
	EmployeeID int    `db:"employee_id" json:"employee_id"`
	Name       string `db:"hobby_name" json:"hobby_name"`
	// codegen:{SD}
}

func toDBEmployeeHobby(ehobby employee.EmployeeHobby) dbEmployeeHobby {
	dbEhobby := dbEmployeeHobby{
		ID:         ehobby.ID,
		EmployeeID: ehobby.EmployeeID,
		Name:       ehobby.Name,
		// codegen:{tSD}
	}

	return dbEhobby
}

func toCoreEmployeeHobby(dbEhobby dbEmployeeHobby) (employee.EmployeeHobby, error) {
	ehobby := employee.EmployeeHobby{
		ID:         dbEhobby.ID,
		EmployeeID: dbEhobby.EmployeeID,
		Name:       dbEhobby.Name,
		// codegen:{tBD}
	}

	return ehobby, nil
}

func toCoreEmployeeHobbies(dbEmployeeHobbies []dbEmployeeHobby) ([]employee.EmployeeHobby, error) {
	ehobbys := make([]employee.EmployeeHobby, len(dbEmployeeHobbies))
	for i, dbEhobby := range dbEmployeeHobbies {
		ehobby, err := toCoreEmployeeHobby(dbEhobby)
		if err != nil {
			return nil, fmt.Errorf("parse type: %w", err)
		}
		ehobbys[i] = ehobby
	}

	return ehobbys, nil
}

func toDBJSONEmployeeEmployeeHobbies(emp employee.Employee) []dbEmployeeHobby {
	dbEhobbys := make([]dbEmployeeHobby, len(emp.EmployeeHobbies))
	for i, ehobby := range emp.EmployeeHobbies {
		dbEhobbys[i] = toDBEmployeeHobby(ehobby)
		dbEhobbys[i].EmployeeID = emp.ID
	}

	return dbEhobbys
}

func toDBJSONEmployeeArrayEmployeeHobbies(ehobbys []employee.Employee) []dbEmployeeHobby {
	var dbEhobbys []dbEmployeeHobby
	for _, ehobby := range ehobbys {
		dbEhobbys = append(dbEhobbys, toDBJSONEmployeeEmployeeHobbies(ehobby)...)
	}

	return dbEhobbys
}

func (s *Store) deleteAllEmployeeEmployeeHobbies(ctx context.Context, ehobbyID int) error {
	data := struct {
		ID int `db:"employee_id"`
	}{
		ID: ehobbyID,
	}

	const q = `
        DELETE FROM employee_hobbies
        WHERE employee_id = :employee_id
    `

	if err := sqldb.NamedExecContext(ctx, s.db, q, data); err != nil {
		return fmt.Errorf("namedexeccontext: %w", err)
	}

	return nil
}

func (s *Store) createEmployeeEmployeeHobbies(ctx context.Context, ehobby employee.Employee) error {
	dbehobbys := toDBJSONEmployeeEmployeeHobbies(ehobby)

	const q = `
        INSERT INTO employee_hobbies
        (employee_id, hobby_id)
        VALUES
        (:employee_id, :hobby_id)
    `

	if err := sqldb.NamedExecContext(ctx, s.db, q, dbehobbys); err != nil {
		if errors.Is(err, sqldb.ErrDBIntegrity) || errors.Is(err, sqldb.ErrDBDuplicatedEntry) {
			return employee.ErrDataConflict
		}
		return fmt.Errorf("namedexeccontext: %w", err)
	}

	return nil
}
