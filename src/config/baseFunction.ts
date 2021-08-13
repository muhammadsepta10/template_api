const jwt = require("jsonwebtoken");
import moment from "moment"
import { connection, connection2 } from './db';
import * as crypto from "crypto"
const axios = require('axios')
const XLSX = require('xlsx')
const fs = require('fs');
require("dotenv").config();
const ACCESS_TOKEN_SECRET = process.env.SECRET_CODE
const REFRESH_TOKEN_SECRET = process.env.SCRET_CODE_REFRESH
const util = require("util");
const querys = util.promisify(connection.query).bind(connection);
let response: { data: any; error: any } = {
    data: null,
    error: null,
};
let appRoot = require("app-root-path")
// import * as Jimp from "jimp"
// import * as JsBarcode from "jsbarcode";
// import { createCanvas } from "canvas"
// import { logger } from './winston';


export const baseFile = (type: number, filePath: string, base64: string) => {
    return new Promise(async (resolve, reject) => {
        try {
            if ((type != 1 && type != 2) || filePath == "" || filePath == null) {
                return reject({ message: "Parameter not valid", data: { type: type, filePath: filePath, base64: base64 } })
            } else {
                if (type == 1) {
                    // file to base64
                    let buff = await fs.readFileSync(filePath);
                    let base64data = await buff.toString('base64');
                    resolve(base64data)
                } else {
                    // base64 to file
                    let buff = new Buffer(base64, 'base64');
                    fs.writeFileSync(filePath, buff);
                    resolve(filePath)
                }
            }
        } catch (error) {
            reject(error)
        }
    })
}

export const query = (sql: any, args: any) => {
    return new Promise<any>((resolve, reject) => {
        connection.getConnection((err: any, connection: any) => {
            if (err) {
                reject({
                    sql,
                    args,
                    err
                })
            } else {
                connection.query(sql, args, (err: any, rows: any) => {
                    connection.release()
                    if (err) {
                        reject({ sql, args, err });
                    } else {
                        resolve(rows)
                    }
                });
            }
        })
    });
};

export const queryCoupon = (sql: any, args: any) => {
    return new Promise<any>((resolve, reject) => {
        connection2.getConnection((err: any, connection: any) => {
            if (err) {
                reject({
                    sql,
                    args,
                    err
                })
            } else {
                connection.query(sql, args, (err: any, rows: any) => {
                    connection.release()
                    if (err) {
                        reject({ sql, args, err });
                    } else {
                        resolve(rows)
                    }
                });
            }
        })
    });
};

export const subStringNumber = (NO: string) => {
    if (NO == "") {
        return ""
    } else {
        return NO.substring(0, NO.length - 3) + "XXXX"
    }
}

export const pagination = (page: any, row: number, totalRow: number) => {
    return new Promise((resolve, reject) => {
        const dataPerPage = row;
        const totalPage = Math.ceil(totalRow / dataPerPage);
        const currentPage = page == 0 ? 1 : page;
        const firstData = dataPerPage * currentPage - dataPerPage;

        resolve({
            query: `LIMIT ${firstData},${dataPerPage}`,
            dataPerPage: dataPerPage,
            totalPage: totalPage,
            currentPage: currentPage,
            totalData: totalRow,
        });
    });
};

export const monthTranslate = (date: string) => {
    if (date.toUpperCase().search("JANUARY") >= 0) {
        const translated = date.toUpperCase().replace("JANUARY", "JANUARI")
        return translated
    } else if (date.toUpperCase().search("FEBRUARY") >= 0) {
        const translated = date.toUpperCase().replace("FEBRUARY", "FEBRUARI")
        return translated
    } else if (date.toUpperCase().search("MARCH") >= 0) {
        const translated = date.toUpperCase().replace("MARCH", "MARET")
        return translated
    } else if (date.toUpperCase().search("APRIL") >= 0) {
        const translated = date.toUpperCase().replace("APRIL", "APRIL")
        return translated
    } else if (date.toUpperCase().search("MAY") >= 0) {
        const translated = date.toUpperCase().replace("MAY", "MEI")
        return translated
    } else if (date.toUpperCase().search("JUNE") >= 0) {
        const translated = date.toUpperCase().replace("JUNE", "JUNI")
        return translated
    } else if (date.toUpperCase().search("JULY") >= 0) {
        const translated = date.toUpperCase().replace("JULY", "JULI")
        return translated
    } else if (date.toUpperCase().search("AUGUST") >= 0) {
        const translated = date.toUpperCase().replace("AUGUST", "AGUSTUS")
        return translated
    } else if (date.toUpperCase().search("SEPTEMBER") >= 0) {
        const translated = date.toUpperCase().replace("SEPTEMBER", "SEPTEMBER")
        return translated
    } else if (date.toUpperCase().search("OCTOBER") >= 0) {
        const translated = date.toUpperCase().replace("OCTOBER", "OKTOBER")
        return translated
    } else if (date.toUpperCase().search("NOVEMBER") >= 0) {
        const translated = date.toUpperCase().replace("NOVEMBER", "NOVEMBER")
        return translated
    } else if (date.toUpperCase().search("DECEMBER") >= 0) {
        const translated = date.toUpperCase().replace("DECEMBER", "DESEMBER")
        return translated
    } else {
        return date
    }
}

