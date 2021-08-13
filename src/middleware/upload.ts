import multer from "multer"
const appRoot = require("app-root-path")
const path = require("path")
const storage = multer.diskStorage({
    destination: (req: any, file: any, cb: any) => {
        cb(null, `${appRoot}/../public/`);
    },
    filename: function (req: any, file: any, cb: any) {
        const files: string = (file.originalname).replace(/\s/g, "");
        cb(null, + Date.now() + files);
    }
});

//check file type
function checkFileType(file: any, cb: any) {
    const filetypes = /xls|xlsx|csv|vnd.openxmlformats-officedocument.spreadsheetml.sheet|vnd.ms-excel/; //alowed ext
    //check ext
    const extname = filetypes.test(path.extname((file.originalname).replace(/\s/g, "")).toLowerCase());
    //check mime
    const mimetype = filetypes.test(file.mimetype);

    //check if ext is true
    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error("Extension Suport XLS/XLSX/CSV"));
    }
}

//init upload
export const upload: any = multer({
    storage: storage, //get from variable name at storage engine
    limits: { fileSize: 20 * 1024 * 1024 * 1024 }, //ex : limit 200MB
    fileFilter: function (req: any, file: any, cb: any) {
        checkFileType(file, cb);
    }
});
