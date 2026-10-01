import {fileTypeFromFile} from 'file-type';
import {BadRequestError} from "../errors/BadRequestError.js";
import {deleteFile} from "../utils/deleteFile.js";
const fileType = async (req, res, next) => {


    const format = await fileTypeFromFile(req.file.path)

    if (!format){

        try {
            await deleteFile(req.file.path);
        } catch (error) {
            console.error('Не удалось удалить файл:', error);
        }
        return  next( new BadRequestError('Недопустимый формат файла. Разрешены только JPEG и PNG'))

    }
    if (
        (format.ext === 'png' && format.mime === 'image/png') ||
        (format.ext === 'jpg' && format.mime === 'image/jpeg')
    ){
        return next();
    } else {
        try {
            await deleteFile(req.file.path);
        } catch (error) {
            console.error('Не удалось удалить файл:', error);
        }
        return  next( new BadRequestError('Недопустимый формат файла. Разрешены только JPEG и PNG'))
    }


}
export default fileType;

