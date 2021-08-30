import { query } from "../../../config/baseFunction"
import moment from 'moment';

interface Type {
    key: string;
    column: string;
    direction: string;
    limitQuery: string;
    subtract: number,
    media: string
}

const orderBy = (direction: string, column: string) => {
    const directionType =
        direction == "ASC" ? "ASC" : direction == "DESC" ? "DESC" : "";
    if (column == "" || directionType == "") {
        return " ORDER BY profiles.regency ASC";
    } else {
        return ` ORDER BY ${column} ${directionType}`;
    }
};

const keyWhere = (key: string) => {
    if (key == "") {
        return "";
    } else if ("OTHERS".search(key) >= 0) {
        return ` AND (profiles.regency IS NULL OR profiles.regency = "" OR profiles.regency LIKE "%${key}%")`
    }
    else {
        return ` AND (profiles.regency LIKE "%${key}%")`;
    }
};

const dateWhere = (startDate: string, endDate: any) => {
    if (startDate == "" || endDate == "") {
        return ""
    } else {
        return ` AND (DATE(entries.rcvd_time)>="${startDate}" AND DATE(entries.rcvd_time) <= "${endDate}")`
    }
}

const cutOfWhere = (subtract: number) => {
    if (subtract == 0) {
        return ""
    } else {
        return ` AND (DATE(entries.rcvd_time)<="${moment().subtract(2, "days").format("YYYY-MM-DD")}")`
    }
}

const mediaWhere = (media: string) => {
    if (media == "") {
        return ""
    } else {
        return ` AND entries.media = ${media}`
    }
}

const mediaV2Where = (media: string) => {
    if (media == "") {
        return ""
    } else {
        return ` AND media = ${media}`
    }
}

export const countDistribution = (params: Type) => {
    let countQuery = `
  SELECT COUNT(*) as counts,
  SUM(countDistribution.valid) AS totalValid,
  SUM(countDistribution.invalid) AS totalInvalid,
  SUM(countDistribution.total_submit) AS totalSubmit,
  SUM(countDistribution.totalUnik) AS totalUniqueConsumen
    FROM (SELECT 
      COUNT(*) AS counts,
	  SUM(CASE WHEN entries.is_valid = 1 THEN 1 ELSE 0 END) AS valid,
      SUM(CASE WHEN entries.is_valid = 0 THEN 1 ELSE 0 END) AS invalid,  
      COUNT(*) AS total_submit,
      CASE WHEN uniqueConsumen.counts > 0 THEN uniqueConsumen.counts ELSE 0 END AS totalUnik
      FROM entries
      LEFT JOIN profiles ON entries.profile_id = profiles.id
      LEFT JOIN (SELECT profiles.regency, COUNT(*) AS counts 
      FROM profiles WHERE id IN (SELECT profile_id FROM entries) GROUP BY profiles.regency) AS uniqueConsumen 
      ON profiles.regency = uniqueConsumen.regency
      WHERE entries.is_deleted = 0${cutOfWhere(params.subtract)}${keyWhere(params.key)}${mediaWhere(params.media)} GROUP BY profiles.regency) AS countDistribution`;
    return query(countQuery, "");
};

