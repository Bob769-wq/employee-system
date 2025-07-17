package hobby

type Hobby struct {
	ID   int
	Name string
	// codegen:{BD}
}

type NewHobby struct {
	Name string
	// codegen:{BN}
}

type UpdateHobby struct {
	Name string
	// codegen:{BU}
}