export const validateRequestQuery = (data: any, type: "num" | "char" | "numChar" | "numCharSpace" | "charSpace" | "date" | "datetime" | "any") => {
    let clearData: any = "";
    switch (type) {
        case "num":
            clearData =
                data == undefined ||
                    data == null ||
                    data == "undefined" ||
                    data == "null" ||
                    data == "" ||
                    data == ","
                    ? ""
                    : parseInt(data.toString().replace(/[^0-9\.]+/g, "")) == NaN
                        ? ""
                        : data.toString().replace(/[^0-9\.]+/g, "");
            return clearData;
        case "char":
            clearData =
                data == undefined ||
                    data == null ||
                    data == "undefined" ||
                    data == "null" ||
                    data == "" ||
                    data == ","
                    ? ""
                    : data
                        .toString()
                        .replace(/[^a-z\d\s]+/gi, "")
            return clearData;
        case "numChar":
            clearData =
                data == undefined ||
                    data == null ||
                    data == "undefined" ||
                    data == "null" ||
                    data == "" ||
                    data == ","
                    ? ""
                    : data
                        .toString()
                        .replace(/[\W_]+/g, "")
                        .toUpperCase();
            return clearData;
        case "charSpace":
            clearData =
                data == undefined ||
                    data == null ||
                    data == "undefined" ||
                    data == "null" ||
                    data == "" ||
                    data == ","
                    ? ""
                    : data
                        .toString()
                        .replace(/[^a-zA-Z ]/g, "")
                        .toUpperCase();
            return clearData;
        case "numCharSpace":
            clearData =
                data == undefined ||
                    data == null ||
                    data == "undefined" ||
                    data == "null" ||
                    data == "" ||
                    data == ","
                    ? ""
                    : data
                        .toString()
                        .replace(/[^\w\s]/gi, "")
                        .toUpperCase();
            return clearData;
        case "any":
            clearData =
                data == undefined ||
                    data == null ||
                    data == "undefined" ||
                    data == "null" ||
                    data == "" ||
                    data == ","
                    ? ""
                    : data;
            return clearData;
        case "date":
            clearData =
                data == undefined ||
                    data == null ||
                    data == "undefined" ||
                    data == "null" ||
                    data == "" ||
                    data == "," ||
                    moment(data, "YYYY-MM-DD").format("YYYY-MM-DD").toUpperCase() == "INVALID DATE"
                    ? ""
                    :
                    moment(data, "YYYY-MM-DD").format("YYYY-MM-DD");
            return clearData;
        case "datetime":
            clearData =
                data == undefined ||
                    data == null ||
                    data == "undefined" ||
                    data == "null" ||
                    data == "" ||
                    data == "," ||
                    moment(data).format("YYYY-MM-DD HH:mm:ss").toUpperCase() == "INVALID DATE"
                    ? ""
                    :
                    moment(data).format("YYYY-MM-DD HH:mm:ss");
            return clearData;
        default:
            clearData = null;
            return clearData;
    }
};

