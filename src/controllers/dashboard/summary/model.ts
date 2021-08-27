import { query } from "../../../config/baseFunction";
import moment from "moment"

interface Type {
    condition: any;
    type: number;
    subtract: number
    startDate: any;
    endDate: any;
    media: string;
}

interface Type2 {
    condition: any;
    startDate: any;
    endDate: any;
}


const time = (condition: number, column: any) => {
    switch (true) {
        case condition == 1:
            return column !== ""
                ? `DATE_FORMAT(${column}.rcvd_time,'%d %b %Y') AS DATE,`
                : `DATE_FORMAT(rcvd_time,'%d %b %Y') AS DATE,`;
            break;

        case condition == 2:
            return column !== ""
                ? `CONCAT(DATE_FORMAT(DATE_ADD(${column}.rcvd_time, INTERVAL(1-DAYOFWEEK(${column}.rcvd_time)) DAY),'%e %b %Y'), ' - ',    
        DATE_FORMAT(DATE_ADD(${column}.rcvd_time, INTERVAL(7-DAYOFWEEK(${column}.rcvd_time)) DAY),'%e %b %Y')) AS DATE,`
                : `CONCAT(DATE_FORMAT(DATE_ADD(rcvd_time, INTERVAL(1-DAYOFWEEK(rcvd_time)) DAY),'%e %b %Y'), ' - ',    
          DATE_FORMAT(DATE_ADD(rcvd_time, INTERVAL(7-DAYOFWEEK(rcvd_time)) DAY),'%e %b %Y')) AS DATE,
      `;
            break;
        case condition == 3:
            return column !== ""
                ? `DATE_FORMAT(${column}.rcvd_time,'%M %Y') AS DATE,`
                : `DATE_FORMAT(rcvd_time,'%M %Y') AS DATE,`;
            break;
        case condition == 4:
            return column !== ""
                ? `DATE_FORMAT(${column}.rcvd_time,'%H:00:00') AS DATE,`
                : `DATE_FORMAT(rcvd_time,'%H:00:00') AS DATE,`;
            break;
    }
};

const timeTopup = (condition: number, column: any) => {
    switch (true) {
        case condition == 1:
            return column !== ""
                ? `DATE_FORMAT(${column}.updated_at,'%d %b %Y') AS DATE,`
                : `DATE_FORMAT(winners.updated_at,'%d %b %Y') AS DATE,`;
            break;

        case condition == 2:
            return column !== ""
                ? `CONCAT(DATE_FORMAT(DATE_ADD(${column}.updated_at, INTERVAL(1-DAYOFWEEK(${column}.updated_at)) DAY),'%e %b %Y'), ' - ',    
        DATE_FORMAT(DATE_ADD(${column}.updated_at, INTERVAL(7-DAYOFWEEK(${column}.updated_at)) DAY),'%e %b %Y')) AS DATE,`
                : `CONCAT(DATE_FORMAT(DATE_ADD(winners.updated_at, INTERVAL(1-DAYOFWEEK(winners.updated_at)) DAY),'%e %b %Y'), ' - ',    
          DATE_FORMAT(DATE_ADD(winners.updated_at, INTERVAL(7-DAYOFWEEK(winners.updated_at)) DAY),'%e %b %Y')) AS DATE,
      `;
            break;
        case condition == 3:
            return column !== ""
                ? `DATE_FORMAT(${column}.updated_at,'%M %Y') AS DATE,`
                : `DATE_FORMAT(winners.updated_at,'%M %Y') AS DATE,`;
            break;
        case condition == 4:
            return column !== ""
                ? `DATE_FORMAT(${column}.updated_at,'%H') AS DATE,`
                : `DATE_FORMAT(winners.updated_at,'%H') AS DATE,`;
            break;
    }
};

const groupBy = (condition: number, column: any) => {
    switch (true) {
        case condition == 1:
            return column !== ""
                ? `GROUP BY DATE_FORMAT(${column}.rcvd_time,"%Y-%m-%d")`
                : `GROUP BY DATE_FORMAT(rcvd_time,"%Y-%m-%d")`;
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
                ? `GROUP BY HOUR(${column}.rcvd_time)`
                : `GROUP BY HOUR(rcvd_time)`;
            break;
    }
}

