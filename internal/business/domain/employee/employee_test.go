package employee_test

import (
	"context"
	"errors"
	"testing"
	"time"

	"github.com/google/go-cmp/cmp"
	"github.com/mayainfo/employee-practice-be/internal/business/domain/employee"
	"github.com/mayainfo/employee-practice-be/internal/business/domain/employee/stores/employeedb"
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
	employee *employee.Core
}

func newTestSuite(t *testing.T) *testSuite {
	t.Helper()

	log := testhelper.TestLogger(t)
	testDB, _ := testDatabaseInstance.NewDatabase(t, log)

	empCore := employee.NewCore(employeedb.NewStore(testDB))

	return &testSuite{
		employee: empCore,
	}
}

func TestEmployee_Lifecycle(t *testing.T) {
	t.Parallel()

	ctx := context.Background()
	ts := newTestSuite(t)

	want := employee.Employee{
		ID:        1,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}

	// Create a new employee
	{
		nEmp := employee.NewEmployee{}
		got, err := ts.employee.Create(ctx, nEmp)
		if err != nil {
			t.Fatalf("failed to create employee: %v", err)
		}
		checkEmployee(t, got, want)
	}

	var target employee.Employee
	// Read back, should return the saved employee
	{
		got, err := ts.employee.QueryByID(ctx, want.ID)
		if err != nil {
			t.Fatalf("failed to get employee: %v", err)
		}
		checkEmployee(t, got, want)
		target = got
	}

	// Update the employee
	{
		uEmp := employee.UpdateEmployee{}
		want.UpdatedAt = time.Now()

		got, err := ts.employee.Update(ctx, target, uEmp)
		if err != nil {
			t.Fatalf("failed to update employee: %v", err)
		}
		checkEmployee(t, got, want)
	}

	// Read back, should return the updated employee
	{
		got, err := ts.employee.QueryByID(ctx, want.ID)
		if err != nil {
			t.Fatalf("failed to get employee: %v", err)
		}
		checkEmployee(t, got, want)
		target = got
	}

	// Delete the employee
	{
		if err := ts.employee.Delete(ctx, target); err != nil {
			t.Fatalf("failed to delete employee: %v", err)
		}
	}

	// Read back, should return an error
	{
		if _, err := ts.employee.QueryByID(ctx, want.ID); !errors.Is(err, employee.ErrNotFound) {
			t.Fatalf("got err: %v, want: %v", err, employee.ErrNotFound)
		}
	}
}

func checkEmployee(t *testing.T, got, want employee.Employee) {
	t.Helper()

	if diff := cmp.Diff(got, want, sqldb.ApproxTime); diff != "" {
		t.Errorf("mismatch (-got +want):\n%s", diff)
	}
}
