import { Database } from './../database';
import { Router, Request, Response, NextFunction } from "express";

const router = Router();

router.get('/', (req: Request, res: Response, next: NextFunction) => {

    Database.getInstance()
    .then((database: Database) => {
        database.connection.collection('employees')
        .find().toArray()
        .then((employees: any[]) => {
            const body: any[] = [];
            for (var i = 0; i < employees.length; i++) {
                if (req.body.perms.isSuperior[employees[i].employeeType] || req.body.perms.employeeID === employees[i]._id) {
                    employees[i].canEdit = req.body.perms.isSuperior[employees[i].employeeType];
                    body.push(employees[i]);
                }
            }
            res.send(body);
        });
    })
    .catch(reason => res.status(404).end());

});

router.post('/:id', (req: Request, res: Response, next: NextFunction) => {
    Database.getInstance()
    .then((database: Database) => {
        database.connection.collection('employees')
        .findOne({_id: Number(req.params.id)})
        .then(oldEmployee => {
            if (!req.body.perms.isSuperior[req.body.employeeType] || !req.body.perms.isSuperior[oldEmployee.employeeType]) {
                res.status(403).end();
            }

            delete req.body.perms;
            database.connection.collection('employees')
            .findOneAndReplace({_id: Number(req.params.id)}, req.body)
            .then(employee => res.end())
        });
    })
    .catch(reason => res.status(404).end());

});

router.get('/types', (req: Request, res: Response, next: NextFunction) => {

    Database.getInstance()
    .then((database: Database) => {
        database.connection.collection('employeeTypes')
        .find().toArray()
        .then((types: any[]) => {
            res.send(types.map((type: any) => {
                type.isSuperior = req.body.perms.isSuperior[type._id];
                return type;
            }));
        });
    })
    .catch(reason => res.status(404).end());

});

module.exports = router;