const groupBy2 = (condition: number, column: any) => {
    switch (true) {
        case condition == 1:
            return column !== ""
                ? `GROUP BY DATE_FORMAT(${column}.rcvd_time,"%Y-%m-%d")`
                : `GROUP BY DATE_FORMAT(rcvd_time,"%Y-%m-%d"),entries.reply_id`;
            break;

        case condition == 2:
            return column !== ""
                ? `GROUP BY DATE_FORMAT(${column}.rcvd_time,"%Y-%U")`
                : `GROUP BY DATE_FORMAT(rcvd_time,"%Y-%U"),entries.reply_id`;
            break;
        case condition == 3:
            return column !== ""
                ? `GROUP BY DATE_FORMAT(${column}.rcvd_time,"%Y-%m")`
                : `GROUP BY DATE_FORMAT(rcvd_time,"%Y-%m"),entries.reply_id`;
            break;
        case condition == 4:
            return column !== ""
                ? `GROUP BY HOUR(${column}.rcvd_time)`
                : `GROUP BY HOUR(rcvd_time),entries.reply_id`;
            break;
    }
}

const groupByTopup = (condition: number, column: any) => {
    switch (true) {
        case condition == 1:
            return column !== ""
                ? `GROUP BY DATE_FORMAT(${column}.updated_at,"%Y-%m-%d")`
                : `GROUP BY DATE_FORMAT(winners.updated_at,"%Y-%m-%d")`;
            break;

        case condition == 2:
            return column !== ""
                ? `GROUP BY DATE_FORMAT(${column}.updated_at,"%Y-%U")`
                : `GROUP BY DATE_FORMAT(winners.updated_at,"%Y-%U")`;
            break;
        case condition == 3:
            return column !== ""
                ? `GROUP BY DATE_FORMAT(${column}.updated_at,"%Y-%m")`
                : `GROUP BY DATE_FORMAT(winners.updated_at,"%Y-%m")`;
            break;
        case condition == 4:
            return column !== ""
                ? `GROUP BY HOUR(${column}.updated_at)`
                : `GROUP BY HOUR(winners.updated_at)`;
            break;
    }
}

const whereCondition = (
    condition: number,
    startDate: any,
    endDate: any,
) => {
    switch (true) {
        case condition == 1 || condition == 4:
            if ((startDate == "" || endDate == "") && condition == 1) {
                return ` AND (DATE(entries.rcvd_time)>="${moment().subtract(14, "days").format("YYYY-MM-DD")}" AND DATE(entries.rcvd_time)<="${moment().format("YYYY-MM-DD")}")`
            } else if ((startDate == "" || endDate == "") && condition == 4) {
                return ""
            } else {
                return ` AND DATE(entries.rcvd_time) >= '${startDate}' AND DATE(entries.rcvd_time) <= '${endDate}'`
            }
            break;
        case condition == 2 || condition == 3:
            return ""
            break;
    }
}

const whereConditionTopup = (
    condition: number,
    startDate: any,
    endDate: any,
) => {
    switch (true) {
        case condition == 1 || condition == 4:
            if ((startDate == "" || endDate == "") && condition == 1) {
                return ` AND (DATE(winners.updated_at)>="${moment().subtract(14, "days").format("YYYY-MM-DD")}" AND DATE(winners.updated_at)<="${moment().format("YYYY-MM-DD")}")`
            } else if ((startDate == "" || endDate == "") && condition == 4) {
                return ""
            } else {
                return ` AND DATE(winners.updated_at) >= '${startDate}' AND DATE(winners.updated_at) <= '${endDate}'`
            }
            break;
        case condition == 2 || condition == 3:
            return ""
            break;
    }
}

const whereConditionV2 = (
    startDate: any,
    endDate: any,
) => {
    return ` AND (DATE(entries.rcvd_time) BETWEEN "${moment().format("YYYY-MM-DD")}" AND "${moment().format("YYYY-MM-DD")}")`
}

const whereProfileCondition = (
    condition: number,
    startDate: any,
    endDate: any,
) => {
    switch (true) {
        case condition == 1 || condition == 4:
            if ((startDate == "" || endDate == "") && condition == 1) {
                return ` AND (DATE(profiles.rcvd_time)>="${moment().subtract(14, "days").format("YYYY-MM-DD")}" AND DATE(profiles.rcvd_time)<="${moment().format("YYYY-MM-DD")}")`
            } else if ((startDate == "" || endDate == "") && condition == 4) {
                return ""
            } else {
                return ` AND DATE(profiles.rcvd_time) >= '${startDate}' AND DATE(profiles.rcvd_time) <= '${endDate}'`
            }
            break;
        case condition == 2 || condition == 3:
            return ""
            break;
    }
}

