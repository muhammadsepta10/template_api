import { connection } from '../../config/db'
const util = require("util");
const query = util.promisify(connection.query).bind(connection);

interface Type {
    startDate: any;
    endDate: any;
}

const dateWhere = (startDate: any, endDate: any) => {
    if (startDate == "" || endDate == "") {
        return "";
    } else {
        return ` AND (DATE(attachments.rcvd_time)>="${startDate}" AND DATE(attachments.rcvd_time)<="${endDate}")`;
    }
};

export const getAttachment = (sender: number, params: Type) => {
    return query(`SELECT rcvd_time, id, sender, url FROM attachments WHERE sender = ? ${dateWhere(params.startDate, params.endDate)}`, [sender])
}

export const chooseAttachment = (attId: number, id: number) => {
    return query(`UPDATE entries SET attachment_id = ? WHERE id = ?`, [attId, id])
}