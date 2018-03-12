import { KeyManager } from './../keyManager';
import { Request, Response, NextFunction } from "express";
import { JsonWebTokenError, NotBeforeError, TokenExpiredError, verify } from "jsonwebtoken";

export const tokenVerify = (req: Request, res: Response, next: NextFunction) => {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    console.log(token);
    console.log(req.headers['x-access-token']);

    if (token) {
        verify(token, KeyManager.instance.getKey(), (err : JsonWebTokenError | NotBeforeError | TokenExpiredError, decoded: object | string) => {
            console.log(err, decoded);
            if (err) res.status(403).end();
            else {
                req.body.perms = decoded;
                next();  
            } 
        });
    } else res.status(403).end();
}