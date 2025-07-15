package employeeapi

import (
	"context"
	"errors"
	"fmt"
	"net/http"
	"strconv"

	"github.com/mayainfo/employee-practice-be/internal/business/domain/employee"
	"github.com/mayainfo/employee-practice-be/internal/framework/web"
)

type ctxKey int

const (
	employeeKey ctxKey = iota
)

func getEmployee(ctx context.Context) (employee.Employee, error) {
	emp, ok := ctx.Value(employeeKey).(employee.Employee)
	if !ok {
		return employee.Employee{}, fmt.Errorf("employee not found in context")
	}

	return emp, nil
}

func setEmployee(ctx context.Context, emp employee.Employee) context.Context {
	return context.WithValue(ctx, employeeKey, emp)
}

func employeeCtx(empCore *employee.Core) web.MidFunc {
	m := func(next web.HandlerFunc) web.HandlerFunc {
		h := func(ctx context.Context, w http.ResponseWriter, r *http.Request) error {
			if id := web.Param(r, "employeeID"); id != "" {
				empID, err := strconv.Atoi(id)
				if err != nil {
					return ErrInvalidID
				}

				emp, err := empCore.QueryByID(ctx, empID)
				if err != nil {
					if errors.Is(err, employee.ErrNotFound) {
						return ErrNotFound
					}
					return fmt.Errorf("query: employeeID[%d]: %w", empID, err)
				}
				ctx = setEmployee(ctx, emp)
			}

			return next(ctx, w, r)
		}

		return h
	}

	return m
}
