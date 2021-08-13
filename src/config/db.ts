const mysql = require("mysql2");
import { config } from "dotenv"
config()

export const connection = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    multipleStatements: true,
});
connection.getConnection((err: any, connection: any) => {
    if (err) {
        if (err.code === "PROTOCOL_CONNECTION_LOST") {
            console.error(`Database ${process.env.DB_NAME} connection was closed.`);
        }
        if (err.code === "ER_CON_COUNT_ERROR") {
            console.error(`Database ${process.env.DB_NAME} has too many connections.`);
        }
        if (err.code === "ECONNREFUSED") {
            console.error(`Database ${process.env.DB_NAME} connection was refused.`);
        } else {
            console.error(`Database ${process.env.DB_NAME} ${err.code}.`);
        }
    }
    if (connection) {
        console.log(`database ${process.env.DB_NAME} connected`);
        connection.release();
    }
    return;
});

export const connection2 = mysql.createPool({
    host: process.env.DB_HOST2,
    user: process.env.DB_USER2,
    password: process.env.DB_PASS2,
    database: process.env.DB_NAME2,
    multipleStatements: true,
});
connection2.getConnection((err: any, connection: any) => {
    if (err) {
        if (err.code === "PROTOCOL_CONNECTION_LOST") {
            console.error(`Database ${process.env.DB_NAME2} connection was closed.`);
        }
        if (err.code === "ER_CON_COUNT_ERROR") {
            console.error(`Database ${process.env.DB_NAME2} has too many connections.`);
        }
        if (err.code === "ECONNREFUSED") {
            console.error(`Database ${process.env.DB_NAME2} connection was refused.`);
        } else {
            console.error(`Database ${process.env.DB_NAME2} ${err.code}.`);
        }
    }
    if (connection) {
        console.log(`database ${process.env.DB_NAME2} connected`);
        connection.release();
    }
    return;
});