export const parsingFormat = (message: string, keyword: string) => {
    return new Promise((resolve, reject) => {
        try {
            // const format = "DETTOL#Name#No KTP#NO HP#City"
            const format = message.split("#")
            const formatKey = format.length < 1 ? "" : validateRequestQuery(format[0], "char")
            const name = format.length < 2 ? "" : validateRequestQuery(format[1], "numCharSpace").substr(0, 100)
            const identity = format.length < 3 ? "" : validateRequestQuery(format[2], "num").substr(0, 20)
            const hp = format.length < 4 ? "" : validateRequestQuery(format[3], "num").substr(0, 20)
            const city = format.length < 5 ? "" : validateRequestQuery(format[4], "charSpace").substr(0, 50)
            if (keyword != formatKey) {
                resolve({
                    success: 0,
                    status: 400,
                    data: {
                        name: "",
                        hp: "",
                        city: "",
                        identity: ""
                    },
                });
            }
            else if (name == "" || hp == "" || city == "" || identity == "") {
                resolve({
                    success: 0,
                    status: 404,
                    data: {
                        name: name,
                        hp: hp,
                        city: city,
                        identity: identity
                    },
                });
            } else {
                resolve({
                    success: 1,
                    status: 200,
                    data: {
                        name: name,
                        hp: hp,
                        city: city,
                        identity: identity
                    },
                });
            }
        } catch (error) {
            reject(error)
        }
    })
};

export const parsingIdentity = (nomorNIK: string) => {
    return new Promise(async (resolve, reject) => {
        try {
            nomorNIK = validateRequestQuery(nomorNIK, "num");
            if (nomorNIK.length == 16) {
                let thisYear = new Date().getFullYear().toString().substr(-2);
                let thisCode = nomorNIK.substr(-4);
                let thisRegion = {
                    provinceCode: nomorNIK.substr(0, 2),
                    regencyCode: nomorNIK.substr(0, 4),
                    districtCode: nomorNIK.substr(0, 6),
                    province: "",
                    regency: "",
                    district: ""
                }
                await query("SELECT name FROM code_district WHERE code = ?", [thisRegion.districtCode]).then(res => { thisRegion.district = res.length < 1 ? "" : res[0].name })
                await query("SELECT name FROM code_regency WHERE code = ?", [thisRegion.regencyCode]).then(res => { thisRegion.regency = res.length < 1 ? "" : res[0].name })
                await query("SELECT name FROM code_province WHERE code = ?", [thisRegion.provinceCode]).then(res => { thisRegion.province = res.length < 1 ? "" : res[0].name })
                let thisDate = {
                    hari: (parseInt(nomorNIK.substr(6, 2)) > 40) ? parseInt(nomorNIK.substr(6, 2)) - 40 : nomorNIK.substr(6, 2),
                    bulan: nomorNIK.substr(8, 2),
                    tahun: (parseInt(nomorNIK.substr(10, 2)) > 1 && nomorNIK.substr(10, 2) < thisYear) ? "20" + nomorNIK.substr(10, 2) : "19" + nomorNIK.substr(10, 2),
                    lahir: "",
                    age: "",
                    gender: (parseInt(nomorNIK.substr(6, 2)) > 40) ? "F" : parseInt(nomorNIK.substr(6, 2)) < 40 ? "M" : ""
                }
                thisDate.lahir = `${thisDate.tahun}-${thisDate.bulan}-${thisDate.hari}`
                thisDate.age = validateRequestQuery(moment(thisDate.lahir).fromNow(), "num")
                return resolve({
                    nik: nomorNIK,
                    region: thisRegion,
                    date: thisDate,
                    uniq: thisCode,
                    _link: {
                        _wilayah: 'http://www.kemendagri.go.id/pages/data-wilayah'
                    }
                })
            } else {
                throw new Error(`Nomor NIK harus 16 digit`);
            }
        } catch (error) {
            reject(error)
        }
    })
}

export const checkOperator = (hp: string) => {
    const no = vlaidateHp(hp)
    const subStringHp = no.substring(0, 4);
    if (
        subStringHp == "0859" ||
        subStringHp == "0877" ||
        subStringHp == "0878" ||
        subStringHp == "0817" ||
        subStringHp == "0818" ||
        subStringHp == "0819"
    ) {
        return Promise.resolve("xld");
    } else if (
        subStringHp == "0811" ||
        subStringHp == "0812" ||
        subStringHp == "0813" ||
        subStringHp == "0821" ||
        subStringHp == "0822" ||
        subStringHp == "0823" ||
        subStringHp == "0852" ||
        subStringHp == "0853" ||
        subStringHp == "0851"
    ) {
        return Promise.resolve("htelkomsel");
    } else if (
        subStringHp == "0898" ||
        subStringHp == "0899" ||
        subStringHp == "0895" ||
        subStringHp == "0896" ||
        subStringHp == "0897"
    ) {
        return Promise.resolve("hthree");
    } else if (
        subStringHp == "0814" ||
        subStringHp == "0815" ||
        subStringHp == "0816" ||
        subStringHp == "0855" ||
        subStringHp == "0856" ||
        subStringHp == "0857" ||
        subStringHp == "0858"
    ) {
        return Promise.resolve("hindosat");
    } else if (
        subStringHp == "0889" ||
        subStringHp == "0881" ||
        subStringHp == "0882" ||
        subStringHp == "0883" ||
        subStringHp == "0886" ||
        subStringHp == "0887" ||
        subStringHp == "0888" ||
        subStringHp == "0884" ||
        subStringHp == "0885"
    ) {
        return Promise.resolve("pulsa");
    } else if (
        subStringHp == "0832" ||
        subStringHp == "0833" ||
        subStringHp == "0838" ||
        subStringHp == "0831"
    ) {
        return Promise.resolve("haxis");
    } else {
        return Promise.resolve("");
    }
};

