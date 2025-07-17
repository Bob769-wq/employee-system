// Package hobby provides support for the hobby domain.
package hobby

import (
	"context"
	"errors"
	"fmt"

	"github.com/mayainfo/employee-practice-be/internal/business/sdk/order"
	"github.com/mayainfo/employee-practice-be/internal/business/sdk/paging"
	"github.com/mayainfo/employee-practice-be/internal/business/sdk/tran"
)

// Set of errors that are known to the business.
var (
	ErrNotFound     = errors.New("hobby not found")
	ErrDataConflict = errors.New("request data conflict with current data")
)

type Storer interface {
	NewWithTx(txM tran.TxManager) (Storer, error)
	Count(ctx context.Context, filter QueryFilter) (int, error)
	Query(ctx context.Context, filter QueryFilter, orderBy order.By, page paging.Page) ([]Hobby, error)
	QueryByID(ctx context.Context, hobbyID int) (Hobby, error)
	Create(ctx context.Context, hob Hobby) (Hobby, error)
	Update(ctx context.Context, hob Hobby) (Hobby, error)
	Delete(ctx context.Context, hob Hobby) error
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

// Count returns the total number of hobbies.
func (c *Core) Count(ctx context.Context, filter QueryFilter) (int, error) {
	cnt, err := c.storer.Count(ctx, filter)
	if err != nil {
		return 0, fmt.Errorf("count: %w", err)
	}

	return cnt, nil
}

// Query retrieves a list of existing hobbies.
func (c *Core) Query(ctx context.Context, filter QueryFilter, orderBy order.By, page paging.Page) ([]Hobby, error) {
	hobs, err := c.storer.Query(ctx, filter, orderBy, page)
	if err != nil {
		return nil, fmt.Errorf("query: %w", err)
	}

	return hobs, nil
}

// QueryByID finds the hobby by the specified ID.
func (c *Core) QueryByID(ctx context.Context, hobbyID int) (Hobby, error) {
	hob, err := c.storer.QueryByID(ctx, hobbyID)
	if err != nil {
		return Hobby{}, fmt.Errorf("query: hobbyID[%d]: %w", hobbyID, err)
	}

	return hob, nil
}

// Create adds a new hobby to the system.
func (c *Core) Create(ctx context.Context, nHob NewHobby) (Hobby, error) {
	hob := Hobby{
		Name: nHob.Name,
	}

	hob, err := c.storer.Create(ctx, hob)
	if err != nil {
		return Hobby{}, fmt.Errorf("create: %w", err)
	}

	result, err := c.storer.QueryByID(ctx, hob.ID)
	if err != nil {
		return Hobby{}, fmt.Errorf("query after create: %w", err)
	}

	return result, nil
}

// Update modifies information about a hobby.
func (c *Core) Update(ctx context.Context, hob Hobby, uHob UpdateHobby) (Hobby, error) {
	hob.Name = uHob.Name
	hob, err := c.storer.Update(ctx, hob)
	if err != nil {
		return Hobby{}, fmt.Errorf("update: %w", err)
	}

	result, err := c.storer.QueryByID(ctx, hob.ID)
	if err != nil {
		return Hobby{}, fmt.Errorf("query after update: %w", err)
	}

	return result, nil
}

// Delete removes the specified hobby.
func (c *Core) Delete(ctx context.Context, hob Hobby) error {
	if err := c.storer.Delete(ctx, hob); err != nil {
		return fmt.Errorf("delete: %w", err)
	}

	return nil
}
