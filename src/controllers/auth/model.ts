import { query } from "../../config/baseFunction"


export const login = (username: string) => {
    let queryLogin = `SELECT id, username, password, level_code FROM users WHERE username = ?`;

    return query(queryLogin, username);
};

export const detailUser = (id: number) => {
    let queryDetailUser = `SELECT username, fullname, data, info, level_code AS level FROM users JOIN user_level ON (users.level_code = user_level.code) WHERE users.id = ?`;

    return query(queryDetailUser, id);
};