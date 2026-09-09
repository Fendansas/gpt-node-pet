
import {TooManyRequestsError} from "../errors/TooManyRequestsError.js";

const attempts = new Map();
const rateLimit = (req, res, next) => {
    let ipAddress = (req.headers['x-forwarded-for'] || '').split(',').pop() ||
        req.headers["x-real-ip"] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;


    const data = attempts.get(ipAddress);

    if (!data) {
        attempts.set(ipAddress, {
            attempts: 1,
            firstAttempt: Date.now()
        })
        next()
    } else {

        if (Date.now() - data.firstAttempt >= 60 * 1000) {

            attempts.set(ipAddress, {
                attempts: 1,
                firstAttempt: Date.now()
            })
            next()
        } else {
            if (data.attempts >= 5) {
                next(new TooManyRequestsError('Too many requests'))
            } else {
                const count = data.attempts + 1
                attempts.set(ipAddress, {
                    attempts: count,
                    firstAttempt: data.firstAttempt
                })
                next()
            }
        }
    }


}

export default rateLimit;