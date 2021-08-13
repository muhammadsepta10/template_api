import { connection } from '../../config/db';
const util = require("util");
const query = util.promisify(connection.query).bind(connection);

interface Type {
    limitQuery: string;
    key: string;
    column: string;
    direction: string;
    media: string
}

const keyWhere = (key: string) => {
    if (key == "") {
        return "";
    } else {
        return ` AND (name LIKE "%${key}%")`;
    }
};

const orderBy = (direction: string, column: string) => {
    const directionType =
        direction == "ASC" ? "ASC" : direction == "DESC" ? "DESC" : "";
    if (column == "" || directionType == "") {
        return " ORDER BY reply.sort ASC";
    } else {
        return ` ORDER BY ${column}  ${directionType}`;
    }
}

const whereMedia = (media: string) => {
    if (media == "") {
        return ""
    } else {
        return ` AND reply.media = "${media}"`
    }
}

export const listReplies = (params: Type) => {
    let listEntriesQuery = `SELECT reply.id, reply.name,reply,media.name media FROM reply,media WHERE reply.media = media.code AND reply.sort != 0 AND reply.status = 1 ${keyWhere(params.key)}${whereMedia(params.media)}${orderBy(params.direction, params.column)} ${params.limitQuery}`;
    // ${keyWhere(params.key)}${orderBy(params.direction, params.column)} ${params.limitQuery}
    return query(listEntriesQuery);
}

export const countList = (params: Type) => {
    return query(`SELECT COUNT(*) AS counts FROM reply,media WHERE reply.media = media.code AND reply.sort != 0 AND reply.status = 1 ${keyWhere(params.key)}${whereMedia(params.media)}${orderBy(params.direction, params.column)} ${params.limitQuery}`)
}

export const listByid = (id: number) => {
    let queryUserbyId = `SELECT * FROM reply WHERE id = ?`;

    return query(queryUserbyId, id);
};

export const searchReply = (sender: string, id: number, type: string) => {
    let edit = `SELECT COUNT(*) AS counts FROM reply WHERE name=? AND id!=?`;
    let insert = `SELECT * FROM reply WHERE name= ?`;
    if (type == "edit") {
        return query(edit, [sender, id]);
    } else {
        return query(insert, sender);
    }
};

export const insertReply = (
    name: string,
    reply: string,
) => {
    let queryInsert = `INSERT INTO reply(name,reply) VALUES (?,?)`;
    return query(queryInsert, [name, reply]);
};

export const editReply = (
    name: string,
    reply: string,
    id: number
) => {
    let editUserQuery = `UPDATE reply SET name = ?, reply = ? WHERE id = ?`;

    return query(editUserQuery, [name, reply, id]);
};

export const deleteReply = (id: string) => {
    let queryDelete = `DELETE FROM reply WHERE id = ?`;

    return query(queryDelete, [id]);
};