package hobbyapi

import (
	"net/http"

	"github.com/mayainfo/employee-practice-be/internal/business/domain/hobby"
	"github.com/mayainfo/employee-practice-be/internal/business/sdk/tran"
	"github.com/mayainfo/employee-practice-be/internal/framework/logger"
	"github.com/mayainfo/employee-practice-be/internal/framework/web"
)

// Config contains all the mandatory dependencies for this group of handlers.
type Config struct {
	Log   *logger.Logger
	TxM   tran.TxManager
	Hobby *hobby.Core
}

// Routes adds specific routes for this group.
func Routes(app *web.App, cfg Config) {
	const version = "v1"

	hobCtx := hobbyCtx(cfg.Hobby)

	hdl := newHandlers(cfg.Log, cfg.TxM, cfg.Hobby)

	// Testing only, may remove after completion:
	app.HandleFunc(http.MethodPost, version, "/hobbies", hdl.create)
	app.HandleFunc(http.MethodPut, version, "/hobbies/{hobbyID}", hdl.update, hobCtx)
	app.HandleFunc(http.MethodDelete, version, "/hobbies/{hobbyID}", hdl.delete, hobCtx)
	app.HandleFunc(http.MethodGet, version, "/hobbies/{hobbyID}", hdl.queryByID, hobCtx)

	// Ready for testing:
	app.HandleFunc(http.MethodGet, version, "/hobbies", hdl.query)
}
