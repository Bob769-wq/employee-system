package employeeapi

import (
	"context"
	"errors"
	"fmt"
	"net/http"

	"github.com/mayainfo/employee-practice-be/internal/app/sdk/errs"
	"github.com/mayainfo/employee-practice-be/internal/app/sdk/query"
	"github.com/mayainfo/employee-practice-be/internal/business/domain/employee"
	"github.com/mayainfo/employee-practice-be/internal/business/sdk/order"
	"github.com/mayainfo/employee-practice-be/internal/business/sdk/paging"
	"github.com/mayainfo/employee-practice-be/internal/business/sdk/tran"
	"github.com/mayainfo/employee-practice-be/internal/framework/logger"
	"github.com/mayainfo/employee-practice-be/internal/framework/web"
)

var (
	ErrInvalidID           = errs.NewTrustedError(fmt.Errorf("invalid employee id"), http.StatusBadRequest)
	ErrNotFound            = errs.NewTrustedError(fmt.Errorf("employee not found"), http.StatusNotFound)
	ErrEtagVersionConflict = errs.NewTrustedError(fmt.Errorf("etag version conflict"), http.StatusPreconditionFailed)
	ErrConflict            = errs.NewTrustedError(fmt.Errorf("request data conflict with current data"), http.StatusConflict)
)

type handlers struct {
	log      *logger.Logger
	txM      tran.TxManager
	employee *employee.Core
}

func newHandlers(log *logger.Logger, txM tran.TxManager, employee *employee.Core) *handlers {
	return &handlers{
		log:      log,
		txM:      txM,
		employee: employee,
	}
}

func (h *handlers) newWithTx(txM tran.TxManager) (*handlers, error) {
	emp, err := h.employee.NewWithTx(txM)
	if err != nil {
		return nil, err
	}

	return &handlers{
		log:      h.log,
		txM:      txM,
		employee: emp,
	}, nil
}

func (h *handlers) query(ctx context.Context, w http.ResponseWriter, r *http.Request) error {
	qp := parseQueryParams(r)

	page, err := paging.Parse(qp.Page, qp.PageSize)
	if err != nil {
		return errs.NewTrustedError(err, http.StatusBadRequest)
	}

	orderBy, err := order.Parse(orderByFields, qp.OrderBy, employee.DefaultOrderBy)
	if err != nil {
		return errs.NewTrustedError(err, http.StatusBadRequest)
	}

	qf, err := parseQueryFilter(qp)
	if err != nil {
		return errs.NewTrustedError(err, http.StatusBadRequest)
	}

	emps, err := h.employee.Query(ctx, qf, orderBy, page)
	if err != nil {
		return fmt.Errorf("query: %w", err)
	}

	total, err := h.employee.Count(ctx, qf)
	if err != nil {
		return fmt.Errorf("count: %w", err)
	}

	return web.Respond(ctx, w, query.NewResult(toAppEmployees(emps), total, page), http.StatusOK)
}

func (h *handlers) queryByID(ctx context.Context, w http.ResponseWriter, r *http.Request) error {
	emp, err := getEmployee(ctx)
	if err != nil {
		return err
	}

	return web.Respond(ctx, w, toAppEmployee(emp), http.StatusOK)
}

func (h *handlers) create(ctx context.Context, w http.ResponseWriter, r *http.Request) error {
	var app AppNewEmployee
	if err := web.Decode(r, &app); err != nil {
		return errs.NewTrustedError(err, http.StatusBadRequest)
	}

	nEmp, err := toCoreNewEmployee(app)
	if err != nil {
		return errs.NewTrustedError(err, http.StatusBadRequest)
	}

	var emp employee.Employee
	if err := h.txM.RunTx(ctx, func(txM tran.TxManager) error {
		h, err := h.newWithTx(txM)
		if err != nil {
			return err
		}

		emp, err = h.employee.Create(ctx, nEmp)
		if err != nil {
			return fmt.Errorf("create: emp[%+v]: %w", app, err)
		}

		return nil
	}); err != nil {
		if errors.Is(err, employee.ErrDataConflict) {
			return ErrConflict
		}
		return err
	}

	return web.Respond(ctx, w, toAppEmployee(emp), http.StatusCreated)
}

func (h *handlers) update(ctx context.Context, w http.ResponseWriter, r *http.Request) error {
	var app AppUpdateEmployee
	if err := web.Decode(r, &app); err != nil {
		return errs.NewTrustedError(err, http.StatusBadRequest)
	}

	uEmp, err := toCoreUpdateEmployee(app)
	if err != nil {
		return errs.NewTrustedError(err, http.StatusBadRequest)
	}

	emp, err := getEmployee(ctx)
	if err != nil {
		return err
	}

	if err := h.txM.RunTx(ctx, func(txM tran.TxManager) error {
		h, err := h.newWithTx(txM)
		if err != nil {
			return err
		}

		emp, err = h.employee.Update(ctx, emp, uEmp)
		if err != nil {
			return fmt.Errorf("update: employeeID[%d] app[%+v]: %w", emp.ID, app, err)
		}

		return nil
	}); err != nil {
		if errors.Is(err, employee.ErrDataConflict) {
			return ErrConflict
		}
		return err
	}

	return web.Respond(ctx, w, toAppEmployee(emp), http.StatusOK)
}

func (h *handlers) delete(ctx context.Context, w http.ResponseWriter, r *http.Request) error {
	emp, err := getEmployee(ctx)
	if err != nil {
		return err
	}

	if err := h.txM.RunTx(ctx, func(txM tran.TxManager) error {
		h, err := h.newWithTx(txM)
		if err != nil {
			return err
		}

		if err := h.employee.Delete(ctx, emp); err != nil {
			return fmt.Errorf("delete: employeeID[%d]: %w", emp.ID, err)
		}

		return nil
	}); err != nil {
		return err
	}

	return web.Respond(ctx, w, nil, http.StatusNoContent)
}
