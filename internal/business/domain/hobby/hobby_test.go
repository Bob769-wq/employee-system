package hobby_test

import (
	"context"
	"errors"
	"testing"

	"github.com/google/go-cmp/cmp"
	"github.com/mayainfo/employee-practice-be/internal/business/domain/hobby"
	"github.com/mayainfo/employee-practice-be/internal/business/domain/hobby/stores/hobbydb"
	"github.com/mayainfo/employee-practice-be/internal/business/sdk/sqldb"
	"github.com/mayainfo/employee-practice-be/internal/business/sdk/testhelper"
)

var testDatabaseInstance *sqldb.TestInstance

func TestMain(m *testing.M) {
	testDatabaseInstance = sqldb.MustTestInstance()
	defer testDatabaseInstance.MustClose()
	m.Run()
}

type testSuite struct {
	hobby *hobby.Core
}

func newTestSuite(t *testing.T) *testSuite {
	t.Helper()

	log := testhelper.TestLogger(t)
	testDB, _ := testDatabaseInstance.NewDatabase(t, log)

	hobCore := hobby.NewCore(hobbydb.NewStore(testDB))

	return &testSuite{
		hobby: hobCore,
	}
}

func TestHobby_Lifecycle(t *testing.T) {
	t.Parallel()

	ctx := context.Background()
	ts := newTestSuite(t)

	want := hobby.Hobby{
		ID: 1,
	}

	// Create a new hobby
	{
		nHob := hobby.NewHobby{}
		got, err := ts.hobby.Create(ctx, nHob)
		if err != nil {
			t.Fatalf("failed to create hobby: %v", err)
		}
		checkHobby(t, got, want)
	}

	var target hobby.Hobby
	// Read back, should return the saved hobby
	{
		got, err := ts.hobby.QueryByID(ctx, want.ID)
		if err != nil {
			t.Fatalf("failed to get hobby: %v", err)
		}
		checkHobby(t, got, want)
		target = got
	}

	// Update the hobby
	{
		uHob := hobby.UpdateHobby{}

		got, err := ts.hobby.Update(ctx, target, uHob)
		if err != nil {
			t.Fatalf("failed to update hobby: %v", err)
		}
		checkHobby(t, got, want)
	}

	// Read back, should return the updated hobby
	{
		got, err := ts.hobby.QueryByID(ctx, want.ID)
		if err != nil {
			t.Fatalf("failed to get hobby: %v", err)
		}
		checkHobby(t, got, want)
		target = got
	}

	// Delete the hobby
	{
		if err := ts.hobby.Delete(ctx, target); err != nil {
			t.Fatalf("failed to delete hobby: %v", err)
		}
	}

	// Read back, should return an error
	{
		if _, err := ts.hobby.QueryByID(ctx, want.ID); !errors.Is(err, hobby.ErrNotFound) {
			t.Fatalf("got err: %v, want: %v", err, hobby.ErrNotFound)
		}
	}
}

func checkHobby(t *testing.T, got, want hobby.Hobby) {
	t.Helper()

	if diff := cmp.Diff(got, want, sqldb.ApproxTime); diff != "" {
		t.Errorf("mismatch (-got +want):\n%s", diff)
	}
}