const whereMedia = (media: string) => {
    if (media == "") {
        return ""
    } else {
        return ` AND entries.media = ${media}`
    }
}

const cutOfWhere = (subtract: number, column: string) => {
    if (subtract == 0) {
        return ""
    } else {
        return ` AND (DATE(entries.rcvd_time)<="${moment().subtract(2, "days").format("YYYY-MM-DD")}")`
    }
}

export const countTopup = (params: Type2) => {
    let countQuery = `SELECT 
    SUM(CASE WHEN winners.status = 0 THEN 1 ELSE 0 END) AS totalUnprocessed,
    SUM(CASE WHEN winners.status = 1 THEN 1 ELSE 0 END) AS totalProcessed,
    SUM(CASE WHEN winners.status = 2 THEN 1 ELSE 0 END) AS totalSuccess,
    SUM(CASE WHEN winners.status = 3 THEN 1 ELSE 0 END) AS totalFailed,
    SUM(CASE WHEN winners.status THEN 1 ELSE 0 END) AS totalAll,
    SUM(CASE WHEN winners.status = 0 THEN prizes.nominal ELSE 0 END) AS totalNomUnprocessed,
    SUM(CASE WHEN winners.status = 1 THEN prizes.nominal ELSE 0 END) AS totalNomProcessed,
    SUM(CASE WHEN winners.status = 2 THEN prizes.nominal ELSE 0 END) AS totalNomSuccess,
    SUM(CASE WHEN winners.status = 3 THEN prizes.nominal ELSE 0 END) AS totalNomFailed,
    SUM(CASE WHEN winners.status THEN prizes.nominal ELSE 0 END) AS totalNomAll,
    count(*) AS counts
    FROM winners
    JOIN prizes ON winners.prize_id = prizes.id
    WHERE prizes.type = 1
    AND winners.status != 4
    ${whereConditionTopup(params.condition, params.startDate, params.endDate)}`;
    return query(countQuery, "");
};

export const summaryTopup = (params: Type2) => {
    let topupQuery = `SELECT
    ${timeTopup(params.condition, "")}
    SUM(case when winners.status = 0 then 1 ELSE 0 END) AS unprocessed,
    SUM(case when winners.status = 1 then 1 ELSE 0 END) AS processed,
    SUM(case when winners.status = 2 then 1 ELSE 0 END) AS success,
    SUM(case when winners.status = 3 then 1 ELSE 0 END) AS failed,
    SUM(case when winners.status = 0 then prizes.nominal ELSE 0 END) AS nomUnprocessed,
    SUM(case when winners.status = 1 then prizes.nominal ELSE 0 END) AS nomProcessed,
    SUM(case when winners.status = 2 then prizes.nominal ELSE 0 END) AS nomSuccess,
    SUM(case when winners.status = 3 then prizes.nominal ELSE 0 END) AS nomFailed,
    SUM(case when winners.status then 1 ELSE 0 END) as total,
    SUM(prizes.nominal) AS totalNominal
    FROM winners 
    JOIN prizes ON winners.prize_id = prizes.id 
    WHERE prizes.type = 1
    AND winners.status != 4
    ${whereConditionTopup(params.condition, params.startDate, params.endDate)} 
    ${groupByTopup(params.condition, "")}
    ORDER BY DATE`

    return query(topupQuery, "");
}

export const countEntries = (params: Type) => {
    let countQuery = `SELECT 
    SUM(CASE WHEN is_valid = 1 THEN 1 ELSE 0 END) AS totalValid,
    SUM(CASE WHEN is_valid = 0 THEN 1 ELSE 0 END) AS totalInvalid,
    SUM(CASE WHEN is_valid = 1 AND entries.media = "300" THEN 1 ELSE 0 END) AS totalValidWa2,
    SUM(CASE WHEN is_valid = 0 AND entries.media = "300" THEN 1 ELSE 0 END) AS totalInvalidWa2,
    SUM(CASE WHEN is_valid = 1 AND entries.media = "301" THEN 1 ELSE 0 END) AS totalValidWa1,
    SUM(CASE WHEN is_valid = 0 AND entries.media = "301" THEN 1 ELSE 0 END) AS totalInvalidWa1,
    SUM(CASE WHEN is_valid = 1 AND entries.media = "302" THEN 1 ELSE 0 END) AS totalValidWa3,
    SUM(CASE WHEN is_valid = 0 AND entries.media = "302" THEN 1 ELSE 0 END) AS totalInvalidWa3,
    SUM(CASE WHEN is_valid = 1 AND media = "400" THEN 1 ELSE 0 END) AS totalValidMicrosite,
    SUM(CASE WHEN is_valid = 0 AND media = "400" THEN 1 ELSE 0 END) AS totalInvalidMicrosite,
    count(*) AS counts
    FROM entries WHERE entries.is_deleted = 0${cutOfWhere(params.subtract, "")}${whereConditionV2(params.startDate, params.endDate)}${whereMedia(params.media)}`;
    return query(countQuery, "");
};

