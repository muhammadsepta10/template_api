import { query } from '../../config/baseFunction';

export interface insertMessages {
    media: string,
    rcvdTime: string,
    hp: string,
    message: string,
    direction: number,
    profileId: number,
    type: number
}

export const profileBySender = (sender: string) => {
    return query("SELECT id FROM profiles WHERE sender = ?", [sender])
}

export const getSender = () => {
    return query("SELECT sender FROM profiles", "")
}

export const getGeneralParameter = (id: number) => {
    let syntax = `SELECT description, param FROM general_parameter WHERE id = ? AND status = 1`
    return query(syntax, [id])
}

export const logRequest = (params: insertMessages) => {
    return query("INSERT INTO log_request(media,rcvd_time,hp,message,direction,status,profile_id,type) VALUES(?,?,?,?,?,?,?,?)", [params.media, params.rcvdTime, params.hp, params.message, params.direction, 0, params.profileId, params.type])
}