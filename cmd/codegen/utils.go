package main

import (
	"strings"
	"unicode"
)

var CurrentTanStackVersion = `@tanstack/angular-query-experimental": "^5.79.0"`

const (
	dbPrefix    = "hobby"
	dbTableName = "hobbies"
	dbViewName  = ""
	defaultPath = "hobbies"
)

const (
	chineseName = "興趣"
)

func rawFieldData() [][]string {
	// directAppName, varType, dummyKey, dbPrefix, directJSONName, directDBName, withCreate(default yes), withUpdate(default follow withCreate)
	// sFalse可以控制create, update時是否包含這個欄位
	// 例如：{"Name", typeString, "", dbPrefix, "", "", sFalse, sFalse},
	data := [][]string{
		{"Name", typeString, "", dbPrefix, "", "", "", ""},
	}

	// codegen:{regenerate-data}

	return data
}

func projectFieldsz() [][]string {
	// directAppName, varType, dummyKey, dbPrefix, directJSONName, directDBName
	data := rawFieldData()

	for i := range data {
		if data[i][directJSONName] == "" {
			data[i][directJSONName] = camelStyle(data[i][directAppNameKey])
		}
		if data[i][directDBName] == "" {
			if data[i][dbPrefixKey] == "" {
				data[i][directDBName] = psqlStyle(data[i][directAppNameKey])
			} else {
				data[i][directDBName] = data[i][dbPrefixKey] + "_" + psqlStyle(data[i][directAppNameKey])
			}
		}
	}

	return data
}

func getDBViewName() string {
	if dbViewName != "" {
		return dbViewName
	} else {
		return dbTableName
	}
}

func patchUpdateTypeFields(data [][]string) [][]string {
	for _, v := range data {
		v[varTypeKey] = "*" + v[varTypeKey]
	}
	return data
}

func putUpdateTypeFields(data [][]string) [][]string {
	result := make([][]string, 0, len(data))
	for i := range data {
		// 如果沒有指定，那就follow withCreateKey
		if data[i][withUpdateKey] == sDefault {
			if data[i][withCreateKey] == sFalse {
				// 如果withCreateKey是sFalse，那就不需要這筆資料
				continue
			}
		} else {
			// 如果有指定，那就follow withUpdateKey
			if data[i][withUpdateKey] == sFalse {
				// 如果withUpdateKey是sFalse，那就不需要這筆資料
				continue
			}
		}
		result = append(result, data[i])
	}
	return result
}

func createTypeFields(data [][]string) [][]string {
	result := make([][]string, 0, len(data))
	for i := range data {
		if data[i][withCreateKey] == sFalse {
			// 如果withCreateKey是sFalse，那就不需要這筆資料
			continue
		}
		result = append(result, data[i])
	}
	return result
}

func coreFieldsz(data [][]string) []string {
	result := make([]string, 0)
	for _, v := range data {
		str := v[0:2]
		result = append(result, strings.Join(str, "  "))
	}

	return result
}

func dbFieldsz(data [][]string, otm bool) []string {
	result := make([]string, 0, len(data))
	for _, v := range data {
		dbResult := strings.ToLower(v[directAppNameKey])

		if v[dbPrefixKey] != "" {
			dbResult = v[dbPrefixKey] + "_" + dbResult
		}

		if v[directDBName] != "" {
			dbResult = v[directDBName]
		}
		if otm {
			dbResult = `db:"` + dbResult + `"` + ` json:"` + dbResult + `"`
		} else {
			dbResult = `db:"` + dbResult + `"`
		}
		dbResult = "`" + dbResult + "`"
		var dbType string
		if _, ok := arrayTypes[v[varTypeKey]]; ok {
			dbType = arrayTypes[v[varTypeKey]]
		} else {
			dbType = v[varTypeKey]
		}
		resul := make([]string, 3)
		resul[0] = v[directAppNameKey]
		resul[1] = dbType
		resul[2] = dbResult
		result = append(result, strings.Join(resul, "  "))
	}
	return result
}

func sqlQueryFieldsz(data [][]string) []string {
	result := make([]string, 0, len(data))
	for _, v := range data {
		dbResult := strings.ToLower(v[directAppNameKey])

		if v[dbPrefixKey] != "" {
			dbResult = v[dbPrefixKey] + "_" + dbResult
		}

		if v[directDBName] != "" {
			dbResult = v[directDBName]
		}
		dbResult = dbResult + `,`
		result = append(result, dbResult)
	}
	// remove last comma
	if len(result) > 0 {
		result[len(result)-1] = result[len(result)-1][0 : len(result[len(result)-1])-1]
	}
	return result
}

func sqlUpdateFieldsz(data [][]string) []string {
	result := make([]string, 0, len(data))
	var maxLen int // 為了排版美觀用途，取出最長字串來對齊
	for _, v := range data {
		lenText := strings.ToLower(v[directAppNameKey])
		if v[dbPrefixKey] != "" {
			lenText = v[dbPrefixKey] + "_" + lenText
		}
		if v[directDBName] != "" {
			lenText = v[directDBName]
		}
		if len(lenText) > maxLen {
			maxLen = len(lenText)
		}
	}

	for _, v := range data {
		dbResult := strings.ToLower(v[directAppNameKey])

		if v[dbPrefixKey] != "" {
			dbResult = v[dbPrefixKey] + "_" + dbResult
		}

		if v[directDBName] != "" {
			dbResult = v[directDBName]
		}
		dbResult = dbResult + strings.Repeat(" ", maxLen-len(dbResult)) + ` = :` + dbResult + `,`
		result = append(result, dbResult)
	}
	// remove last comma
	if len(result) > 0 {
		result[len(result)-1] = result[len(result)-1][0 : len(result[len(result)-1])-1]
	}
	return result
}