export const countEntriesV2 = (params: Type) => {
    let countQuery = `SELECT 
    count(1) AS counts
    FROM entries WHERE entries.is_deleted = 0${cutOfWhere(params.subtract, "")}${whereCondition(params.condition, params.startDate, params.endDate)}`;
    return query(countQuery, "");
};

export const totalEntries = (subtract: number, media: string) => {
    let countQuery = `SELECT 
    SUM(CASE WHEN is_valid = 1 THEN 1 ELSE 0 END) AS totalValid,
    SUM(CASE WHEN is_valid = 0 THEN 1 ELSE 0 END) AS totalInvalid,
    SUM(CASE WHEN is_valid = 1 AND entries.media = "300" THEN 1 ELSE 0 END) AS validWa2,
    SUM(CASE WHEN is_valid = 0 AND entries.media = "300" THEN 1 ELSE 0 END) AS invalidWa2,
    SUM(CASE WHEN is_valid = 1 AND entries.media = "301" THEN 1 ELSE 0 END) AS validWa1,
    SUM(CASE WHEN is_valid = 0 AND entries.media = "301" THEN 1 ELSE 0 END) AS invalidWa1,
    SUM(CASE WHEN is_valid = 1 AND entries.media = "302" THEN 1 ELSE 0 END) AS validWa3,
    SUM(CASE WHEN is_valid = 0 AND entries.media = "302" THEN 1 ELSE 0 END) AS invalidWa3,
    SUM(CASE WHEN is_valid = 1 AND media = "400" THEN 1 ELSE 0 END) AS totalValidMicrosite,
    SUM(CASE WHEN is_valid = 0 AND media = "400" THEN 1 ELSE 0 END) AS totalInvalidMicrosite,
    count(*) AS counts 
    FROM entries WHERE entries.is_deleted = 0${cutOfWhere(subtract, "")}${whereMedia(media)}`;
    return query(countQuery, "");
}

export const entriesSummary = (params: Type) => {
    const entriesSummaryQuery = `SELECT
    ${time(params.condition, "")}
    SUM(CASE WHEN is_valid = 1 THEN 1 ELSE 0 END ) AS valid,
    SUM(CASE WHEN is_valid = 0 THEN 1 ELSE 0 END ) AS invalid,
    SUM(CASE WHEN is_valid = 1 AND entries.media = "300" THEN 1 ELSE 0 END) AS validWa2,
    SUM(CASE WHEN is_valid = 0 AND entries.media = "300" THEN 1 ELSE 0 END) AS invalidWa2,
    SUM(CASE WHEN is_valid = 1 AND entries.media = "301" THEN 1 ELSE 0 END) AS validWa1,
    SUM(CASE WHEN is_valid = 0 AND entries.media = "301" THEN 1 ELSE 0 END) AS invalidWa1,
    SUM(CASE WHEN is_valid = 1 AND entries.media = "302" THEN 1 ELSE 0 END) AS validWa3,
    SUM(CASE WHEN is_valid = 0 AND entries.media = "302" THEN 1 ELSE 0 END) AS invalidWa3,
    SUM(CASE WHEN is_valid = 1 AND media = "400" THEN 1 ELSE 0 END ) AS validMicrosite,
    SUM(CASE WHEN is_valid = 0 AND media = "400" THEN 1 ELSE 0 END ) AS invalidMicrosite,
    SUM(CASE WHEN entries.id AND media = "301" THEN 1 ELSE 0 END ) AS "allWa1",
    SUM(CASE WHEN entries.id AND media = "300" THEN 1 ELSE 0 END ) AS "allWa2",
    SUM(CASE WHEN entries.id AND media = "302" THEN 1 ELSE 0 END ) AS "allWa3",
    SUM(CASE WHEN entries.id AND media = "400" THEN 1 ELSE 0 END ) AS "allMicrosite",
	COUNT(1) AS "all"
    FROM entries WHERE entries.is_deleted = 0${cutOfWhere(params.subtract, "")}${whereCondition(params.condition, params.startDate, params.endDate)} ${groupBy(
        params.condition,
        "")} ORDER BY rcvd_time`;
    return query(entriesSummaryQuery, "");
};

