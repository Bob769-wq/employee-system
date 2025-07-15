package fileapi

import (
	"net/http"

	"github.com/mayainfo/employee-practice-be/internal/app/sdk/mid"
	"github.com/mayainfo/employee-practice-be/internal/business/domain/auth"
	"github.com/mayainfo/employee-practice-be/internal/business/domain/file"
	"github.com/mayainfo/employee-practice-be/internal/business/sdk/blobstore"
	"github.com/mayainfo/employee-practice-be/internal/business/sdk/sess"
	"github.com/mayainfo/employee-practice-be/internal/business/sdk/tran"
	"github.com/mayainfo/employee-practice-be/internal/framework/logger"
	"github.com/mayainfo/employee-practice-be/internal/framework/web"
)

type Config struct {
	Log     *logger.Logger
	TxM     tran.TxManager
	Storage blobstore.BlobStore
	File    *file.Core
	Sess    *sess.Manager
	Auth    *auth.Core
}

func Routes(app *web.App, cfg Config) {
	const version = "v1"

	authn := mid.AuthN(cfg.Sess, cfg.Auth)
	hdl := newHandlers(cfg.Log, cfg.TxM, cfg.Storage, cfg.File, cfg.Sess, cfg.Auth)
	authApp := *app
	authApp.PostMid = []web.MidFunc{
		authn,
	}

	app.HandleFunc(http.MethodPost, version, "/files", hdl.create)
	// This is a special route that is used to redirect the user to the correct URL for the file.
	// By using redirect, we can hide the implementation details of the signed URL to the user and
	// let the browser handle the redirection.
	// We can also add some additional security checks here if needed.
	app.HandleFunc(http.MethodGet, "_uploads", "/{path...}", hdl.redirect)
}
