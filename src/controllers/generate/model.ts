import { param } from "express-validator";
import moment from "moment";
import { query } from "../../config/baseFunction";

interface Type {
    condition: number;
    type: number;
    subtract: number
    date: string
    media: number[];
}

interface summaryEntries {
    validMicrosite: number,
    invalidMicrosite: number,
    validWa1: number,
    invalidWa1: number,
    validWa2: number,
    invalidWa2: number,
    validWa3: number,
    invalidWa3: number,
    valid: number,
    invalid: number,
    total: number,
    label: string,
    table: string

}

export const countEntries = () => {
    return query("SELECT media,IFNULL(COUNT(1),0) counts FROM entries WHERE media = ? AND DATE(rcvd_time) = DATE_SUB(CURDATE(),INTERVAL 1 DAY) GROUP BY media", [])
}

const groupBy = (condition: number, column: any) => {
    switch (true) {
        case condition == 1:
            return column !== ""
                ? `GROUP BY DATE(${column}.rcvd_time)`
                : `GROUP BY DATE(rcvd_time)`;
            break;

        case condition == 2:
            return column !== ""
                ? `GROUP BY DATE_FORMAT(${column}.rcvd_time,"%Y-%U")`
                : `GROUP BY DATE_FORMAT(rcvd_time,"%Y-%U")`;
            break;
        case condition == 3:
            return column !== ""
                ? `GROUP BY DATE_FORMAT(${column}.rcvd_time,"%Y-%m")`
                : `GROUP BY DATE_FORMAT(rcvd_time,"%Y-%m")`;
            break;
        case condition == 4:
            return column !== ""
                ? `GROUP BY DATE_FORMAT(${column}.rcvd_time,"%Y-%m-%d %H:00:00")`
                : `GROUP BY DATE_FORMAT(rcvd_time,"%Y-%m-%d %H:00:00")`;
            break;
    }
}

const whereCondition = (
    date: string,
    table: string
) => {
    return ` AND DATE(${table}.rcvd_time) = '${date}'`
}

export const countProfile = () => {
    return query(`
    SELECT 
		entries.media,
		IFNULL(COUNT(DISTINCT profile_id),0) counts
    FROM profiles,
         entries
    WHERE profiles.id = entries.profile_id
      AND DATE(profiles.rcvd_time) = DATE_SUB(CURDATE(),INTERVAL 1 DAY) GROUP BY entries.media`, [])
}

export const getMediaActive = () => {
    return query("SELECT code,name FROM media WHERE is_active = 1", [])
}

export const updateSummarytotal = (name: string, type: string, media: string, counting: number) => {
    return query("UPDATE summary_total SET counting=counting+? WHERE name = ? AND type = ? AND media = ?", [counting, name, type, media])
}

export const demographic = () => {
    return query(`SELECT
	media,
    SUM(CASE WHEN gender = 'M' || gender = 'L' THEN 1 ELSE 0 END ) AS male,
    SUM(CASE WHEN gender = 'F' || gender = 'P' THEN 1 ELSE 0 END ) AS female,
    SUM(CASE WHEN gender = '' OR gender IS NULL THEN 1 ELSE 0 END ) AS nonKTPGender,
    SUM(CASE WHEN age > 0 AND age < 17 THEN 1 ELSE 0 END ) AS 'umur17',
    SUM(CASE WHEN age > 16 AND age < 26 THEN 1 ELSE 0 END ) AS 'umur17_25',
     SUM(CASE WHEN age > 25 AND age < 36 THEN 1 ELSE 0 END ) AS 'umur26_35',
     SUM(CASE WHEN age > 35 AND age < 46 THEN 1 ELSE 0 END ) AS 'umur36_45',
     SUM(CASE WHEN age > 45 AND age < 56 THEN 1 ELSE 0 END ) AS 'umur46_55',
     SUM(CASE WHEN age > 55 THEN 1 ELSE 0 END ) AS 'umur55',
     SUM(CASE WHEN age = 0 OR age IS NULL THEN 1 ELSE 0 END ) AS 'nonKTPAge'
  FROM ( SELECT profiles.age AS age,profiles.gender AS gender,entries.media FROM profiles JOIN entries ON(profiles.id = entries.profile_id) WHERE entries.is_deleted = 0 AND date(profiles.rcvd_time) = DATE_SUB(CURDATE(), INTERVAL 1 DAY) GROUP BY profiles.id) AS profileEntries GROUP BY media`, [])
}