func jsonFieldsz(data [][]string) []string {
	result := make([]string, 0, len(data))
	for _, v := range data {
		jsonResult := strings.ToLower(v[directAppNameKey][0:1]) + v[directAppNameKey][1:]
		if jsonResult[len(jsonResult)-2:] == "ID" {
			jsonResult = jsonResult[0:len(jsonResult)-2] + "Id"
		}
		if v[directJSONName] != "" {
			jsonResult = v[directJSONName]
		}
		jsonResult = `json:"` + jsonResult + `"`
		jsonResult = "`" + jsonResult + "`"
		resul := make([]string, 3)
		resul[0] = v[directAppNameKey]
		resul[1] = v[varTypeKey]
		resul[2] = jsonResult
		result = append(result, strings.Join(resul, "  "))
	}
	return result
}

func httpFieldsz(data [][]string) []string {
	result := make([]string, 0, len(data))
	for i, v := range data {
		jsonResult := strings.ToLower(v[directAppNameKey][0:1]) + v[directAppNameKey][1:]
		if jsonResult[len(jsonResult)-2:] == "ID" {
			jsonResult = jsonResult[0:len(jsonResult)-2] + "Id"
		}
		if v[directJSONName] != "" {
			jsonResult = v[directJSONName]
		}
		jsonResult = `"` + jsonResult + `":`
		resul := make([]string, 2)
		// resul[0] = v[directAppNameKey]
		// resul[1] = v[varTypeKey]
		resul[0] = jsonResult
		if i != len(data) {
			resul[1] = httpTypeValues[v[varTypeKey]] + `,`
		} else {
			// 最後一個元素不需要逗號
			resul[1] = httpTypeValues[v[varTypeKey]]
		}
		result = append(result, strings.Join(resul, " "))
	}
	return result
}

func toStructFields(data [][]string, abbr string) []string {
	result := make([]string, 0, len(data))
	for _, v := range data {
		tempString := v[directAppNameKey] + ":" + " " + abbr + "." + v[directAppNameKey] + ","
		result = append(result, tempString)
	}
	return result
}

func toAppStructFieldsz(data [][]string, abbr string) []string {
	return toStructFields(data, abbr)
}

func toCoreNewStructFieldsz(data [][]string) []string {
	return toStructFields(data, "app")
}

func toCoreUpdateStructFieldsz(data [][]string) []string {
	return toStructFields(data, "app")
}

func toDBStructFieldsz(data [][]string, abbr string) []string {
	return toStructFields(data, abbr)
}

func toCoreStructFieldsz(data [][]string, abbr string) []string {
	abbr = "db" + strings.ToUpper(abbr[0:1]) + abbr[1:]
	return toStructFields(data, abbr)
}

func coreCreateFunctionz(data [][]string, abbr string) []string {
	abbr = "n" + strings.ToUpper(abbr[0:1]) + abbr[1:]
	return toStructFields(data, abbr)
}

func corePatchUpdateFunctionz(data [][]string, abbr string) []string {
	return toPatchUpdateIfNotNilFields(data, abbr)
}

func toPatchUpdateIfNotNilFields(data [][]string, abbr string) []string {
	result := make([]string, 0, len(data))
	abbrU := strings.ToUpper(abbr[0:1]) + abbr[1:]
	for _, v := range data {
		tempString := "if u" + abbrU + "." + v[directAppNameKey] + "!=nil{ " + abbr + "." + v[directAppNameKey] + "= *u" + abbrU + "." + v[directAppNameKey] + "}"
		result = append(result, tempString)
	}
	return result
}

func corePutUpdateFunctionz(data [][]string, abbr string) []string {
	return toPutUpdateIfNotNilFields(data, abbr)
}

func toPutUpdateIfNotNilFields(data [][]string, abbr string) []string {
	result := make([]string, 0, len(data))
	abbrU := strings.ToUpper(abbr[0:1]) + abbr[1:]
	for _, v := range data {
		tempString := abbr + "." + v[directAppNameKey] + "= u" + abbrU + "." + v[directAppNameKey]
		result = append(result, tempString)
	}
	return result
}

func camelStyle(str string) string {
	if len(str) == 0 {
		return str
	}
	if len(str) > 2 && str[len(str)-2:] == "ID" {
		// 如果是以ID結尾的，且不只有ID兩個字，則轉換為小寫開頭的Id
		str = str[:1] + str[1:len(str)-2] + "Id"
	}

	// 從大寫開頭的CamelCase轉小寫開頭的CamelCase
	return strings.ToLower(str[:1]) + str[1:]
}

func psqlStyle(str string) string {
	if len(str) == 0 {
		return str
	}

	var builder strings.Builder

	for i, r := range str {
		if i > 0 && unicode.IsUpper(r) {
			prev := rune(str[i-1])

			// 加底線的條件：
			// - 前一個是小寫（像：helloWorld → hello_world）
			// - 前一個是大寫，但下一個是小寫（像：IDCard → id_card）
			if unicode.IsLower(prev) || (i+1 < len(str) && unicode.IsLower(rune(str[i+1]))) {
				builder.WriteByte('_')
			}
		}
		builder.WriteRune(r)
	}

	return strings.ToLower(builder.String())
}
