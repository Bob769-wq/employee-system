package hobbyapi

import (
	"net/http"

	"github.com/mayainfo/employee-practice-be/internal/business/domain/hobby"
)

type QueryParams struct {
	Page     string
	PageSize string
	OrderBy  string
}

func parseQueryParams(r *http.Request) QueryParams {
	values := r.URL.Query()

	filter := QueryParams{
		Page:     values.Get("page"),
		PageSize: values.Get("pageSize"),
		OrderBy:  values.Get("orderBy"),
	}

	return filter
}

func parseQueryFilter(qp QueryParams) (hobby.QueryFilter, error) {
	filter := hobby.QueryFilter{}

	return filter, nil
}