export const entriesSummaryV2 = (params: Type) => {
    const entriesSummaryQuery = `SELECT
    ${time(params.condition, "")}
    SUM(CASE WHEN is_valid = 1 THEN 1 ELSE 0 END ) AS valid,
    SUM(CASE WHEN is_valid = 0 THEN 1 ELSE 0 END ) AS invalid,
    SUM(CASE WHEN is_valid = 1 AND entries.media = "300" THEN 1 ELSE 0 END) AS validWa2,
    SUM(CASE WHEN is_valid = 0 AND entries.media = "300" THEN 1 ELSE 0 END) AS invalidWa2,
    SUM(CASE WHEN is_valid = 1 AND entries.media = "301" THEN 1 ELSE 0 END) AS validWa1,
    SUM(CASE WHEN is_valid = 0 AND entries.media = "301" THEN 1 ELSE 0 END) AS invalidWa1,
    SUM(CASE WHEN is_valid = 1 AND entries.media = "302" THEN 1 ELSE 0 END) AS validWa3,
    SUM(CASE WHEN is_valid = 0 AND entries.media = "302" THEN 1 ELSE 0 END) AS invalidWa3,
    SUM(CASE WHEN is_valid = 1 AND media = "400" THEN 1 ELSE 0 END ) AS validMicrosite,
    SUM(CASE WHEN is_valid = 0 AND media = "400" THEN 1 ELSE 0 END ) AS invalidMicrosite,
    SUM(CASE WHEN entries.id AND media = "300" THEN 1 ELSE 0 END ) AS "allWa",
    SUM(CASE WHEN entries.id AND media = "400" THEN 1 ELSE 0 END ) AS "allMicrosite",
	SUM(CASE WHEN entries.id THEN 1 ELSE 0 END ) AS "all"
    FROM entries WHERE entries.is_deleted = 0${cutOfWhere(params.subtract, "")} ${whereCondition(params.condition, params.startDate, params.endDate)} ${groupBy(
        params.condition,
        "")} ORDER BY rcvd_time`;
    return query(entriesSummaryQuery, "");
};

export const statusSummary = (params: Type) => {
    const statusSummaryQuery = `SELECT
    ${time(params.condition, "")}
        reply.name reason,
		IFNULL(COUNT(1),0) counts
    FROM reply 
	LEFT JOIN
		entries ON entries.reply_id = reply.id
    WHERE
		entries.is_deleted = 0
        AND entries.is_valid = 0
        ${cutOfWhere(params.subtract, "")}
        ${whereCondition(params.condition, params.startDate, params.endDate)}
        ${whereMedia(params.media)}
        ${groupBy2(params.condition, "")} 
    ORDER BY rcvd_time`;
    return query(statusSummaryQuery, "");
};

