package main

import (
	"slices"
)

var requiredTypes = []string{
	typeString,
	typeInt,
	typeTime,
	typeBool,
	typeArrayString,
	typeArrayInt,
	typeArrayTime,
	typeArrayBool,
}

func yamlDisplayRequiredz(data [][]string) []string {
	results := make([]string, 0, len(data))
	for _, v := range data {
		if slices.Contains(requiredTypes, v[varTypeKey]) {
			results = append(results, v[directJSONName])
		}
	}
	return results
}

func yamlDisplayPropertiesz(data [][]string) []string {
	results := make([]string, 0, len(data))
	for _, v := range data {
		result := v[directJSONName] + ":\n  " + basicPropertyParser(v[varTypeKey])
		results = append(results, result)
	}
	return results
}

func yamlCreateRequiredz(data [][]string) []string {
	results := make([]string, 0, len(data))
	for _, v := range data {
		if slices.Contains(requiredTypes, v[varTypeKey]) {
			results = append(results, v[directJSONName])
		}
	}
	return results
}

func yamlCreatePropertiesz(data [][]string) []string {
	results := make([]string, 0, len(data))
	for _, v := range data {
		result := v[directJSONName] + ":\n  " + basicPropertyParser(v[varTypeKey])
		results = append(results, result)
	}
	return results
}

func yamlUpdateRequiredz(data [][]string) []string {
	results := make([]string, 0, len(data))
	for _, v := range data {
		if slices.Contains(requiredTypes, v[varTypeKey]) {
			results = append(results, v[directJSONName])
		}
	}
	return results
}

func yamlUpdatePropertiesz(data [][]string) []string {
	results := make([]string, 0, len(data))
	for _, v := range data {
		result := v[directJSONName] + ":\n  " + basicPropertyParser(v[varTypeKey])
		results = append(results, result)
	}
	return results
}

func basicPropertyParser(typ string) string {
	switch typ {
	case typeString:
		return spacer8 + "type: string"
	case typeInt:
		return spacer8 + "type: integer"
	case typeBool:
		return spacer8 + "type: boolean"
	case typeTime:
		return spacer8 + "type: string\n" + spacer8 + "  format: date-time"
	case typePtrString:
		return spacer8 + "type: string\n" + spacer8 + "  nullable: true"
	case typePtrInt:
		return spacer8 + "type: integer\n" + spacer8 + "  nullable: true"
	case typePtrBool:
		return spacer8 + "type: boolean\n" + spacer8 + "  nullable: true"
	case typePtrTime:
		return spacer8 + "type: string\n" + spacer8 + "  format: date-time\n" + spacer8 + "  nullable: true"
	case typeArrayString:
		return spacer8 + "type: array\n" + spacer8 + "  items:\n" + spacer8 + "    type: string"
	case typeArrayInt:
		return spacer8 + "type: array\n" + spacer8 + "  items:\n" + spacer8 + "    type: integer"
	case typeArrayBool:
		return spacer8 + "type: array\n" + spacer8 + "  items:\n" + spacer8 + "    type: boolean"
	case typeArrayTime:
		return spacer8 + "type: array\n" + spacer8 + "  items:\n" + spacer8 + "    type: string\n" + spacer8 + "    format: date-time"
	default:
		return spacer8
	}
}
