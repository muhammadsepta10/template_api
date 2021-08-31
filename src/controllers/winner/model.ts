import { query } from "../../config/baseFunction";
import { productList } from "../master/model";

interface Type {
    startDate: any;
    endDate: any;
    key: string;
    column: string;
    columnSearch: string;
    direction: string;
    limitQuery: string;
    status: any;
    type: string;
    userId?:number
}

interface Upload {
    entriesId: any;
    prizeId: any;
    periodeId: any;
    accountNumber: any;
    status: any;
}

interface sbStatus {
    id: any;
    purchaseDate: any;
    isValid: any;
}

interface sbVariant {
    entriesId: any;
    variantId: any;
    quantity: any;
    totalAmount: any;
}

const orderBy = (direction: string, column: string) => {
    const directionType =
        direction == "ASC" ? "ASC" : direction == "DESC" ? "DESC" : "";
    if (column == "" || directionType == "") {
        return " ORDER BY entries.rcvd_time DESC";
    } else {
        return ` ORDER BY ${column} ${directionType}`;
    }
};

// const keyWhere = (key: string) => {
//     if (key == "") {
//         return "";
//     } else {
//         return ` AND (prizes.name LIKE "%${key}%" OR entries.sender LIKE "%${key}%" OR entries.name LIKE "%${key}%" OR entries.city LIKE "%${key}%" OR entries.id_number LIKE "%${key}%")`;
//     }
// };

const keyWhere = (key: string, columnSearch: string) => {
    if (key == "") {
        return "";
    } else {
        return ` AND (entries.${columnSearch} LIKE "%${key}%")`;
    }
};

const dateWhere = (startDate: any, endDate: any) => {
    if (startDate == "" || endDate == "") {
        return "";
    } else {
        return ` AND DATE(entries.rcvd_time) BETWEEN "${startDate}" AND "${endDate}"`;
    }
};

const typeWhere = (type: string) => {
    if (type == "") {
        return ""
    } else {
        return ` AND prizes.type = ${type}`
    }
};

const statusWhere = (status: string) => {
    if (status == "") {
        return ""
    } else {
        return ` AND winners.status = ${status}`
    }
};

export const countWinner = (params: Type) => {
    let queryCountWinner = `SELECT COUNT(*) as counts
    FROM winners
   JOIN entries ON winners.entries_id = entries.id
   JOIN allocations ON winners.allocation_id = allocations.id
   JOIN profiles ON entries.profile_id = profiles.id
   JOIN prizes ON winners.prize_id = prizes.id
   WHERE entries.is_deleted = 0${keyWhere(params.key, params.columnSearch)}${typeWhere(params.type)}${statusWhere(params.status)}${dateWhere(params.startDate, params.endDate)}`;
    return query(queryCountWinner, "");
};

export const listWinner = (params: Type) => {
    let queryListWinner = `SELECT winners.id winnerId, DATE_FORMAT(entries.rcvd_time,"%d %M %Y %H:%i:%s") AS rcvd_time, profiles.name fullname, entries.sender, regency, entries.id entriesId, prizes.name prize,
    prizes.type, winners.status
   FROM winners
   JOIN entries ON winners.entries_id = entries.id
   JOIN allocations ON winners.allocation_id = allocations.id
   JOIN profiles ON entries.profile_id = profiles.id
   JOIN prizes ON winners.prize_id = prizes.id
   WHERE entries.is_deleted = 0${keyWhere(params.key, params.columnSearch)}${typeWhere(params.type)}${statusWhere(params.status)}${dateWhere(params.startDate, params.endDate)} ${orderBy(params.direction, params.column)} ${params.limitQuery}`;
    return query(queryListWinner, "");
};

export const countWinnerV2 = (params: Type) => {
    let queryCountWinner = `SELECT COUNT(*) as counts   
    FROM winners
    JOIN entries ON winners.entries_id = entries.id
    JOIN prizes ON winners.prize_id = prizes.id WHERE entries.is_deleted = 0 ${keyWhere(params.key, params.columnSearch)}${typeWhere(params.type)}${statusWhere(params.status)}${dateWhere(params.startDate, params.endDate)}`;
    return query(queryCountWinner, "");
};