export const statusSummaryV2 = (params: Type) => {
    const statusSummaryQuery = `SELECT
    ${time(params.condition, "")}
    SUM(CASE WHEN reply.id = 1 THEN 1 ELSE 0 END) AS wrongFormat,
    SUM(CASE WHEN reply.id = 3 THEN 1 ELSE 0 END) AS wrongKTP,
    SUM(CASE WHEN reply.id = 4 THEN 1 ELSE 0 END) AS underAge,
    SUM(CASE WHEN reply.id = 5 THEN 1 ELSE 0 END) AS wrongCoupon,
    SUM(CASE WHEN reply.id = 6 THEN 1 ELSE 0 END) AS duplicateCoupon,
    SUM(CASE WHEN reply.id = 625 THEN 1 ELSE 0 END) AS differentFromPrev,
    SUM(CASE WHEN reply.id = 454 OR reply.id = 8 THEN 1 ELSE 0 END) AS notYetStart,
    SUM(CASE WHEN reply.id = 457 OR reply.id = 9 THEN 1 ELSE 0 END) AS overProgram,
    SUM(CASE WHEN reply.id = 218 THEN 1 ELSE 0 END) AS blacklist,
    SUM(CASE WHEN is_valid = 1 THEN 1 ELSE 0 END) AS valid,
    SUM(CASE WHEN is_valid = 0 THEN 1 ELSE 0 END) AS invalid,
    SUM(CASE WHEN is_valid = 2 THEN 1 ELSE 0 END) AS pending,
    SUM(CASE WHEN is_valid = 1 AND entries.media = "300" THEN 1 ELSE 0 END) AS validWa2,
    SUM(CASE WHEN is_valid = 0 AND entries.media = "300" THEN 1 ELSE 0 END) AS invalidWa2,
    SUM(CASE WHEN is_valid = 1 AND entries.media = "301" THEN 1 ELSE 0 END) AS validWa1,
    SUM(CASE WHEN is_valid = 0 AND entries.media = "301" THEN 1 ELSE 0 END) AS invalidWa1,
    SUM(CASE WHEN is_valid = 1 AND entries.media = "302" THEN 1 ELSE 0 END) AS validWa3,
    SUM(CASE WHEN is_valid = 0 AND entries.media = "302" THEN 1 ELSE 0 END) AS invalidWa3,
    SUM(CASE WHEN is_valid = 1 AND entries.media = "400" THEN 1 ELSE 0 END) AS validMicrosite,
    SUM(CASE WHEN is_valid = 0 AND entries.media = "400" THEN 1 ELSE 0 END) AS invalidMicrosite
    FROM entries 
    JOIN reply ON (entries.reply_id = reply.id)
    WHERE entries.is_deleted = 0${cutOfWhere(params.subtract, "")} ${whereCondition(params.condition, params.startDate, params.endDate)} ${groupBy(params.condition, "")} ORDER BY rcvd_time`;
    return query(statusSummaryQuery, "");
};

export const countProfiles = (params: Type) => {
    let countQuery = `SELECT COUNT(1) counts FROM (SELECT profiles.id
        FROM profiles
        JOIN entries ON profiles.id = entries.profile_id
        WHERE entries.is_deleted = 0
        ${cutOfWhere(params.subtract, "")}
        ${whereProfileCondition(params.condition, params.startDate, params.endDate)} 
        GROUP BY profiles.id) a`
    // let countQuery = `SELECT
    // count(1) AS counts
    //   FROM profiles JOIN entries ON profiles.id = entries.profile_id WHERE entries.is_deleted = 0${cutOfWhere(params.subtract, "")} ${whereCondition(params.condition, params.startDate, params.endDate)}`;
    return query(countQuery, "");
};

export const totalProfile = (subtract: number) => {
    let countQuery = `SELECT COUNT(1) counts
    FROM (SELECT profiles.id
      FROM profiles,
           entries
    WHERE profiles.id = entries.profile_id
    AND   is_deleted = 0
          ${cutOfWhere(subtract, "")} 
    GROUP BY profiles.id) a`;
    return query(countQuery, "");
}

export const profileSummary = (params: Type) => {
    const profileSummaryQuery = `SELECT
      ${time(params.condition, "profiles")}
      count(1) AS "all"
        FROM (SELECT profiles.rcvd_time FROM profiles JOIN entries ON profiles.id = entries.profile_id WHERE entries.is_deleted = 0
  ${cutOfWhere(params.subtract, "profiles")} 
  ${whereProfileCondition(params.condition, params.startDate, params.endDate)}
  GROUP BY profiles.id) profiles
  ${groupBy(params.condition, "profiles")} ORDER BY rcvd_time`;
    return query(profileSummaryQuery, "")
}

// Registration Summary Model 

