package hobbyapi

import "github.com/mayainfo/employee-practice-be/internal/business/domain/hobby"

var orderByFields = map[string]string{
	"createdAt": hobby.OrderByCreatedAt,
	"updatedAt": hobby.OrderByUpdatedAt,
}