export const countWinnerV3 = (params: Type) => {
    let queryCountWinner = `SELECT COUNT(*) as counts   
    FROM winners
    JOIN coupon_header ON winners.entries_id = coupon_header.id
    JOIN (SELECT entries.*,
                 header_id 
          FROM entries,coupon_detail 
          WHERE entries.id = coupon_detail.entries_id 
          GROUP BY coupon_detail.header_id) 
         entries ON coupon_header.id = entries.header_id
    JOIN prizes ON winners.prize_id = prizes.id WHERE entries.is_deleted = 0 ${keyWhere(params.key, params.columnSearch)}${typeWhere(params.type)}${statusWhere(params.status)}${dateWhere(params.startDate, params.endDate)}`;
    return query(queryCountWinner, "");
};

export const listWinnerV3 = (params: Type, gnrlParameter: string) => {
    let queryListWinner = `
    SELECT winners.id,
           winners.entries_id,
           entries.sender,
           entries.name,
           entries.hp,
           entries.id_number,
           prizes.name AS prizeName,
           entries.rcvd_time,
           winners.status,
           entries.city,
           winners.status,
           prizes.type,
           winners.account_number,
           winners.counting,
           (SELECT param FROM general_parameter WHERE description = ?) maxCount
    FROM winners
    JOIN coupon_header ON winners.entries_id = coupon_header.id
    JOIN (SELECT entries.*,
                 header_id 
          FROM entries,coupon_detail 
          WHERE entries.id = coupon_detail.entries_id 
          GROUP BY coupon_detail.header_id) 
         entries ON coupon_header.id = entries.header_id
    JOIN prizes ON winners.prize_id = prizes.id 
    WHERE entries.is_deleted = 0
    ${params?.userId?"AND topup_by !="+params.userId:""}
    ${keyWhere(params.key, params.columnSearch)}
    ${typeWhere(params.type)}
    ${statusWhere(params.status)}
    ${dateWhere(params.startDate, params.endDate)} 
    ${orderBy(params.direction, params.column)} 
    ${params.limitQuery}`;
    return query(queryListWinner, gnrlParameter);
};

export const listWinnerV2 = (params: Type, gnrlParameter: string) => {
    let queryListWinner = `
    SELECT winners.id,
           winners.entries_id,
           entries.sender,
           entries.name,
           entries.hp,
           entries.id_number,
           prizes.name AS prizeName,
           entries.rcvd_time,
           winners.status,
           entries.city,
           winners.status,
           prizes.type,
           winners.account_number,
           winners.counting,
           (SELECT param FROM general_parameter WHERE description = ?) maxCount
    FROM winners
    JOIN entries ON winners.entries_id = entries.id
    JOIN prizes ON winners.prize_id = prizes.id 
    WHERE entries.is_deleted = 0
    ${params?.userId?"AND topup_by !="+params.userId:""}
    ${keyWhere(params.key, params.columnSearch)}
    ${typeWhere(params.type)}
    ${statusWhere(params.status)}
    ${dateWhere(params.startDate, params.endDate)} 
    ${orderBy(params.direction, params.column)} 
    ${params.limitQuery}`;
    return query(queryListWinner, gnrlParameter);
};

export const maxCount = (description: string) => {
    return query("SELECT description,param FROM general_parameter WHERE description = ?", [description])
}

