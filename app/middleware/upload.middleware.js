import multer from 'multer';

const upload = multer({
    dest: 'uploads/',
    limits:{
        fileSize: 5*1024*1024
    },
    fileFilter:(req, file, cb)=>{
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
            cb(null, true)
        } else {
            cb(new Error('Недопустимый формат файла. Разрешены только JPEG и PNG'))
        }
    }
})

export default upload