// Package employee provides support for the employee domain.
package employee

import (
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/mayainfo/employee-practice-be/internal/business/sdk/order"
	"github.com/mayainfo/employee-practice-be/internal/business/sdk/paging"
	"github.com/mayainfo/employee-practice-be/internal/business/sdk/tran"
)

// Set of errors that are known to the business.
var (
	ErrNotFound     = errors.New("employee not found")
	ErrDataConflict = errors.New("request data conflict with current data")
)

type Storer interface {
	NewWithTx(txM tran.TxManager) (Storer, error)
	Count(ctx context.Context, filter QueryFilter) (int, error)
	Query(ctx context.Context, filter QueryFilter, orderBy order.By, page paging.Page) ([]Employee, error)
	QueryByID(ctx context.Context, employeeID int) (Employee, error)
	Create(ctx context.Context, emp Employee) (Employee, error)
	Update(ctx context.Context, emp Employee) (Employee, error)
	Delete(ctx context.Context, emp Employee) error
}

// ====================================================================================

type Core struct {
	storer Storer
}

func NewCore(storer Storer) *Core {
	return &Core{
		storer: storer,
	}
}

func (c *Core) NewWithTx(txM tran.TxManager) (*Core, error) {
	storer, err := c.storer.NewWithTx(txM)
	if err != nil {
		return nil, err
	}

	return &Core{
		storer: storer,
	}, nil
}

// Count returns the total number of employees.
func (c *Core) Count(ctx context.Context, filter QueryFilter) (int, error) {
	cnt, err := c.storer.Count(ctx, filter)
	if err != nil {
		return 0, fmt.Errorf("count: %w", err)
	}

	return cnt, nil
}

// Query retrieves a list of existing employees.
func (c *Core) Query(ctx context.Context, filter QueryFilter, orderBy order.By, page paging.Page) ([]Employee, error) {
	emps, err := c.storer.Query(ctx, filter, orderBy, page)
	if err != nil {
		return nil, fmt.Errorf("query: %w", err)
	}

	return emps, nil
}

// QueryByID finds the employee by the specified ID.
func (c *Core) QueryByID(ctx context.Context, employeeID int) (Employee, error) {
	emp, err := c.storer.QueryByID(ctx, employeeID)
	if err != nil {
		return Employee{}, fmt.Errorf("query: employeeID[%d]: %w", employeeID, err)
	}

	return emp, nil
}

// Create adds a new employee to the system.
func (c *Core) Create(ctx context.Context, nEmp NewEmployee) (Employee, error) {
	now := time.Now()
	emp := Employee{
		FirstName:  nEmp.FirstName,
		LastName:   nEmp.LastName,
		NationalID: nEmp.NationalID,
		Email:      nEmp.Email,
		Cellphone:  nEmp.Cellphone,
		TownID:     nEmp.TownID,
		CreatedAt:  now,
		UpdatedAt:  now,
	}

	emp, err := c.storer.Create(ctx, emp)
	if err != nil {
		return Employee{}, fmt.Errorf("create: %w", err)
	}

	result, err := c.storer.QueryByID(ctx, emp.ID)
	if err != nil {
		return Employee{}, fmt.Errorf("query after create: %w", err)
	}

	return result, nil
}

// Update modifies information about a employee.
func (c *Core) Update(ctx context.Context, emp Employee, uEmp UpdateEmployee) (Employee, error) {
	emp.UpdatedAt = time.Now()
	emp.FirstName = uEmp.FirstName
	emp.LastName = uEmp.LastName
	emp.NationalID = uEmp.NationalID
	emp.Email = uEmp.Email
	emp.Cellphone = uEmp.Cellphone
	emp.TownID = uEmp.TownID
	emp, err := c.storer.Update(ctx, emp)
	if err != nil {
		return Employee{}, fmt.Errorf("update: %w", err)
	}

	result, err := c.storer.QueryByID(ctx, emp.ID)
	if err != nil {
		return Employee{}, fmt.Errorf("query after update: %w", err)
	}

	return result, nil
}

// Delete removes the specified employee.
func (c *Core) Delete(ctx context.Context, emp Employee) error {
	if err := c.storer.Delete(ctx, emp); err != nil {
		return fmt.Errorf("delete: %w", err)
	}

	return nil
}
