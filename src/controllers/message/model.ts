import { query } from "../../config/baseFunction";

export const getmessageprofile = () => {
    let getprofile = `SELECT message.*, profiles.name as name from message join profiles on message.profile_id = profiles.id where message_read = 0 group by profile_id`;

    return query(getprofile, "");
};