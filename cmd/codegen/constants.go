package main

const (
	directAppNameKey = 0
	varTypeKey       = 1
	dummyKey         = 2
	dbPrefixKey      = 3
	directJSONName   = 4
	directDBName     = 5
	withCreateKey    = 6
	withUpdateKey    = 7

	sTrue    = "t"
	sFalse   = "f"
	sDefault = ""
)

const (
	noDBPrefix = ""

	typeString    = "string"
	typeInt       = "int"
	typeBool      = "bool"
	typeTime      = "time.Time"
	typePtrString = "*string"
	typePtrInt    = "*int"
	typePtrBool   = "*bool"
	typePtrTime   = "*time.Time"

	typeArrayInt    = "[]int"
	typeArrayString = "[]string"
	typeArrayTime   = "[]time.Time"
	typeArrayBool   = "[]bool"

	typeDBArrayInt    = "dbarray.Int"
	typeDBArrayString = "dbarray.String"
	typeDBArrayTime   = "dbarray.Time"
	typeDBArrayBool   = "dbarray.Bool"
)

var arrayTypes = map[string]string{
	typeArrayInt:    typeDBArrayInt,
	typeArrayString: typeDBArrayString,
	typeArrayTime:   typeDBArrayTime,
	typeArrayBool:   typeDBArrayBool,
}

var httpTypeValues = map[string]string{
	typeString:      `"string"`,
	typeInt:         `0`,
	typeBool:        `false`,
	typeTime:        `"0000-01-01T00:00:00Z"`,
	typePtrString:   `null`,
	typePtrInt:      `null`,
	typePtrBool:     `null`,
	typePtrTime:     `null`,
	typeArrayString: `["string", "string"]`,
	typeArrayInt:    `[0, 0]`,
	typeArrayBool:   `[false, false]`,
	typeArrayTime:   `["0000-01-01T00:00:00Z", "0000-01-01T00:00:00Z"]`,
}

const spacer8 = "        "

const (
	TanStackTemplateVersion = `@tanstack/angular-query-experimental": "^5.79.0"`
)

var acceptableTanStackVersions = []string{
	TanStackTemplateVersion,
}
