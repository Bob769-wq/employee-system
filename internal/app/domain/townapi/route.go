package townapi

import (
	"net/http"

	"github.com/mayainfo/employee-practice-be/internal/business/domain/town"
	"github.com/mayainfo/employee-practice-be/internal/business/sdk/tran"
	"github.com/mayainfo/employee-practice-be/internal/framework/logger"
	"github.com/mayainfo/employee-practice-be/internal/framework/web"
)

// Config contains all the mandatory dependencies for this group of handlers.
type Config struct {
	Log  *logger.Logger
	TxM  tran.TxManager
	Town *town.Core
}

func Routes(app *web.App, cfg Config) {
	const version = "v1"

	hdl := newHandlers(cfg.Log, cfg.TxM, cfg.Town)

	app.HandleFunc(http.MethodGet, version, "/cities", hdl.queryCities)
	app.HandleFunc(http.MethodGet, version, "/cities/{cityID}/towns", hdl.queryByCityID)
}
