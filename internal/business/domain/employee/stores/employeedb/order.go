package employeedb

import (
	"fmt"
	"strings"

	"github.com/mayainfo/employee-practice-be/internal/business/domain/employee"
	"github.com/mayainfo/employee-practice-be/internal/business/sdk/order"
)

var orderByFields = map[string]string{
	employee.OrderByCreatedAt: "created_at",
	employee.OrderByUpdatedAt: "updated_at",
}

func (s *Store) orderByClause(orderBy order.By, sb *strings.Builder) error {
	by, exists := orderByFields[orderBy.Field]
	if !exists {
		return fmt.Errorf("field %q does not exist", orderBy.Field)
	}

	sb.WriteString(" ORDER BY ")
	sb.WriteString(by)
	sb.WriteString(" ")
	sb.WriteString(orderBy.Direction)
	return nil
}