export const exportDistribution = (params: Type) => {
    let exportDistributionquery = `
  SELECT (CASE WHEN profiles.regency = "" OR profiles.regency IS NULL THEN "OTHERS" ELSE profiles.regency END) AS regency,
  COUNT(*) AS total_submit, 
  SUM(CASE WHEN entries.is_valid=1 THEN 1 ELSE 0 END) AS total_submit_valid,
  SUM(CASE WHEN entries.is_valid=0 THEN 1 ELSE 0 END) AS total_submit_invalid, 
  SUM(CASE WHEN entries.is_valid=1 AND media = "200" THEN 1 ELSE 0 END) AS total_submit_validSms,
  SUM(CASE WHEN entries.is_valid=0 AND media = "200" THEN 1 ELSE 0 END) AS total_submit_invalidSms,
  SUM(CASE WHEN entries.is_valid=1 AND media = "300" THEN 1 ELSE 0 END) AS total_submit_validWa,
  SUM(CASE WHEN entries.is_valid=0 AND media = "300" THEN 1 ELSE 0 END) AS total_submit_invalidWa,
  uniqueConsumen.counts as uniqueConsumen 
  FROM entries
  LEFT JOIN profiles ON entries.profile_id = profiles.id
  LEFT JOIN (SELECT profiles.regency, COUNT(*) AS counts 
  FROM profiles GROUP BY profiles.regency) AS uniqueConsumen ON profiles.regency = uniqueConsumen.regency
  WHERE entries.is_deleted = 0${keyWhere(params.key)}${mediaWhere(params.media)} GROUP BY profiles.regency${orderBy(params.direction, params.column)} ${params.limitQuery}`;
    return query(exportDistributionquery, "");
};

export const listDistribution = (params: Type) => {
    let listDistributionQuery = `
  SELECT (CASE WHEN profiles.regency = "" OR profiles.regency IS NULL THEN "OTHERS" ELSE profiles.regency END) AS regency,
  COUNT(*) AS total_submit, 
  SUM(CASE WHEN entries.is_valid=1 THEN 1 ELSE 0 END) AS total_submit_valid,
  SUM(CASE WHEN entries.is_valid=0 THEN 1 ELSE 0 END) AS total_submit_invalid,
  uniqueConsumen.counts as uniqueConsumen 
  FROM entries
  LEFT JOIN profiles ON entries.profile_id = profiles.id
  LEFT JOIN (SELECT profiles.regency, COUNT(*) AS counts 
  FROM profiles GROUP BY profiles.regency) AS uniqueConsumen ON profiles.regency = uniqueConsumen.regency
  WHERE entries.is_deleted = 0${keyWhere(params.key)}${mediaWhere(params.media)} GROUP BY profiles.regency${orderBy(params.direction, params.column)} ${params.limitQuery}`;
    return query(listDistributionQuery, "");
};

export const countDistributionKtp = (params: Type) => {
    let countQuery = `
    SELECT 
    COUNT(*) as counts,
      SUM(countDistribution.valid) AS totalValid,
      SUM(countDistribution.invalid) AS totalInvalid,
    SUM(countDistribution.total_submit) AS totalSubmit,
      SUM(countDistribution.totalUnik) AS totalUniqueConsumen
FROM (SELECT 
          COUNT(*) AS counts,
              SUM(CASE WHEN entries.is_valid = 1 THEN 1 ELSE 0 END) AS valid,
          SUM(CASE WHEN entries.is_valid = 0 THEN 1 ELSE 0 END) AS invalid,  
          COUNT(*) AS total_submit,
          CASE WHEN uniqueConsumen.counts > 0 THEN uniqueConsumen.counts ELSE 0 END AS totalUnik
  FROM entries
  LEFT JOIN profiles ON entries.profile_id = profiles.id
  LEFT JOIN (SELECT profiles.regency_ktp, COUNT(*) AS counts 
  FROM profiles WHERE id IN (SELECT profile_id FROM entries) 
    GROUP BY profiles.regency_ktp
    ) AS uniqueConsumen ON profiles.regency_ktp = uniqueConsumen.regency_ktp
LEFT JOIN code_regency ON profiles.regency_ktp = code_regency.code
WHERE entries.is_deleted = 0${cutOfWhere(params.subtract)}${keyWhere(params.key)}${mediaWhere(params.media)} 
GROUP BY (CASE WHEN code_regency.name IS NOT NULL THEN code_regency.name ELSE "Non KTP" END)) AS countDistribution`;
    return query(countQuery, "");
};

