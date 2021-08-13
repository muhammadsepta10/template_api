import { connection } from '../../config/db';
const util = require("util");
const query = util.promisify(connection.query).bind(connection);

export const list = () => {
    return query("SELECT * FROM periode")
}

export const insertPeriode = (periode: number, startValue: string, endValue: string) => {
    return query("INSERT INTO periode(periode,startDate,endDate) VALUES(?,?,?)", [periode, startValue, endValue])
}

export const editPeriode = (periode: number, startValue: string, endValue: string, id: number) => {
    return query("UPDATE periode SET periode = ?, startDate = ?, endDate = ?, WHERE id= ?", [periode, startValue, endValue, id])
}