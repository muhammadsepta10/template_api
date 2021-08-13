import { query } from "../../config/baseFunction"

export const getWinner = (id: number) => {
    const getWinner = `SELECT allocation_id,winners.id as winnerId, prizes.nominal, winners.account_number,counting,topup_by FROM winners LEFT JOIN prizes on winners.prize_id = prizes.id WHERE winners.id = ?`
    return query(getWinner, [id])
}

export const resetAllocation = (id: number) => {
    return query("UPDATE allocations SET is_used = 0, used_date = null WHERE id = ?", [id])
}

export const updateStatusWinner = (id: number, status: number,userId:number) => {
    return query("UPDATE winners SET status = ?, topup_by = ? WHERE id = ?", [status,userId, id])
}

export const rejectWinner = (id:number,status:number,userId:number)=>{
    return query("UPDATE winners SET status = ?, approved_by = ? WHERE id = ?", [status,userId, id])
}

export const approveWinner = (id:number,userId:number)=>{
    return query("UPDATE winners SET approved_by = ? WHERE id = ?", [userId, id])
}

export const checkAccountNumber = (accountNumber:string)=>{
    return query("SELECT COUNT(1) counts FROM winners WHERE account_number = ?",[accountNumber])
}

export const generalParameter = ()=>{
    return query("SELECT * FROM general_parameter WHERE status = ?",[1])
}