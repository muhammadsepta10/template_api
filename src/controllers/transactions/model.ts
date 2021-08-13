import { query } from "../../config/baseFunction";

interface Type {
    startDate: any;
    endDate: any;
    key: string;
    column: string;
    direction: string;
    limitQuery: string;
    type: string
    status: string
}

interface Upload {
    winnerId: any;
    accountNumber: any;
}

const orderBy = (direction: string, column: string) => {
    const directionType =
        direction == "ASC" ? "ASC" : direction == "DESC" ? "DESC" : "";
    if (column == "" || directionType == "") {
        return " ORDER BY transactions.id DESC";
    } else {
        return ` ORDER BY ${column} ${directionType}`;
    }
};

const keyWhere = (key: string) => {
    if (key == "") {
        return "";
    } else {
        return ` AND (entries.sender LIKE "%${key}%" OR entries.name LIKE "%${key}%" OR entries.city LIKE "%${key}%" OR entries.coupon LIKE "%${key}%")`;
    }
};

const dateWhere = (startDate: any, endDate: any) => {
    if (startDate == "" || endDate == "") {
        return "";
    } else {
        return ` AND DATE(entries.rcvd_time) BETWEEN "${startDate}" AND "${endDate}"`;
    }
};

const typeTransactionWhere = (type: string) => {
    if (type == "") {
        return ""
    } else {
        return ` AND prizes.type = ${type}`
    }
}

const statusWhere = (status: string) => {
    if (status == "") {
        return ""
    } else {
        return ` AND transactions.status = ${status}`
    }
}

export const countTransactions = (params: Type) => {
    let queryCountTransactions = `SELECT COUNT(*) AS counts
    FROM winners
    LEFT JOIN (SELECT max(id) id, status, winner_id, proccesed_date FROM transactions GROUP BY winner_id) AS transactions
    ON transactions.winner_id = winners.id
    JOIN entries ON winners.entries_id = entries.id
    JOIN prizes ON winners.prize_id = prizes.id
    JOIN profiles ON entries.profile_id = profiles.id
    WHERE entries.is_deleted = 0${dateWhere(params.startDate, params.endDate)}${typeTransactionWhere(params.type)}${statusWhere(params.status)}${keyWhere(params.key)}`;
    return query(queryCountTransactions, "");
};

export const listTransactions = (params: Type) => {
    let queryListTransactions = `SELECT transactions.id,transactions.winner_id, transactions.proccesed_date, entries.rcvd_time, entries.id as entriesId, 
    entries.name as name, profiles.id as profileId, entries.sender, entries.city, entries.coupon, 
    prizes.name AS prize, prizes.type as typePrizes, transactions.status
    FROM winners
    LEFT JOIN (SELECT max(id) id, status, winner_id, proccesed_date FROM transactions GROUP BY winner_id) AS transactions
    ON transactions.winner_id = winners.id
    JOIN entries ON winners.entries_id = entries.id
    JOIN prizes ON winners.prize_id = prizes.id
    JOIN profiles ON entries.profile_id = profiles.id
    WHERE entries.is_deleted = 0${dateWhere(params.startDate, params.endDate)}${typeTransactionWhere(params.type)}${statusWhere(params.status)}${keyWhere(params.key)}${orderBy(params.direction, params.column)} ${params.limitQuery}`;
    return query(queryListTransactions, "");
};

export const transactionByid = (id: number) => {
    let queryListTransactionsbyId = `SELECT transactions.id, transactions.winner_id,  transactions.proccesed_date, entries.rcvd_time, entries.id as entriesId, 
    entries.name as name, profiles.id as profileId, entries.sender, entries.city, entries.coupon, 
    prizes.name AS prize, prizes.type as typePrizes, transactions.status, winners.id as id,winners.account_number
    FROM winners
    LEFT JOIN (SELECT max(id) id, status, winner_id, proccesed_date FROM transactions GROUP BY winner_id) AS transactions
    ON transactions.winner_id = winners.id
    JOIN entries ON winners.entries_id = entries.id
    JOIN prizes ON winners.prize_id = prizes.id
    JOIN profiles ON entries.profile_id = profiles.id
    WHERE entries.is_deleted = 0 AND transactions.winner_id = ?`;
    return query(queryListTransactionsbyId, [id]);
};

export const detailTransactionlog = (id: number) => {
    let queryDetailwinner = `SELECT transactions.reason, transactions.account_number, transactions.reference, transactions.amount, transactions.proccesed_date
    FROM winners LEFT JOIN (SELECT winner_id, reason, account_number, reference, amount, proccesed_date FROM transactions) transactions 
    on transactions.winner_id = winners.id WHERE winner_id = ?`;
    return query(queryDetailwinner, id);
};

export const updateTransaction = (winnerId: number, accountNumber: number) => {
    const update = `UPDATE winners SET account_number = ? WHERE id = ?`
    return query(update, [accountNumber, winnerId])
}

export const checkExistwinner = (winnerId: number) => {
    const update = `SELECT max(id) id, status, winner_id, proccesed_date FROM transactions WHERE winner_id = ? AND (status = 0 OR status = 3) GROUP BY winner_id`
    return query(update, [winnerId])
}

export const importWinner = (params: Upload) => {
    const update = `UPDATE winners SET account_number = ? WHERE id = ?`
    return query(update, [params.accountNumber, params.winnerId])
}