export const randomString = async (length: number, chars: string, frontText: string) => {
    var result = `${frontText}`;
    const rand = (char: string) => {
        let result = ``
        for (var i = char.length + frontText.length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
        return result;
    }
    const afterRand: string = frontText + await rand(chars)
    for (var i = length - (frontText.length); i > 0; --i) result += afterRand[Math.floor(Math.random() * afterRand.length)];
    return result;
}

export const signAccessToken = (id: number, role: number) => {
    return new Promise(async (resolve, reject) => {
        try {
            const authToken = await jwt.sign({ id: id, role: role }, ACCESS_TOKEN_SECRET, { expiresIn: "7d" });
            resolve(authToken)
        } catch (err) {
            reject(err)
        }
    })
}

export const signRefresToken = (id: number, role: number) => {
    return new Promise(async (resolve, reject) => {
        try {
            const token = await jwt.sign({ id: id, role: role }, REFRESH_TOKEN_SECRET, { expiresIn: "30d" });
            resolve(token)
        } catch (err) {
            reject(err)
        }
    })
}

export const md5Hash = (data: string) => {
    const hash = crypto.createHash('md5').update(data).digest("hex");
    return hash
}

export const axiosGet = (url: string, header: any) => {
    return new Promise((resolve, reject) => {
        axios.get(url, { headers: header }).then((res: any) => {
            if (res.status.toString().substring(0, 2) == "20") {
                resolve(res.data)
            } else {
                reject(res.data)
            }
        }).catch((err: any) => {
            reject(err)
        })
    })
}

export const axiosPost = (url: string, body: any, header: any) => {
    return new Promise((resolve, reject) => {
        axios.post(url, body, { headers: header }).then((res: any) => {
            if (res.status.toString().substring(0, 2) == "20") {
                resolve(res.data)
            } else {
                reject(res.data)
            }
        }).catch((err: any) => {
            reject(err)
        })
    })
}

export const vlaidateHp = (hp: string) => {
    if (hp == "") {
        return ""
    } else {
        if (hp.substring(0, 1) == "0") {
            return hp
        } else {
            return `0${hp.substring(2)}`
        }
    }
}

export const download = (url: string, path: string, fileName: string) => {
    return new Promise((resolve, reject) => {
        const realPath = `${appRoot}/../public/${path}/`
        if (!fs.existsSync(realPath)) {
            fs.mkdirSync(realPath, { recursive: true }, (err: any) => { reject(err) });
        }
        return axios({
            method: "get",
            url: url,
            responseType: "stream"
        }).then(async (res: any) => {
            res.data.pipe(fs.createWriteStream(realPath + fileName))
            resolve({ success: 1 })
        }).catch(function (err: any) {
            resolve({ success: 0, url: url, err })
        })
    })
}

export const loadExcel = (file: string) => {
    return new Promise((resolve, reject) => {
        var wb = XLSX.readFile(file);
        const data: any = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { header: 1 });
        let jsonData: any = []
        for (let index = 0; index < data.length; index++) {
            let obj: any = {}
            for (let index2 = 0; index2 < data[index].length; index2++) {
                obj[data[0][index2].replace(/\s/g, '')] = data[index][index2]
            }
            if (index > 0) {
                jsonData.push(obj)
            }
        }
        resolve(jsonData)
    })
}

