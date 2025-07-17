package hobbydb

import (
	"fmt"

	"github.com/mayainfo/employee-practice-be/internal/business/domain/hobby"
)

// dbHobby represents an individual hobby.
type dbHobby struct {
	ID   int    `db:"hobby_id"`
	Name string `db:"hobby_name"`
	// codegen:{SD}
}

func toDBHobby(hob hobby.Hobby) dbHobby {
	dbHob := dbHobby{
		ID:   hob.ID,
		Name: hob.Name,
		// codegen:{tSD}
	}

	return dbHob
}

func toCoreHobby(dbHob dbHobby) (hobby.Hobby, error) {
	hob := hobby.Hobby{
		ID:   dbHob.ID,
		Name: dbHob.Name,
		// codegen:{tBD}
	}

	return hob, nil
}

func toCoreHobbies(dbHobbies []dbHobby) ([]hobby.Hobby, error) {
	hobs := make([]hobby.Hobby, len(dbHobbies))
	for i, dbHob := range dbHobbies {
		hob, err := toCoreHobby(dbHob)
		if err != nil {
			return nil, fmt.Errorf("parse type: %w", err)
		}
		hobs[i] = hob
	}

	return hobs, nil
}
