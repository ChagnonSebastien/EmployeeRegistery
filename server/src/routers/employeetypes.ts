import { Database } from './../database';
import { Router, Request, Response, NextFunction } from "express";

const router = Router();

router.get('/', (req: Request, res: Response, next: NextFunction) => {

    Database.getInstance()
    .then((database: Database) => {
        database.connection.collection('employeeTypes')
        .find().toArray()
        .then((types: any[]) => {
            res.send(types.map((type: any) => {
                type.isSuperior = req.body.perms.isSuperior[type._id];
                return type;
            }));
        })
        .catch(reason => res.status(404).end());
    })
    .catch(reason => res.status(404).end());

});

module.exports = router;