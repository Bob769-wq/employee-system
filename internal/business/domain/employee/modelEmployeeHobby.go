package employee

type EmployeeHobby struct {
	EmployeeID int
	ID         int
	Name       string
	// codegen:{BD}
}

type UpdateEmployeeHobby struct {
	ID   int
	Name string
	// codegen:{BU}
}
