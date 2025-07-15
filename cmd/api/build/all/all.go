package all

import (
	"github.com/mayainfo/employee-practice-be/internal/app/domain/authapi"
	"github.com/mayainfo/employee-practice-be/internal/app/domain/employeeapi"
	"github.com/mayainfo/employee-practice-be/internal/app/domain/fileapi"
	"github.com/mayainfo/employee-practice-be/internal/app/domain/healthapi"
	"github.com/mayainfo/employee-practice-be/internal/app/domain/townapi"
	"github.com/mayainfo/employee-practice-be/internal/app/sdk/mux"
	"github.com/mayainfo/employee-practice-be/internal/business/domain/auth"
	"github.com/mayainfo/employee-practice-be/internal/business/domain/auth/stores/authdb"
	"github.com/mayainfo/employee-practice-be/internal/business/domain/employee"
	"github.com/mayainfo/employee-practice-be/internal/business/domain/employee/stores/employeedb"
	"github.com/mayainfo/employee-practice-be/internal/business/domain/file"
	"github.com/mayainfo/employee-practice-be/internal/business/domain/file/stores/filedb"
	"github.com/mayainfo/employee-practice-be/internal/business/domain/notification"
	"github.com/mayainfo/employee-practice-be/internal/business/domain/town"
	"github.com/mayainfo/employee-practice-be/internal/business/domain/town/stores/towndb"
	"github.com/mayainfo/employee-practice-be/internal/framework/web"
)

func Routes() add { // nolint: revive
	return add{}
}

type add struct{}

func (add) Add(app *web.App, cfg mux.Config) {
	fileCore := file.NewCore(filedb.NewStore(cfg.DB))
	authCore := auth.NewCore(authdb.NewStore(cfg.DB), cfg.JWTKey)
	notifyCore := notification.NewCore(cfg.Mailer, cfg.FrontendOrigin)
	townCore := town.NewCore(towndb.NewStore(cfg.DB))
	employeeCore := employee.NewCore(employeedb.NewStore(cfg.DB))
	healthapi.Routes(app, healthapi.Config{
		Log: cfg.Log,
		DB:  cfg.DB,
	})
	fileapi.Routes(app, fileapi.Config{
		Log:     cfg.Log,
		TxM:     cfg.TxM,
		Storage: cfg.Storage,
		File:    fileCore,
		Sess:    cfg.Sess,
		Auth:    authCore,
	})

	authapi.Routes(app, authapi.Config{
		Log:          cfg.Log,
		TxM:          cfg.TxM,
		Sess:         cfg.Sess,
		Auth:         authCore,
		Notification: notifyCore,
	})

	townapi.Routes(app, townapi.Config{
		Log:  cfg.Log,
		TxM:  cfg.TxM,
		Town: townCore,
	})
	employeeapi.Routes(app, employeeapi.Config{
		Log:      cfg.Log,
		TxM:      cfg.TxM,
		Employee: employeeCore,
	})
}