// export function generateCoupon(images: string, text: any, left: number, top: number, movement: string, path: string, filename: string, moveAddVer: number, moveAddHor: number, fontType: string, max: number, name: string, ktp: string, hp: string, nameLeft: number, nameTop: number, hpLeft: number, hpTop: number, ktpLeft: number, ktpTop: number) {
//   return new Promise(async (resolve, reject) => {
//     try {
//       const font = await Jimp.loadFont(`${appRoot}/${fontType}`);
//       const image = await Jimp.read(images);
//       let index;
//       let loopMax = 0
//       for (index = 0; index < text.length; index++) {
//         let line = index % max
//         if (index >= max && line == 0) {

//           loopMax = loopMax + 1
//         }
//         const leftMove = left + (movement === "horizontal" && line != 0 ? moveAddHor * line : movement == "vertical" && index >= max ? moveAddHor * loopMax : 0)
//         const topMove = top + (movement === "vertical" && line != 0 ? moveAddVer * line : movement == "horizontal" && index >= max ? moveAddVer * loopMax : 0)
//         await image.print(font, leftMove, topMove, text[index]);
//       }
//       await image.print(font, nameLeft, nameTop, name)
//       await image.print(font, ktpLeft, ktpTop, ktp)
//       await image.print(font, hpLeft, hpTop, hp)
//       await image.writeAsync(`${path}/${filename}`);
//     } catch (error) {
//       reject(error)
//     } finally {
//       resolve(`${path}/${filename}`)
//     }
//   })
// }

// export const generateBarcode = (code: string) => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       var canvas = await createCanvas(100, 100);
//       await JsBarcode(canvas, code, {
//         displayValue: false
//       })
//       const dataBuffer = await canvas.toBuffer()
//       resolve(dataBuffer)
//     } catch (error) {
//       reject(error)
//     }
//   })
// }

// export const generateFotoVoucher = (voucher: string, expiredDate: string, urlLocation: string) => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       const fontVoucher = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);
//       const fontDate = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE)
//       const realBarcode: any = await generateBarcode(voucher)
//       const image = await Jimp.read(`${appRoot}/template/template.jpg`)
//       const barcode = await Jimp.read(realBarcode)
//       await image.print(fontVoucher, 340 - (voucher.length * 10), 517, voucher)
//       await image.print(fontDate, 280, 585, expiredDate)
//       await barcode.resize(410, 82)
//       await image.composite(barcode, 115, 409, {
//         mode: Jimp.BLEND_SOURCE_OVER,
//         opacityDest: 1,
//         opacitySource: 1
//       })
//       const path = `voucher/${moment().format("YYYY-MM-DD_HH.mm.ss")}/${voucher}.png`
//       const filename = `${appRoot}/../public/${path}`
//       const url = `${urlLocation}/${path}`
//       await image.writeAsync(filename)
//       resolve(url)
//     } catch (error) {
//       reject(error)
//     }
//   })
// }

export const thisLine = () => {
    const e: any = new Error();
    const regex = /\((.*):(\d+):(\d+)\)$/
    const match: any = regex.exec(e.stack.split("\n")[2]);
    return {
        filepath: match[1],
        line: match[2],
        column: match[3]
    };
}

export const errorHandle = (req: any, res: any, message: string, locate: string, data: any, status: number) => {
    const clientRequest = {
        body: req.body,
        params: req.params,
        headers: req.headers,
        ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
        domain: req.headers.host + req.originalUrl
    }
    return res.status(status).send({ message: message, data: {} })
}

export const responseHandle = (req: any, res: any, message: string, locate: string, data: any, status: number) => {
    const clientRequest = {
        body: req.body,
        params: req.params,
        headers: req.headers,
        ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
        domain: req.headers.host + req.originalUrl
    }
    return res.status(status).send({ message: message, data: data })
}

export const checkExtension = (filename: string) => {
    switch ((((filename.split("."))[filename.toString().split(".").length - 1]).toUpperCase())) {
        case "JPG":
            return "JPG"
            break;
        case "JPEG":
            return "JPEG"
            break;
        case "PNG":
            return "PNG"
            break;
        case "GIF":
            return "GIF"
            break;
        case "TIFF":
            return "TIFF"
            break;
        case "PSD":
            return "PSD"
            break;
        case "PDF":
            return "PDF"
            break;
        case "EPS":
            return "EPS"
            break;
        case "AI":
            return "AI"
            break;
        case "INDD":
            return "INDD"
            break;
        case "RAW":
            return "RAW"
            break;
        default:
            return ""
            break;
    }
}