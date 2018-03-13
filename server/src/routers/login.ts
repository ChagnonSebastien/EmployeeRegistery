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
                    database.connection.collection('employees')
                    .findOne({ "_id": user.employeeID })
                    .then((employee: any) => {
                        database.connection.collection('employeeTypes')
                        .findOne({ "_id": employee.employeeType })
                        .then((employeeType: any) => {
                            employeeType.employeeID = user.employeeID;
                            const token = sign( employeeType, KeyManager.instance.getKey(), { expiresIn: '4h' });
                            res.send({ token });
                        })
                        .catch(reason => res.status(404).end())
                    })
                    .catch(reason => res.status(404).end())
                } else res.status(404).end();
            })
            .catch(reason => res.status(404).end());
        })
        .catch(reason => res.status(404).end());
    })
    .catch(reason => res.status(404).end());

});

module.exports = router;