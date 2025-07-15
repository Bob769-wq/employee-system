package employeeapi

import (
	"net/http"

	"github.com/mayainfo/employee-practice-be/internal/business/domain/employee"
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

func parseQueryFilter(qp QueryParams) (employee.QueryFilter, error) {
	filter := employee.QueryFilter{}

	return filter, nil
}
