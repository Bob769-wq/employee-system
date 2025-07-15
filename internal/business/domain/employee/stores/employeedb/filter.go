package employeedb

import (
	"strings"

	"github.com/mayainfo/employee-practice-be/internal/business/domain/employee"
)

func (s *Store) applyFilter(filter employee.QueryFilter, data map[string]any, sb *strings.Builder) {
	var wc []string

	if len(wc) > 0 {
		sb.WriteString(" WHERE ")
		sb.WriteString(strings.Join(wc, " AND "))
	}
}