export const totalRegistration = (params: Type, subtract: number) => {
    let countQuery = `SELECT
    ${time(params.condition, "entries")}
    SUM(CASE WHEN entries.invalid_reason_id = 1 THEN 1 ELSE 0 END) AS wrongFormat,
    SUM(CASE WHEN entries.invalid_reason_id = 2 THEN 1 ELSE 0 END) AS wrongCodeUnique,
    SUM(CASE WHEN entries.invalid_reason_id = 3 THEN 1 ELSE 0 END) AS codeUniqueUsed,
    SUM(CASE WHEN entries.invalid_reason_id = 4 THEN 1 ELSE 0 END) AS notYetStart,
    SUM(CASE WHEN entries.invalid_reason_id = 5 THEN 1 ELSE 0 END) AS overProgram,
    SUM(CASE WHEN entries.invalid_reason_id = 6 THEN 1 ELSE 0 END) AS blacklist,
    SUM(CASE WHEN entries.invalid_reason_id = 7 THEN 1 ELSE 0 END) AS wrongKTP,
    SUM(CASE WHEN entries.invalid_reason_id = 8 THEN 1 ELSE 0 END) AS wrongNoTransactions,
    SUM(CASE WHEN entries.invalid_reason_id = 9 THEN 1 ELSE 0 END) AS noTransactionsUsed,
    SUM(CASE WHEN entries.invalid_reason_id = 10 THEN 1 ELSE 0 END) AS unlucky,
    SUM(CASE WHEN entries.is_valid = 1 THEN 1 ELSE 0 END ) AS valid,
    SUM(CASE WHEN entries.is_valid = 0 THEN 1 ELSE 0 END ) AS invalid,
    count(1) AS counts
      FROM profiles,entries WHERE profiles.id = entries.profile_id AND is_deleted = 0${cutOfWhere(subtract, "")}`;
    return query(countQuery, "");
}

export const registrationSummary = (params: Type) => {
    const registrationSummaryQuery = `SELECT
      ${time(params.condition, "entries")}
      count(1) AS "all"
        FROM profiles JOIN entries ON profiles.id = entries.profile_id WHERE entries.is_deleted = 0
  ${cutOfWhere(params.subtract, "profiles")} ${whereCondition(params.condition, params.startDate, params.endDate)} ${groupBy(params.condition, "profiles")} ORDER BY profiles.created_at`;
    return query(registrationSummaryQuery, "")
}

export const summaryEntries = (param: Type, isTrue: boolean) => {
    if (param.condition == "hourly") {
        if (isTrue) {
            return query(`SELECT
            SUM(CASE WHEN is_valid = 1 AND entries.media = "301" THEN 1 ELSE 0 END) AS valid_wa_1,
            SUM(CASE WHEN is_valid = 0 AND entries.media = "301" THEN 1 ELSE 0 END) AS invalid_wa_1,
            SUM(CASE WHEN is_valid = 1 AND entries.media = "300" THEN 1 ELSE 0 END) AS valid_wa_2,
            SUM(CASE WHEN is_valid = 0 AND entries.media = "300" THEN 1 ELSE 0 END) AS invalid_wa_2,
            SUM(CASE WHEN is_valid = 1 AND entries.media = "302" THEN 1 ELSE 0 END) AS valid_wa_3,
            SUM(CASE WHEN is_valid = 0 AND entries.media = "302" THEN 1 ELSE 0 END) AS invalid_wa_3,
            SUM(CASE WHEN is_valid = 1 AND media = "400" THEN 1 ELSE 0 END ) AS valid_microsite,
            SUM(CASE WHEN is_valid = 0 AND media = "400" THEN 1 ELSE 0 END ) AS invalid_microsite,
            SUM(CASE WHEN is_valid = 1 THEN 1 ELSE 0 END ) AS valid,
            SUM(CASE WHEN is_valid = 0 THEN 1 ELSE 0 END ) AS invalid,
            SUM(CASE WHEN entries.id THEN 1 ELSE 0 END ) AS total,
            HOUR(rcvd_time) label
           FROM entries WHERE DATE(rcvd_time)=CURDATE()
           GROUP BY HOUR(rcvd_time) ORDER BY HOUR(rcvd_time) ASC`,[])
        } else {
            return query(`SELECT
                            (valid_microsite) valid_microsite,
                            (invalid_microsite) invalid_microsite,
                            (valid_wa_1) valid_wa_1,
                            (valid_wa_2) valid_wa_2,
                            (valid_wa_3) valid_wa_3,
                            (valid) valid,
                            (invalid_wa_1) invalid_wa_1,
                            (invalid_wa_2) invalid_wa_2,
                            (invalid_wa_3) invalid_wa_3,
                            (invalid) invalid,
                            (total) total,
                            HOUR(label) label                    
                          FROM summary_entries_${param.condition} 
                          WHERE DATE(label) BETWEEN "${param.startDate}" AND "${param.endDate}"`, [])
        }
    } else {
        return query(`SELECT
        sum(valid_wa_1) valid_wa_1,
        sum(invalid_wa_1) invalid_wa_1,
        sum(valid_wa_2) valid_wa_2,
        sum(invalid_wa_2) invalid_wa_2,
        sum(valid_wa_3) valid_wa_3,
        sum(invalid_wa_3) invalid_wa_3,
        sum(valid_microsite) valid_microsite,
        sum(invalid_microsite) invalid_microsite,
        sum(valid) valid,
        sum(invalid) invalid,
        sum(total) total,
        label FROM (
        SELECT
                        valid_wa_1,
                        invalid_wa_1,
                        valid_wa_2,
                        invalid_wa_2,
                        valid_wa_3,
                        invalid_wa_3,
                        valid_microsite,
                        invalid_microsite,
                        valid,
                        invalid,
                        total,
                        label                    
                    FROM summary_entries_${param.condition} 
                    WHERE label BETWEEN "${param.startDate}" AND "${param.endDate}" 
                    ${unionSummary('entries', isTrue, param.condition)}) aio GROUP BY label`, [])

    }
}

