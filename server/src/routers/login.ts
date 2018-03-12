import { KeyManager } from './../keyManager';
import { Database } from './../database';
import { Router, Request, Response, NextFunction } from "express";
import { compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';

const router = Router();

router.post('/', (req: Request, res: Response, next: NextFunction) => {

    Database.getInstance()
    .then((database: Database) => {

        database.connection.collection('users')
        .findOne({ "_id": req.body.email })
        .then((user: any) => {

            compare(req.body.password, user.password)
            .then((match: boolean) => {

                if (match) {

                    const token = sign( user.permissions, KeyManager.instance.getKey(), { expiresIn: '4h' });
                    res.send({ token });

                } else res.status(404).end();

            });

        })
        .catch(reason => res.status(404).end());

    })
    .catch(reason => res.status(404).end());

});

module.exports = router;