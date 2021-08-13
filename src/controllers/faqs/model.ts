import { ConsoleTransportOptions } from 'winston/lib/winston/transports';
import { connection } from '../../config/db';
const util = require("util");
const query = util.promisify(connection.query).bind(connection);

interface Type {
    limitQuery: string;
    key: string;
    column: string;
    direction: string;
}

const keyWhere = (key: string) => {
    if (key == "") {
        return "";
    } else {
        return ` WHERE (name LIKE "%${key}%")`;
    }
};

const orderBy = (direction: string, column: string) => {
    const directionType =
        direction == "ASC" ? "ASC" : direction == "DESC" ? "DESC" : "";
    if (column == "" || directionType == "") {
        return " ORDER BY id DESC";
    } else {
        return ` ORDER BY ${column}  ${directionType}`;
    }
}

export const listFaqs = (params: Type, url: string) => {
    let listEntriesQuery = `SELECT id, question, answer, faqs.order FROM faqs ${keyWhere(params.key)} ${params.limitQuery}`;
    return query(listEntriesQuery, url);
}

export const countList = () => {
    return query("SELECT COUNT(*) AS counts FROM faqs")
}

export const listByid = (id: number) => {
    let queryUserbyId = `SELECT * FROM faqs WHERE id = ?`;

    return query(queryUserbyId, id);
};

export const insertFaqs = (question: string, answer: string, order: string) => {
    let queryInsert = `INSERT INTO faqs(question,answer,order) VALUES (?,?,?)`;
    return query(queryInsert, [question, answer, order]);
};

export const editFaqs = (question: string, answer: string, order: string, id: number) => {
    let editUserQuery = `UPDATE faqs SET question = ?, answer = ?, order = ? WHERE id = ?`;

    return query(editUserQuery, [question, answer, order, id]);
};

export const deleteFaqs = (id: string) => {
    let queryDelete = `DELETE FROM faqs WHERE id = ?`;

    return query(queryDelete, [id]);
};