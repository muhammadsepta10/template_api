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
        return ` WHERE (name LIKE "%${key}%" OR sender LIKE "%${key}%" OR id_number LIKE "%${key}%" OR ip LIKE "%${key}%")`;
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

export const userList = (params: Type, url: string) => {
    let listEntriesQuery = `SELECT id, name, sender,id_number FROM white_list ${keyWhere(params.key)}${orderBy(params.direction, params.column)} ${params.limitQuery}`;

    return query(listEntriesQuery, url);
}

export const countList = () => {
    return query("SELECT COUNT(*) AS counts FROM white_list")
}

export const listByid = (id: number) => {
    let queryUserbyId = `SELECT * FROM white_list WHERE id = ?`;

    return query(queryUserbyId, id);
};

export const searchList = (sender: string, id: number, type: string) => {
    let edit = `SELECT COUNT(*) AS counts FROM white_list WHERE sender=? AND id!=?`;
    let insert = `SELECT * FROM white_list WHERE sender= ?`;
    if (type == "edit") {
        return query(edit, [sender, id]);
    } else {
        return query(insert, sender);
    }
};

export const insertList = (
    name: string,
    sender: string,
    idNumber: number
) => {
    let queryInsert = `INSERT INTO white_list(name,sender, id_number) VALUES (?,?,?)`;
    return query(queryInsert, [name, sender, idNumber]);
};

export const editList = (
    name: string,
    sender: string,
    idNumber: number,
    id: number
) => {
    let editUserQuery = `UPDATE white_list SET name = ?, sender = ?, id_number = ? WHERE id = ?`;

    return query(editUserQuery, [name, sender, idNumber, id]);
};

export const deleteList = (id: string) => {
    let queryDelete = `DELETE FROM white_list WHERE id = ?`;

    return query(queryDelete, [id]);
};