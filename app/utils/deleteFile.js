import { unlink } from 'fs/promises'
export const deleteFile = (filePath) =>{

    return  unlink(filePath)

}