package hobbydb

import (
	"fmt"
	"strings"

	"github.com/mayainfo/employee-practice-be/internal/business/domain/hobby"
	"github.com/mayainfo/employee-practice-be/internal/business/sdk/order"
)

var orderByFields = map[string]string{
	hobby.OrderByCreatedAt: "created_at",
	hobby.OrderByUpdatedAt: "updated_at",
	hobby.OrderByID:        "hobby_id",
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
