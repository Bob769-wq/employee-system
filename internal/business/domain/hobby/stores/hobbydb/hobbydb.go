// Package hobbydb contains hobby related CRUD functionality.
package hobbydb

import (
	"context"
	"errors"
	"fmt"
	"strings"

	"github.com/mayainfo/employee-practice-be/internal/business/domain/hobby"
	"github.com/mayainfo/employee-practice-be/internal/business/sdk/order"
	"github.com/mayainfo/employee-practice-be/internal/business/sdk/paging"
	"github.com/mayainfo/employee-practice-be/internal/business/sdk/sqldb"
	"github.com/mayainfo/employee-practice-be/internal/business/sdk/tran"
)

// Store manages the set of APIs for hobby database access.
type Store struct {
	db *sqldb.DB
}

// NewStore constructs the api for data access.
func NewStore(db *sqldb.DB) *Store {
	return &Store{
		db: db,
	}
}

// NewWithTx constructs a new Store which replaces the underlying database connection with the provided transaction.
func (s *Store) NewWithTx(txM tran.TxManager) (hobby.Storer, error) {
	ec, err := tran.GetExtContext(txM)
	if err != nil {
		return nil, err
	}

	return &Store{
		db: ec,
	}, nil
}

// Count returns the total number of hobbies in the DB.
func (s *Store) Count(ctx context.Context, filter hobby.QueryFilter) (int, error) {
	data := map[string]any{}

	const q = `
        SELECT COUNT(*)
        FROM hobbies
    `

	var sb strings.Builder
	sb.WriteString(q)
	s.applyFilter(filter, data, &sb)

	var dest struct {
		Count int `db:"count"`
	}
	if err := sqldb.NamedQueryStruct(ctx, s.db, sb.String(), data, &dest); err != nil {
		return 0, fmt.Errorf("namedquerystruct: %w", err)
	}

	return dest.Count, nil
}

// Query retrieves a list of existing hobbies from the database.
func (s *Store) Query(ctx context.Context, filter hobby.QueryFilter, orderBy order.By, page paging.Page) ([]hobby.Hobby, error) {
	data := map[string]any{
		"offset":        page.Offset(),
		"rows_per_page": page.RowsPerPage(),
	}

	const q = `
        SELECT  hobby_id,
                hobby_name
        FROM hobbies
    `

	var sb strings.Builder
	sb.WriteString(q)
	s.applyFilter(filter, data, &sb)

	if err := s.orderByClause(orderBy, &sb); err != nil {
		return nil, err
	}

	sb.WriteString(" OFFSET :offset ROWS FETCH NEXT :rows_per_page ROWS ONLY")

	var dbhobs []dbHobby
	if err := sqldb.NamedQuerySlice(ctx, s.db, sb.String(), data, &dbhobs); err != nil {
		return nil, fmt.Errorf("namedqueryslice: %w", err)
	}

	return toCoreHobbies(dbhobs)
}

// QueryByID finds the hobby identified by a given ID.
func (s *Store) QueryByID(ctx context.Context, hobbyID int) (hobby.Hobby, error) {
	data := struct {
		ID int `db:"hobby_id"`
	}{
		ID: hobbyID,
	}

	const q = `
        SELECT hobby_id,
               hobby_name
        FROM hobbies
        WHERE hobby_id = :hobby_id
    `

	var dbhob dbHobby
	if err := sqldb.NamedQueryStruct(ctx, s.db, q, data, &dbhob); err != nil {
		if errors.Is(err, sqldb.ErrDBNotFound) {
			return hobby.Hobby{}, hobby.ErrNotFound
		}
		return hobby.Hobby{}, fmt.Errorf("namedquerystruct: %w", err)
	}

	return toCoreHobby(dbhob)
}

// Create adds a Hobby to the database. It returns an error if something went wrong
func (s *Store) Create(ctx context.Context, hob hobby.Hobby) (hobby.Hobby, error) {
	dbhob := toDBHobby(hob)

	const q = `
        INSERT INTO hobbies
        (   
            hobby_name
        )
        VALUES
        (   
            :hobby_name
        )
        RETURNING hobby_id
    `

	if err := sqldb.NamedQueryStruct(ctx, s.db, q, dbhob, &dbhob); err != nil {
		if errors.Is(err, sqldb.ErrDBIntegrity) || errors.Is(err, sqldb.ErrDBDuplicatedEntry) {
			return hobby.Hobby{}, hobby.ErrDataConflict
		}
		return hobby.Hobby{}, fmt.Errorf("namedexeccontext: %w", err)
	}

	return toCoreHobby(dbhob)
}

// Update modifies data about a Hobby. It will error if the specified ID is
// invalid or does not reference an existing Hobby.
func (s *Store) Update(ctx context.Context, hob hobby.Hobby) (hobby.Hobby, error) {
	dbhob := toDBHobby(hob)

	const q = `
        UPDATE hobbies
        SET
            hobby_name = :hobby_name
        WHERE hobby_id = :hobby_id
        RETURNING hobby_id
    `

	if err := sqldb.NamedQueryStruct(ctx, s.db, q, dbhob, &dbhob); err != nil {
		if errors.Is(err, sqldb.ErrDBIntegrity) || errors.Is(err, sqldb.ErrDBDuplicatedEntry) {
			return hobby.Hobby{}, hobby.ErrDataConflict
		}
		return hobby.Hobby{}, fmt.Errorf("namedquerystruct: %w", err)
	}

	return toCoreHobby(dbhob)
}

// Delete removes the Hobby identified by a given ID.
func (s *Store) Delete(ctx context.Context, hob hobby.Hobby) error {
	data := struct {
		ID int `db:"hobby_id"`
	}{
		ID: hob.ID,
	}

	const q = `
        DELETE
        FROM hobbies
        WHERE hobby_id = :hobby_id
    `

	if err := sqldb.NamedExecContext(ctx, s.db, q, data); err != nil {
		if errors.Is(err, sqldb.ErrDBIntegrity) || errors.Is(err, sqldb.ErrDBDuplicatedEntry) {
			return hobby.ErrDataConflict
		}
		return fmt.Errorf("namedexeccontext: %w", err)
	}

	return nil
}
