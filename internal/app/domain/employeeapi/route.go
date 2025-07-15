package employeeapi

import (
	"net/http"

	"github.com/mayainfo/employee-practice-be/internal/business/domain/employee"
	"github.com/mayainfo/employee-practice-be/internal/business/sdk/tran"
	"github.com/mayainfo/employee-practice-be/internal/framework/logger"
	"github.com/mayainfo/employee-practice-be/internal/framework/web"
)

// Config contains all the mandatory dependencies for this group of handlers.
type Config struct {
	Log      *logger.Logger
	TxM      tran.TxManager
	Employee *employee.Core
}

// Routes adds specific routes for this group.
func Routes(app *web.App, cfg Config) {
	const version = "v1"

	empCtx := employeeCtx(cfg.Employee)

	hdl := newHandlers(cfg.Log, cfg.TxM, cfg.Employee)

	app.HandleFunc(http.MethodGet, version, "/employees", hdl.query)
	app.HandleFunc(http.MethodGet, version, "/employees/{employeeID}", hdl.queryByID, empCtx)
	app.HandleFunc(http.MethodPost, version, "/employees", hdl.create)
	app.HandleFunc(http.MethodPut, version, "/employees/{employeeID}", hdl.update, empCtx)
	app.HandleFunc(http.MethodDelete, version, "/employees/{employeeID}", hdl.delete, empCtx)

	// Ready for testing:
}
