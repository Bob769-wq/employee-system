package hobbyapi

import (
	"github.com/mayainfo/employee-practice-be/internal/business/domain/hobby"
	"github.com/mayainfo/employee-practice-be/internal/framework/validate"
)

// AppHobby represents an individual hobby.
type AppHobby struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
	// codegen:{AD}
}

func toAppHobby(hob hobby.Hobby) AppHobby {
	return AppHobby{
		ID:   hob.ID,
		Name: hob.Name,
		// codegen:{tAD}
	}
}

func toAppHobbies(hobs []hobby.Hobby) []AppHobby {
	items := make([]AppHobby, len(hobs))
	for i, hob := range hobs {
		items[i] = toAppHobby(hob)
	}

	return items
}

// =============================================================================

type AppNewHobby struct {
	Name string `json:"name"`
	// codegen:{AN}
}

func (app AppNewHobby) Validate() error {
	if err := validate.Check(app); err != nil {
		return err
	}

	return nil
}

func toCoreNewHobby(app AppNewHobby) (hobby.NewHobby, error) {
	// codegen:{tManyBN}
	nHob := hobby.NewHobby{
		Name: app.Name,
		// codegen:{tBN}
	}

	return nHob, nil
}

// =============================================================================

type AppUpdateHobby struct {
	Name string `json:"name"`
	// codegen:{AU}
}

func (app AppUpdateHobby) Validate() error {
	if err := validate.Check(app); err != nil {
		return err
	}

	return nil
}

func toCoreUpdateHobby(app AppUpdateHobby) (hobby.UpdateHobby, error) {
	// codegen:{tManyBU}
	uHob := hobby.UpdateHobby{
		Name: app.Name,
		// codegen:{tBU}
	}

	return uHob, nil
}
