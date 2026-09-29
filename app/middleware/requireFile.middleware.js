import {BadRequestError} from "../errors/BadRequestError.js";



const requireFile =(req, res, next)=>{

    if (!req.file){
        return next(new BadRequestError('Bad request'));
    }
    next();
}
export default requireFile;