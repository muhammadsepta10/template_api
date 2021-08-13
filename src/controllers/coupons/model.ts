import { queryCoupon } from '../../config/baseFunction';

export const insertCoupons = (coupon: string) => {
    return queryCoupon("INSERT INTO coupons(code) VALUES(?)", [coupon])
}


export const checkCoupon = (coupon: string) => {
    return queryCoupon("SELECT id,code coupon,(CASE status WHEN 1 THEN 'Sudah Digunakan' ELSE 'Belum Digunakan' END) status,DATE_FORMAT(used_date,'%d %M %Y %H:%i:%S') AS used_date,serial_number FROM coupons WHERE code = ? OR serial_number = ?", [coupon, coupon])
}
