package employeeapi

import (
	"github.com/mayainfo/employee-practice-be/internal/business/domain/employee"
	"github.com/mayainfo/employee-practice-be/internal/framework/validate"
)

type AppEmployeeHobby struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
	// codegen:{AD}
}

func toAppEmployeeHobby(ehobby employee.EmployeeHobby) AppEmployeeHobby {
	return AppEmployeeHobby{
		ID:   ehobby.ID,
		Name: ehobby.Name,
		// codegen:{tAD}
	}
}

func toAppEmployeeHobbies(ehobbys []employee.EmployeeHobby) []AppEmployeeHobby {
	items := make([]AppEmployeeHobby, len(ehobbys))
	for i, ehobby := range ehobbys {
		items[i] = toAppEmployeeHobby(ehobby)
	}

	return items
}

// =============================================================================

type AppUpdateEmployeeHobby struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
	// codegen:{AU}
}

func (app AppUpdateEmployeeHobby) Validate() error {
	if err := validate.Check(app); err != nil {
		return err
	}

	return nil
}

func toCoreUpdateEmployeeHobby(app AppUpdateEmployeeHobby) (employee.UpdateEmployeeHobby, error) {
	// codegen:{tManyBU}
	uEhobby := employee.UpdateEmployeeHobby{
		ID:   app.ID,
		Name: app.Name,
		// codegen:{tBU}
	}

	return uEhobby, nil
}

func toCoreUpdateEmployeeHobbies(apps []AppUpdateEmployeeHobby) ([]employee.UpdateEmployeeHobby, error) {
	items := make([]employee.UpdateEmployeeHobby, len(apps))
	for i, app := range apps {
		item, err := toCoreUpdateEmployeeHobby(app)
		if err != nil {
			return nil, err
		}
		items[i] = item
	}

	return items, nil
}
