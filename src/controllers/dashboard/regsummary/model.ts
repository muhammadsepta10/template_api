import { query } from "../../../config/baseFunction";
import moment from "moment"

interface Type {
    condition: number;
    month: any;
    year: any;
    subtract: number
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
    }
};

const profileTime = (condition: number, column: any) => {
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
    }
};

const groupBy = (condition: number, column: any) => {
    switch (true) {
        case condition == 1:
            return column !== ""
                ? `GROUP BY DAY(${column}.rcvd_time)`
                : `GROUP BY DAY(rcvd_time)`;
            break;

        case condition == 2:
            return column !== ""
                ? `GROUP BY YEARWEEK(${column}.rcvd_time)`
                : `GROUP BY YEARWEEK(rcvd_time)`;
            break;
        case condition == 3:
            return column !== ""
                ? `GROUP BY MONTHNAME(${column}.rcvd_time)`
                : `GROUP BY MONTHNAME(rcvd_time)`;
            break;
    }
}

const profileGroupBy = (condition: number, column: any) => {
    switch (true) {
        case condition == 1:
            return column !== ""
                ? `GROUP BY DAY(${column}.rcvd_time)`
                : `GROUP BY DAY(rcvd_time)`;
            break;

        case condition == 2:
            return column !== ""
                ? `GROUP BY YEARWEEK(${column}.rcvd_time)`
                : `GROUP BY YEARWEEK(rcvd_time)`;
            break;
        case condition == 3:
            return column !== ""
                ? `GROUP BY MONTHNAME(${column}.rcvd_time)`
                : `GROUP BY MONTHNAME(rcvd_time)`;
            break;
    }
}

const whereCondition = (
    condition: number,
    month: any,
    year: any,
    column: any
) => {
    switch (true) {
        case condition == 1 || condition == 2:
            return column !== ""
                ? `MONTH(profiles.rcvd_time) = ${month} AND YEAR(profiles.rcvd_time)= ${year}`
                : `MONTH(rcvd_time) = ${month} AND YEAR(rcvd_time)= ${year}`;
            break;
        case condition == 3:
            return column !== ""
                ? `YEAR(profiles.rcvd_time) = ${year}`
                : `YEAR(rcvd_time) = ${year}`;
            break;
    }
};

const cutOfWhere = (subtract: number, column: string) => {
    if (subtract == 0) {
        return ""
    } else {
        return ` AND (DATE(profiles.rcvd_time)<="${moment().subtract(2, "days").format("YYYY-MM-DD")}")`
    }
}

export const countRegistered = (params: Type) => {
    let countQuery = `SELECT 
        ${profileTime(params.condition, "profiles")} 
            SUM(CASE WHEN id_type = 1 THEN 1 ELSE 0 END) AS totalRegistered 
        FROM profiles WHERE ${whereCondition(params.condition, params.month, params.year, "profiles")}
        `;

    return query(countQuery, "");
};

export const countRegisteredSubmit = (params: Type) => {
    let countQuery = `SELECT ${profileTime(params.condition, "profiles")} 
    SUM(CASE WHEN entries.is_valid = 1 AND profiles.id = entries.profile_id THEN 1 ELSE 0 END) AS totalRegisteredValid,
    SUM(CASE WHEN entries.is_valid = 0 AND profiles.id = entries.profile_id THEN 1 ELSE 0 END) AS totalRegisteredInvalid,
    SUM(CASE WHEN profiles.id = entries.profile_id THEN 1 ELSE 0 END) AS total
    FROM profiles 
    JOIN entries ON profiles.id = entries.profile_id
    WHERE ${whereCondition(params.condition, params.month, params.year, "profiles")}
    `;

    return query(countQuery, "");
};

//WHERE ${whereCondition(params.condition, params.month, params.year, "profiles")}