export const listDistributionKtp = (params: Type) => {
    let listDistributionQuery = `
    SELECT 
        (CASE WHEN code_regency.name IS NOT NULL THEN code_regency.name ELSE "Non KTP" END) AS regency,
        COUNT(*) AS total_submit, 
        SUM(CASE WHEN entries.is_valid=1 THEN 1 ELSE 0 END) AS total_submit_valid,
        SUM(CASE WHEN entries.is_valid=0 THEN 1 ELSE 0 END) AS total_submit_invalid, 
        SUM(CASE WHEN entries.is_valid=1 AND media = "200" THEN 1 ELSE 0 END) AS total_submit_validSms,
        SUM(CASE WHEN entries.is_valid=0 AND media = "200" THEN 1 ELSE 0 END) AS total_submit_invalidSms,
        SUM(CASE WHEN entries.is_valid=1 AND media = "300" THEN 1 ELSE 0 END) AS total_submit_validWa,
        SUM(CASE WHEN entries.is_valid=0 AND media = "300" THEN 1 ELSE 0 END) AS total_submit_invalidWa,
        uniqueConsumen.counts as uniqueConsumen 
    FROM entries
    LEFT JOIN profiles ON entries.profile_id = profiles.id
    LEFT JOIN (SELECT profiles.regency_ktp, COUNT(*) AS counts 
               FROM profiles 
               GROUP BY regency_ktp
              ) AS uniqueConsumen ON profiles.regency_ktp = uniqueConsumen.regency_ktp
    LEFT JOIN code_regency ON profiles.regency_ktp = code_regency.code
    WHERE entries.is_deleted = 0${keyWhere(params.key)}${mediaWhere(params.media)} 
    GROUP BY (CASE WHEN code_regency.name IS NOT NULL THEN code_regency.name ELSE "Non KTP" END)${orderBy(params.direction, params.column)} ${params.limitQuery}`;
    return query(listDistributionQuery, "");
};

export const demographic = (subtract: number, media: string) => {
    let demographicQuery = `SELECT
    SUM(CASE WHEN gender = 'M' || gender = 'L' THEN 1 ELSE 0 END ) AS Male,
    SUM(CASE WHEN gender = 'F' || gender = 'P' THEN 1 ELSE 0 END ) AS Female,
    SUM(CASE WHEN gender = '' OR gender IS NULL THEN 1 ELSE 0 END ) AS NonKTPGender,
    SUM(CASE WHEN age > 0 AND age < 17 THEN 1 ELSE 0 END ) AS 'umur17',
    SUM(CASE WHEN age > 16 AND age < 26 THEN 1 ELSE 0 END ) AS 'umur17_25',
     SUM(CASE WHEN age > 25 AND age < 36 THEN 1 ELSE 0 END ) AS 'umur26_35',
     SUM(CASE WHEN age > 35 AND age < 46 THEN 1 ELSE 0 END ) AS 'umur36_45',
     SUM(CASE WHEN age > 45 AND age < 56 THEN 1 ELSE 0 END ) AS 'umur46_55',
     SUM(CASE WHEN age > 55 THEN 1 ELSE 0 END ) AS 'umur55',
     SUM(CASE WHEN age = 0 OR age IS NULL THEN 1 ELSE 0 END ) AS 'NonKTPAge'    
  FROM ( SELECT profiles.age AS age,profiles.gender AS gender FROM profiles JOIN entries ON(profiles.id = entries.profile_id) WHERE entries.is_deleted = 0${mediaWhere(media)}${cutOfWhere(subtract)} GROUP BY profiles.id) AS profileEntries`

    return query(demographicQuery, "")
}

export const variants = (media: number) => {
    let syntax = `SELECT variant_name AS categories, SUM(quantity + 0) AS series
    FROM variants
    LEFT JOIN entries_variant ON entries_variant.variant_id = variants.id
    GROUP BY variants.id`
    return query(syntax, "")
}

export const summaryTotal = (media: string) => {
    return query(`SELECT * FROM summary_total WHERE (type = "gender" OR type = "age") ${mediaV2Where(media)}`, [])
}