export const exportWinner = (params: Type) => {
    let queryListWinner = `
    SELECT winners.id,
           winners.entries_id,
           entries.sender,
           entries.name,
           entries.hp,
           entries.id_number,
           prizes.name AS prizeName,
           DATE_FORMAT(entries.rcvd_time,"%Y-%m-%d %H:%i:s") rcvd_time,
           entries.invalid_reason info,
           (CASE WHEN winners.status = 0 THEN "Unprocessed" WHEN winners.status = 1 THEN "Processed" WHEN winners.status = 2 THEN "Success" WHEN winners.status = 3 THEN "Failed" ELSE 0 END) status,
           entries.city, (CASE WHEN prizes.type = 1 THEN "Hadiah Hiburan" WHEN prizes.type = 2 THEN "Grand Prize" ELSE 0 END) type,
           winners.account_number,
           transactions.sn serial_number
    FROM winners
    JOIN entries ON winners.entries_id = entries.id
    JOIN prizes ON winners.prize_id = prizes.id
    LEFT JOIN transactions ON winners.id = transactions.winner_id AND transactions.sn IS NOT NULL AND transactions.sn != ""
    WHERE entries.is_deleted = 0
    ${keyWhere(params.key, params.columnSearch)}
    ${typeWhere(params.type)}
    ${statusWhere(params.status)}
    ${dateWhere(params.startDate, params.endDate)}
    GROUP BY winners.id
    ${orderBy(params.direction, params.column)}`;
    return query(queryListWinner, "");
};

export const exportWinnerV2 = (params: Type) => {
    let queryListWinner = `
    SELECT winners.id,
           winners.entries_id,
           entries.sender,
           entries.name,
           entries.hp,
           entries.id_number,
           prizes.name AS prizeName,
           DATE_FORMAT(entries.rcvd_time,"%Y-%m-%d %H:%i:s") rcvd_time,
           entries.invalid_reason info,
           (CASE WHEN winners.status = 0 THEN "Unprocessed" WHEN winners.status = 1 THEN "Processed" WHEN winners.status = 2 THEN "Success" WHEN winners.status = 3 THEN "Failed" ELSE 0 END) status,
           entries.city, (CASE WHEN prizes.type = 1 THEN "Hadiah Hiburan" WHEN prizes.type = 2 THEN "Grand Prize" ELSE 0 END) type,
           winners.account_number,
           transactions.sn serial_number
    FROM winners
    JOIN coupon_header ON winners.entries_id = coupon_header.id
    JOIN (SELECT entries.*,
                header_id 
            FROM entries,coupon_detail 
            WHERE entries.id = coupon_detail.entries_id 
            GROUP BY coupon_detail.header_id) 
    entries ON coupon_header.id = entries.header_id
    JOIN prizes ON winners.prize_id = prizes.id
    LEFT JOIN transactions ON winners.id = transactions.winner_id AND transactions.sn IS NOT NULL AND transactions.sn != ""
    WHERE entries.is_deleted = 0
    ${keyWhere(params.key, params.columnSearch)}
    ${typeWhere(params.type)}
    ${statusWhere(params.status)}
    ${dateWhere(params.startDate, params.endDate)}
    GROUP BY winners.id
    ${orderBy(params.direction, params.column)}`;
    return query(queryListWinner, "");
};

export const detailWinnerV2 = (id: number) => {
    let queryDetailwinner = `
    SELECT winners.id,
           profiles.name fullname,
           profiles.sender,
           profiles.hp,
           profiles.id_number,
           profiles.rcvd_time,
           prizes.name prize,
           winners.status,
           winners.account_number,
           transactions.sn
    FROM winners
    JOIN coupon_header ON winners.entries_id = coupon_header.id
    JOIN (SELECT entries.*,
                header_id 
          FROM entries,coupon_detail 
          WHERE entries.id = coupon_detail.entries_id 
          GROUP BY coupon_detail.header_id) 
    entries ON coupon_header.id = entries.header_id
    JOIN prizes ON winners.prize_id = prizes.id
    LEFT JOIN transactions ON winners.id = transactions.winner_id AND transactions.sn IS NOT NULL AND transactions.sn != ""
    WHERE entries.is_deleted = 0
    AND winners.id = ?
    GROUP BY winners.id`;
    return query(queryDetailwinner, id);
};

