package hobbydb

import (
	"strings"

	"github.com/mayainfo/employee-practice-be/internal/business/domain/hobby"
)

func (s *Store) applyFilter(filter hobby.QueryFilter, data map[string]any, sb *strings.Builder) {
	var wc []string

	if len(wc) > 0 {
		sb.WriteString(" WHERE ")
		sb.WriteString(strings.Join(wc, " AND "))
	}
}