export const summaryProfile = (param: Type, isTrue: boolean) => {
    return query(`SELECT
        label, total                    
    FROM summary_registration_${param.condition} 
    WHERE label BETWEEN "${param.startDate}" AND "${param.endDate}" 
${unionSummary('profile', isTrue, param.condition)}`, [])

}

export const groupBy3 = (condition: string) => {
    if (condition == "daily") {
        return 'DATE(rcvd_time)'
    } else if (condition == "weekly") {
        return 'DATE_FORMAT(rcvd_time,"%Y-%U")'
    } else if (condition == "monthly") {
        return 'DATE_FORMAT(rcvd_time,"%Y-%m")'
    } else {
        return ""
    }
}

export const unionSummary = (table: string, isTrue: boolean, condition: string) => {
    if (isTrue) {
        if (table == "entries") {
                return `UNION (SELECT
                                SUM(CASE WHEN is_valid = 1 AND entries.media = "301" THEN 1 ELSE 0 END) AS validWa1,
                                SUM(CASE WHEN is_valid = 0 AND entries.media = "301" THEN 1 ELSE 0 END) AS invalidWa1,
                                SUM(CASE WHEN is_valid = 1 AND entries.media = "300" THEN 1 ELSE 0 END) AS validWa2,
                                SUM(CASE WHEN is_valid = 0 AND entries.media = "300" THEN 1 ELSE 0 END) AS invalidWa2,
                                SUM(CASE WHEN is_valid = 1 AND entries.media = "302" THEN 1 ELSE 0 END) AS validWa3,
                                SUM(CASE WHEN is_valid = 0 AND entries.media = "302" THEN 1 ELSE 0 END) AS invalidWa3,
                                SUM(CASE WHEN is_valid = 1 AND media = "400" THEN 1 ELSE 0 END ) AS validMicrosite,
                                SUM(CASE WHEN is_valid = 0 AND media = "400" THEN 1 ELSE 0 END ) AS invalidMicrosite,
                                SUM(CASE WHEN is_valid = 1 THEN 1 ELSE 0 END ) AS valid,
                                SUM(CASE WHEN is_valid = 0 THEN 1 ELSE 0 END ) AS invalid,
                                SUM(CASE WHEN entries.id THEN 1 ELSE 0 END ) AS "all",
                                ${groupBy3(condition)}
                               FROM entries WHERE DATE(rcvd_time)=CURDATE()
                               GROUP BY ${groupBy3(condition)}
                              )`
        } else if (table = "profile") {
            return `UNION (SELECT DATE(rcvd_time),COUNT(1) FROM profiles WHERE DATE(rcvd_time) = CURDATE())`
        } else {
            return ""
        }
    } else {
        return ""
    }
}

export const unionTotal = (table: string, isTrue: boolean) => {
    if (isTrue) {
        if (table == "entries") {
            return `UNION (SELECT "entries","entries",media,count(1) FROM entries WHERE DATE(rcvd_time)=CURDATE() GROUP BY media)`
        } else if (table = "profile") {
            return `UNION (SELECT "profiles","profiles","",COUNT(1) FROM profiles WHERE DATE(rcvd_time) = CURDATE())`
        } else {
            return ""
        }
    } else {
        return ""
    }
}

export const summaryTotal = (type: string, isTrue: boolean) => {
    return query(`SELECT name,type,media,counting FROM summary_total WHERE type = ? ${unionTotal(type, isTrue)}`, [type])
}