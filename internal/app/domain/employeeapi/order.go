package employeeapi

import "github.com/mayainfo/employee-practice-be/internal/business/domain/employee"

var orderByFields = map[string]string{
	"createdAt": employee.OrderByCreatedAt,
	"updatedAt": employee.OrderByUpdatedAt,
}
