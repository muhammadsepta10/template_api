import { query } from "../../config/baseFunction";

export const checkRegency = (code: string) => {
    return query("SELECT * FROM code_regency WHERE code_regency.code = ?", [code])
}
export const checkDistrict = (code: string) => {
    return query("SELECT * FROM district WHERE code = ?", [code])
}
export const checkProvince = (code: string) => {
    return query("SELECT * FROM code_province WHERE code = ?", [code])
}
export const insertProvince = (code: string, name: string) => {
    return query("INSERT INTO code_province(code,name) SELECT * FROM (SELECT ?,?) tmp WHERE NOT EXISTS (SELECT id FROM code_province WHERE code = ?) LIMIT 1", [code, name, code])
}
export const insertRegency = (code: string, name: string, codeProvince: string) => {
    return query("INSERT INTO code_regency(code,province_code,name) SELECT * FROM (SELECT ?,?,?) tmp WHERE NOT EXISTS (SELECT id FROM code_regency WHERE code = ?) LIMIT 1", [code, codeProvince, name, code])
}
export const insertDistrict = (code: string, name: string, codeRegency: string) => {
    return query("INSERT INTO code_district(code,city_code,name) SELECT * FROM (SELECT ?,?,?) tmp WHERE NOT EXISTS (SELECT id FROM code_district WHERE code = ?) LIMIT 1", [code, codeRegency, name, code])
}
