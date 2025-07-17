package employee

import "time"

type Employee struct {
	ID              int
	FirstName       string
	LastName        string
	NationalID      string
	Email           string
	Cellphone       string
	TownID          int
	TownName        string
	PostCode        string
	CityID          int
	CityName        string
	CreatedAt       time.Time
	UpdatedAt       time.Time
	AddressDetail   string
	EmployeeHobbies []EmployeeHobby
	// codegen:{BD}
}

type NewEmployee struct {
	FirstName       string
	LastName        string
	NationalID      string
	Email           string
	Cellphone       string
	TownID          int
	AddressDetail   string
	EmployeeHobbies []UpdateEmployeeHobby
	// codegen:{BN}
}

type UpdateEmployee struct {
	FirstName       string
	LastName        string
	NationalID      string
	Email           string
	Cellphone       string
	TownID          int
	AddressDetail   string
	EmployeeHobbies []UpdateEmployeeHobby
	// codegen:{BU}
}
