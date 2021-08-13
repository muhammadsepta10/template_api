import { connection } from '../../config/db';
const util = require("util");
const query = util.promisify(connection.query).bind(connection);

interface Type {
    limitQuery: string;
    key: string;
    column: string;
    direction: string;
}


// export const userList = () => {
//     return query("SELECT * FROM users")
// }

const keyWhere = (key: string) => {
    if (key == "") {
        return "";
    } else {
        return ` AND (username LIKE "%${key}%" OR fullname LIKE "%${key}%" OR info LIKE "%${key}%")`;
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
    let listEntriesQuery = `SELECT id, username, fullname, level_code, info FROM users left join (select info, code from user_level) user_level on users.level_code=user_level.code where is_enabled = 1${keyWhere(params.key)}${orderBy(params.direction, params.column)} ${params.limitQuery}`;

    return query(listEntriesQuery, url);
}

export const countUsers = () => {
    return query("SELECT COUNT(*) AS counts FROM users where is_enabled = 1")
}

export const userByid = (id: number) => {
    let queryUserbyId = `SELECT * FROM users WHERE users.id = ?`;

    return query(queryUserbyId, id);
};

export const listLevel = () => {
    return query("SELECT id, data, info, code FROM user_level")
}

export const searchUser = (username: string, id: number, type: string) => {
    let edit = `SELECT COUNT(*) AS counts FROM users WHERE username=? AND id!=?`;
    let insert = `SELECT * FROM users WHERE username= ?`;
    if (type == "edit") {
        return query(edit, [username, id]);
    } else {
        return query(insert, username);
    }
};

export const insertUser = (
    username: string,
    password: string,
    fullname: string,
    level_code: number
) => {
    let queryInsert = `INSERT INTO users(username,password,fullname,level_code) VALUES (?,?,?,?)`;
    return query(queryInsert, [username, password, fullname, level_code]);
};

export const editUser = (
    username: string,
    password: string,
    fullname: string,
    level_code: number,
    id: number
) => {
    let editUserQuery = `UPDATE users SET username = ?, password = ?, fullname = ?,  level_code = ? WHERE id = ?`;

    return query(editUserQuery, [username, password, fullname, level_code, id]);
};

export const deleteUser = (id: string) => {
    let queryDelete = `UPDATE users SET is_enabled= 0 WHERE id = ?`;

    return query(queryDelete, [id]);
};

export const insertLevel = (code: string, name: string, codeName: string, sort: number) => {
    return query("INSERT INTO user_level(code,data,info,sort,is_enabled) VALUES(?,?,?,?,1)", [code, codeName, name, sort])
}