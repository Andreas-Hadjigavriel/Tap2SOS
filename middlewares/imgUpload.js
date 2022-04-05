/* ------- Middleware for upload image files ------- */

const multer  = require('multer');
const path    = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "--" + file.originalname);
    }
});  

const fileFilter = (req, file, cb) => {
    if((file.mimetype).includes('jpeg') || (file.mimetype).includes('png') || (file.mimetype).includes('jpg')){
        cb(null, true);
    } else{
        cb(null, false);
    }
};

let upload = multer({ 
    storage: storage, 
    fileFilter: fileFilter, 
    limits: { fieldSize: 10 * 1024 * 1024 }
});

module.exports = upload


