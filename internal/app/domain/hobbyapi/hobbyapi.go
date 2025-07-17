package hobbyapi

import (
	"context"
	"errors"
	"fmt"
	"net/http"

	"github.com/mayainfo/employee-practice-be/internal/app/sdk/errs"
	"github.com/mayainfo/employee-practice-be/internal/app/sdk/query"
	"github.com/mayainfo/employee-practice-be/internal/business/domain/hobby"
	"github.com/mayainfo/employee-practice-be/internal/business/sdk/order"
	"github.com/mayainfo/employee-practice-be/internal/business/sdk/paging"
	"github.com/mayainfo/employee-practice-be/internal/business/sdk/tran"
	"github.com/mayainfo/employee-practice-be/internal/framework/logger"
	"github.com/mayainfo/employee-practice-be/internal/framework/web"
)

var (
	ErrInvalidID           = errs.NewTrustedError(fmt.Errorf("invalid hobby id"), http.StatusBadRequest)
	ErrNotFound            = errs.NewTrustedError(fmt.Errorf("hobby not found"), http.StatusNotFound)
	ErrEtagVersionConflict = errs.NewTrustedError(fmt.Errorf("etag version conflict"), http.StatusPreconditionFailed)
	ErrConflict            = errs.NewTrustedError(fmt.Errorf("request data conflict with current data"), http.StatusConflict)
)

type handlers struct {
	log   *logger.Logger
	txM   tran.TxManager
	hobby *hobby.Core
}

func newHandlers(log *logger.Logger, txM tran.TxManager, hobby *hobby.Core) *handlers {
	return &handlers{
		log:   log,
		txM:   txM,
		hobby: hobby,
	}
}

func (h *handlers) newWithTx(txM tran.TxManager) (*handlers, error) {
	hob, err := h.hobby.NewWithTx(txM)
	if err != nil {
		return nil, err
	}

	return &handlers{
		log:   h.log,
		txM:   txM,
		hobby: hob,
	}, nil
}

func (h *handlers) query(ctx context.Context, w http.ResponseWriter, r *http.Request) error {
	qp := parseQueryParams(r)

	page, err := paging.Parse(qp.Page, qp.PageSize)
	if err != nil {
		return errs.NewTrustedError(err, http.StatusBadRequest)
	}

	orderBy, err := order.Parse(orderByFields, qp.OrderBy, hobby.DefaultOrderBy)
	if err != nil {
		return errs.NewTrustedError(err, http.StatusBadRequest)
	}

	qf, err := parseQueryFilter(qp)
	if err != nil {
		return errs.NewTrustedError(err, http.StatusBadRequest)
	}

	hobs, err := h.hobby.Query(ctx, qf, orderBy, page)
	if err != nil {
		return fmt.Errorf("query: %w", err)
	}

	total, err := h.hobby.Count(ctx, qf)
	if err != nil {
		return fmt.Errorf("count: %w", err)
	}

	return web.Respond(ctx, w, query.NewResult(toAppHobbies(hobs), total, page), http.StatusOK)
}

func (h *handlers) queryByID(ctx context.Context, w http.ResponseWriter, r *http.Request) error {
	hob, err := getHobby(ctx)
	if err != nil {
		return err
	}

	return web.Respond(ctx, w, toAppHobby(hob), http.StatusOK)
}

func (h *handlers) create(ctx context.Context, w http.ResponseWriter, r *http.Request) error {
	var app AppNewHobby
	if err := web.Decode(r, &app); err != nil {
		return errs.NewTrustedError(err, http.StatusBadRequest)
	}

	nHob, err := toCoreNewHobby(app)
	if err != nil {
		return errs.NewTrustedError(err, http.StatusBadRequest)
	}

	var hob hobby.Hobby
	if err := h.txM.RunTx(ctx, func(txM tran.TxManager) error {
		h, err := h.newWithTx(txM)
		if err != nil {
			return err
		}

		hob, err = h.hobby.Create(ctx, nHob)
		if err != nil {
			return fmt.Errorf("create: hob[%+v]: %w", app, err)
		}

		return nil
	}); err != nil {
		if errors.Is(err, hobby.ErrDataConflict) {
			return ErrConflict
		}
		return err
	}

	return web.Respond(ctx, w, toAppHobby(hob), http.StatusCreated)
}

func (h *handlers) update(ctx context.Context, w http.ResponseWriter, r *http.Request) error {
	var app AppUpdateHobby
	if err := web.Decode(r, &app); err != nil {
		return errs.NewTrustedError(err, http.StatusBadRequest)
	}

	uHob, err := toCoreUpdateHobby(app)
	if err != nil {
		return errs.NewTrustedError(err, http.StatusBadRequest)
	}

	hob, err := getHobby(ctx)
	if err != nil {
		return err
	}

	if err := h.txM.RunTx(ctx, func(txM tran.TxManager) error {
		h, err := h.newWithTx(txM)
		if err != nil {
			return err
		}

		hob, err = h.hobby.Update(ctx, hob, uHob)
		if err != nil {
			return fmt.Errorf("update: hobbyID[%d] app[%+v]: %w", hob.ID, app, err)
		}

		return nil
	}); err != nil {
		if errors.Is(err, hobby.ErrDataConflict) {
			return ErrConflict
		}
		return err
	}

	return web.Respond(ctx, w, toAppHobby(hob), http.StatusOK)
}

func (h *handlers) delete(ctx context.Context, w http.ResponseWriter, r *http.Request) error {
	hob, err := getHobby(ctx)
	if err != nil {
		return err
	}

	if err := h.txM.RunTx(ctx, func(txM tran.TxManager) error {
		h, err := h.newWithTx(txM)
		if err != nil {
			return err
		}

		if err := h.hobby.Delete(ctx, hob); err != nil {
			return fmt.Errorf("delete: hobbyID[%d]: %w", hob.ID, err)
		}

		return nil
	}); err != nil {
		return err
	}

	return web.Respond(ctx, w, nil, http.StatusNoContent)
}