export const entriesSummary = (params: Type) => {
    const validInvalidQuery = params.media.map(value => {
        return `
        SUM(CASE WHEN is_valid = 1 AND entries.media = "${value}" THEN 1 ELSE 0 END) AS valid_${value},
        SUM(CASE WHEN is_valid = 0 AND entries.media = "${value}" THEN 1 ELSE 0 END) AS invalid_${value},
        SUM(CASE WHEN entries.id AND media = "${value}" THEN 1 ELSE 0 END ) AS "all_${value}"`
    })
    const entriesSummaryQuery = `SELECT
    ${time(params.condition, "")}
    SUM(CASE WHEN is_valid = 1 THEN 1 ELSE 0 END ) AS valid,
    SUM(CASE WHEN is_valid = 0 THEN 1 ELSE 0 END ) AS invalid,
    ${validInvalidQuery.toString()},
	COUNT(1) AS "all"
    FROM entries WHERE entries.is_deleted = 0${whereCondition(params.date, "entries")} ${groupBy(
        params.condition,
        "")}`;
    return query(entriesSummaryQuery, "");
};

export const profileSummary = (param: Type) => {
    const profileSummaryQuery = `SELECT
      ${time(param.condition, "profiles")}
      count(1) AS "all"
        FROM profiles WHERE 1=1
  ${whereCondition(param.date, "profiles")}
  ${groupBy(param.condition, "profiles")}`;
    return query(profileSummaryQuery, "")

}

const time = (condition: number, column: any) => {
    switch (true) {
        case condition == 1:
            return column !== ""
                ? `DATE_FORMAT(${column}.rcvd_time,'%Y-%m-%d') AS DATE,`
                : `DATE_FORMAT(rcvd_time,'%Y-%m-%d') AS DATE,`;
            break;

        case condition == 2:
            return column !== ""
                ? `DATE_FORMAT(${column}.rcvd_time,'%Y-%U') AS DATE,`
                : `DATE_FORMAT(rcvd_time,'%Y-%U') AS DATE,`;
            break;
        case condition == 3:
            return column !== ""
                ? `DATE_FORMAT(${column}.rcvd_time,'%Y-%m') AS DATE,`
                : `DATE_FORMAT(rcvd_time,'%Y-%m') AS DATE,`;
            break;
        case condition == 4:
            return column !== ""
                ? `DATE_FORMAT(${column}.rcvd_time,'%Y-%m-%d %H:00:00') AS DATE,`
                : `DATE_FORMAT(rcvd_time,'%Y-%m-%d %H:00:00') AS DATE,`;
            break;
    }
};

export const insertEntriesSummarydayli = (param: summaryEntries) => {
    return query(`INSERT INTO 
                  summary_entries_${param.table}(valid_microsite,invalid_microsite,valid_wa_1,invalid_wa_1,valid_wa_2,invalid_wa_2,valid_wa_3,invalid_wa_3,valid,invalid,total,label) 
                  VALUES(?,?,?,?,?,?,?,?,?,?,?,?)
                  ON DUPLICATE KEY UPDATE
                  valid_microsite=valid_microsite+${param.validMicrosite},
                  invalid_microsite=invalid_microsite+${param.invalidMicrosite},
                  valid_wa_1=valid_wa_1+${param.validWa1},
                  invalid_wa_1=invalid_wa_1+${param.invalidWa1},
                  valid_wa_2=valid_wa_2+${param.validWa2},
                  invalid_wa_2=invalid_wa_2+${param.invalidWa2},
                  valid_wa_3=valid_wa_3+${param.validWa3},
                  invalid_wa_3=invalid_wa_3+${param.invalidWa3},
                  valid=valid+${param.valid},
                  invalid=invalid+${param.invalid},
                  total=total+${param.total}`, [param.validMicrosite, param.invalidMicrosite, param.validWa1, param.invalidWa1, param.validWa2, param.invalidWa2, param.validWa3, param.invalidWa3, param.valid, param.invalid, param.total, param.label])
}
export const insertProfileSummary = (table: string, total: number, label: string) => {
    return query(`INSERT INTO
                  summary_registration_${table}(label,total)
                  VALUES(?,?)
                  ON DUPLICATE KEY UPDATE
                  total=total+${total}`, [label, total, total])
}