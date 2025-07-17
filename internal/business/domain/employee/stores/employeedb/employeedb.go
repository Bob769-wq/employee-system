// Package employeedb contains employee related CRUD functionality.
package employeedb

import (
	"context"
	"errors"
	"fmt"
	"strings"

	"github.com/mayainfo/employee-practice-be/internal/business/domain/employee"
	"github.com/mayainfo/employee-practice-be/internal/business/sdk/order"
	"github.com/mayainfo/employee-practice-be/internal/business/sdk/paging"
	"github.com/mayainfo/employee-practice-be/internal/business/sdk/sqldb"
	"github.com/mayainfo/employee-practice-be/internal/business/sdk/tran"
)

// Store manages the set of APIs for employee database access.
type Store struct {
	db *sqldb.DB
}

// NewStore constructs the api for data access.
func NewStore(db *sqldb.DB) *Store {
	return &Store{
		db: db,
	}
}

// NewWithTx constructs a new Store which replaces the underlying database connection with the provided transaction.
func (s *Store) NewWithTx(txM tran.TxManager) (employee.Storer, error) {
	ec, err := tran.GetExtContext(txM)
	if err != nil {
		return nil, err
	}

	return &Store{
		db: ec,
	}, nil
}

// Count returns the total number of employees in the DB.
func (s *Store) Count(ctx context.Context, filter employee.QueryFilter) (int, error) {
	data := map[string]any{}

	const q = `
        SELECT COUNT(*)
        FROM employees
    `

	var sb strings.Builder
	sb.WriteString(q)
	s.applyFilter(filter, data, &sb)

	var dest struct {
		Count int `db:"count"`
	}
	if err := sqldb.NamedQueryStruct(ctx, s.db, sb.String(), data, &dest); err != nil {
		return 0, fmt.Errorf("namedquerystruct: %w", err)
	}

	return dest.Count, nil
}

// Query retrieves a list of existing employees from the database.
func (s *Store) Query(ctx context.Context, filter employee.QueryFilter, orderBy order.By, page paging.Page) ([]employee.Employee, error) {
	data := map[string]any{
		"offset":        page.Offset(),
		"rows_per_page": page.RowsPerPage(),
	}

	const q = `
        SELECT  employee_id,
                first_name,
                last_name,
                national_id,
                email,
                cellphone,
                town_id,
                town_name,
                post_code,
                city_id,
                city_name,
				address_detail,
				created_at,
				updated_at
        FROM v_employees
    `

	var sb strings.Builder
	sb.WriteString(q)
	s.applyFilter(filter, data, &sb)

	if err := s.orderByClause(orderBy, &sb); err != nil {
		return nil, err
	}

	sb.WriteString(" OFFSET :offset ROWS FETCH NEXT :rows_per_page ROWS ONLY")

	var dbemps []dbEmployee
	if err := sqldb.NamedQuerySlice(ctx, s.db, sb.String(), data, &dbemps); err != nil {
		return nil, fmt.Errorf("namedqueryslice: %w", err)
	}

	return toCoreEmployees(dbemps)
}

// QueryByID finds the employee identified by a given ID.
func (s *Store) QueryByID(ctx context.Context, employeeID int) (employee.Employee, error) {
	data := struct {
		ID int `db:"employee_id"`
	}{
		ID: employeeID,
	}

	const q = `
        SELECT employee_id,
               first_name,
               last_name,
               national_id,
               email,
               cellphone,
               town_id,
               town_name,
               post_code,
               city_id,
               city_name,
			   address_detail,
			   created_at,
			   updated_at
        FROM v_employees
        WHERE employee_id = :employee_id
    `

	var dbemp dbEmployee
	if err := sqldb.NamedQueryStruct(ctx, s.db, q, data, &dbemp); err != nil {
		if errors.Is(err, sqldb.ErrDBNotFound) {
			return employee.Employee{}, employee.ErrNotFound
		}
		return employee.Employee{}, fmt.Errorf("namedquerystruct: %w", err)
	}

	return toCoreEmployee(dbemp)
}

// Create adds a Employee to the database. It returns an error if something went wrong
func (s *Store) Create(ctx context.Context, emp employee.Employee) (employee.Employee, error) {
	dbemp := toDBEmployee(emp)

	const q = `
        INSERT INTO employees
        (   
            first_name,
            last_name,
            national_id,
            email,
            cellphone,
            town_id,
			address_detail
        )
        VALUES
        (   
            :first_name,
            :last_name,
            :national_id,
            :email,
            :cellphone,
            :town_id,
			:address_detail
        )
        RETURNING employee_id
    `

	if err := sqldb.NamedQueryStruct(ctx, s.db, q, dbemp, &dbemp); err != nil {
		if errors.Is(err, sqldb.ErrDBIntegrity) || errors.Is(err, sqldb.ErrDBDuplicatedEntry) {
			return employee.Employee{}, employee.ErrDataConflict
		}
		return employee.Employee{}, fmt.Errorf("namedexeccontext: %w", err)
	}

	return toCoreEmployee(dbemp)
}

// Update modifies data about a Employee. It will error if the specified ID is
// invalid or does not reference an existing Employee.
func (s *Store) Update(ctx context.Context, emp employee.Employee) (employee.Employee, error) {
	dbemp := toDBEmployee(emp)

	const q = `
        UPDATE employees
        SET
            updated_at = :updated_at,
            first_name  = :first_name,
            last_name   = :last_name,
            national_id = :national_id,
            email       = :email,
            cellphone   = :cellphone,
            town_id     = :town_id,
			address_detail = :address_detail
        WHERE employee_id = :employee_id
        RETURNING employee_id
    `

	if err := sqldb.NamedQueryStruct(ctx, s.db, q, dbemp, &dbemp); err != nil {
		if errors.Is(err, sqldb.ErrDBIntegrity) || errors.Is(err, sqldb.ErrDBDuplicatedEntry) {
			return employee.Employee{}, employee.ErrDataConflict
		}
		return employee.Employee{}, fmt.Errorf("namedquerystruct: %w", err)
	}

	return toCoreEmployee(dbemp)
}

// Delete removes the Employee identified by a given ID.
func (s *Store) Delete(ctx context.Context, emp employee.Employee) error {
	data := struct {
		ID int `db:"employee_id"`
	}{
		ID: emp.ID,
	}

	const q = `
        DELETE
        FROM employees
        WHERE employee_id = :employee_id
    `

	if err := sqldb.NamedExecContext(ctx, s.db, q, data); err != nil {
		if errors.Is(err, sqldb.ErrDBIntegrity) || errors.Is(err, sqldb.ErrDBDuplicatedEntry) {
			return employee.ErrDataConflict
		}
		return fmt.Errorf("namedexeccontext: %w", err)
	}

	return nil
}