export const detailWinner = (id: number) => {
    let queryDetailwinner = `
    SELECT winners.id,
           entries.name fullname,
           entries.sender,
           entries.hp,
           entries.id_number,
           entries.rcvd_time,
           prizes.name prize,
           winners.status,
           winners.account_number,
           transactions.sn
    FROM winners
    JOIN entries ON winners.entries_id = entries.id
    JOIN prizes ON winners.prize_id = prizes.id
    JOIN profiles ON entries.profile_id = profiles.id 
    LEFT JOIN transactions ON winners.id = transactions.winner_id AND transactions.sn IS NOT NULL AND transactions.sn != ""
    WHERE entries.is_deleted = 0
    AND winners.id = ?
    GROUP BY winners.id`;
    return query(queryDetailwinner, id);
};

export const transactionByWiner = (winnerId: number) => {
    return query("SELECT reason,status,account_number,reference,sn,amount,DATE_FORMAT(proccesed_date,'%Y-%m-%d %H:%i:%S') proccesed_date FROM transactions WHERE winner_id = ? ORDER BY id DESC", winnerId)
}

export const detailTransactionlog = (id: number) => {
    let queryDetailwinner = `SELECT transactions.reason, transactions.account_number, transactions.reference, transactions.amount, transactions.proccesed_date
    FROM winners LEFT JOIN (SELECT winner_id, reason, account_number, reference, amount, proccesed_date FROM transactions) transactions 
    on transactions.winner_id = winners.id WHERE winner_id = ?`;
    return query(queryDetailwinner, id);
};

export const checkExistPrize = (id: number) => {
    return query("SELECT id FROM prizes WHERE id = ?", [id])
}

export const checkEntries = (id: number) => {
    return query("SELECT winner.id FROM entries LEFT JOIN winner ON winner.entries_id = entries.id WHERE entries.id = ?", [id])
}

export const importWinner = (params: Upload) => {
    let importWinnerQuery = `INSERT INTO winners (entries_id, prize_id, periode_id, account_number, status) VALUES (?, ?, ?, ?, ?) `;

    return query(importWinnerQuery, [params.entriesId, params.prizeId, params.periodeId, params.accountNumber, params.status]);
};

export const areYouThere = (entriesId: number) => {
    let checkQuery = 'SELECT COUNT(*) as counts from entries_variant WHERE entries_id = ?'
    return query(checkQuery, [entriesId])
}

export const deleteSaved = (entriesId: number) => {
    let deleteQuery = `DELETE FROM entries_variant WHERE entries_id = ?`
    return query(deleteQuery, [entriesId])
}

export const submitStatusWinner = (params: sbStatus) => {
    let submitQuery = 'UPDATE entries SET purchase_date = ?, is_valid = ? WHERE id = ?'
    return query(submitQuery, [params.purchaseDate, params.isValid, params.id])
}

export const submitWinnerVariant = (params: sbVariant) => {
    let submitQuery = 'INSERT INTO entries_variant (entries_id, variant_id, quantity, amount) VALUES (?, ?, ?, ?)'
    return query(submitQuery, [params.entriesId, params.variantId, params.quantity, params.totalAmount])
}

export const unprocessedWinner = (id: number) => {
    let submitQuery = 'UPDATE winners SET status = 0 WHERE entries_id = ?'
    return query(submitQuery, [id])
}

export const approveWinner = (id: number) => {
    let submitQuery = 'UPDATE winners SET status = 1 WHERE entries_id = ?'
    return query(submitQuery, [id])
}

export const unverifyWinner = (id: number) => {
    let unQuery = `UPDATE winners SET status = 2 WHERE entries_id = ?`
    return query(unQuery, [id])
}

export const unverifyWinnerAllocation = (id: number) => {
    let unQuery = `UPDATE allocations SET entries_id = NULL, is_used = 0, used_date = NULL WHERE entries_id = ?`
    return query(unQuery, [id])
}

export const editAcountNumber = (id: number, accountNumber: string) => {
    return query("UPDATE winners SET account_number = ? WHERE id = ?", [accountNumber, id])
}

export const updateStatusWinner = (id: number, status: number, reason: string) => {
    return query("UPDATE winners SET status = ?, reason = ? WHERE id = ?", [status, reason, id])
}