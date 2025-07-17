package hobbyapi

import (
	"context"
	"errors"
	"fmt"
	"net/http"
	"strconv"

	"github.com/mayainfo/employee-practice-be/internal/business/domain/hobby"
	"github.com/mayainfo/employee-practice-be/internal/framework/web"
)

type ctxKey int

const (
	hobbyKey ctxKey = iota
)

func getHobby(ctx context.Context) (hobby.Hobby, error) {
	hob, ok := ctx.Value(hobbyKey).(hobby.Hobby)
	if !ok {
		return hobby.Hobby{}, fmt.Errorf("hobby not found in context")
	}

	return hob, nil
}

func setHobby(ctx context.Context, hob hobby.Hobby) context.Context {
	return context.WithValue(ctx, hobbyKey, hob)
}

func hobbyCtx(hobCore *hobby.Core) web.MidFunc {
	m := func(next web.HandlerFunc) web.HandlerFunc {
		h := func(ctx context.Context, w http.ResponseWriter, r *http.Request) error {
			if id := web.Param(r, "hobbyID"); id != "" {
				hobID, err := strconv.Atoi(id)
				if err != nil {
					return ErrInvalidID
				}

				hob, err := hobCore.QueryByID(ctx, hobID)
				if err != nil {
					if errors.Is(err, hobby.ErrNotFound) {
						return ErrNotFound
					}
					return fmt.Errorf("query: hobbyID[%d]: %w", hobID, err)
				}
				ctx = setHobby(ctx, hob)
			}

			return next(ctx, w, r)
		}

		return h
	}

	return m
}
