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
                    body.push({_id: employees[i]._id, firstName: employees[i].firstName, lastName: employees[i].lastName, active: employees[i].active});
                }
            }
            res.send(body);
        })
        .catch(reason => res.status(404).end());
    })
    .catch(reason => res.status(404).end());

});

router.get('/nextCode', (req: Request, res: Response, next: NextFunction) => {

    Database.getInstance()
    .then((database: Database) => {
        database.connection.collection('employees')
        .find().toArray()
        .then((employees: any[]) => {
            let next = -1;
            employees.forEach((employee: any) => {
                if (employee._id >= next) {
                    next = employee._id + 1;
                }
            });
            res.send({next: next});
        })
        .catch(reason => res.status(404).end());
    })
    .catch(reason => res.status(404).end());

});

router.get('/:id', (req: Request, res: Response, next: NextFunction) => {
    Database.getInstance()
    .then((database: Database) => {
        database.connection.collection('employees')
        .findOne({_id: Number(req.params.id)})
        .then(employee => {
            if (req.body.perms.isSuperior[employee.employeeType] || req.body.perms.employeeID === employee._id) {
                employee.canEdit = req.body.perms.isSuperior[employee.employeeType];
                res.send(employee);
            } else {
                res.status(403).end();
            }
        })
        .catch(reason => res.status(404).end());
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
            } else {
                delete req.body.perms;
                delete req.body.canEdit;
                database.connection.collection('employees')
                .findOneAndUpdate({_id: Number(req.params.id)}, req.body)
                .then(employee => res.end())
                .catch(reason => res.status(404).end());
            }
        })
        .catch(reason => res.status(404).end());
    })
    .catch(reason => res.status(404).end());

});

router.put('/:id', (req: Request, res: Response, next: NextFunction) => {
    Database.getInstance()
    .then((database: Database) => {
        database.connection.collection('employees')
        .findOne({_id: Number(req.params.id)})
        .then(found => {
            if (found) {
                res.status(404).end();
                return;
            }
            
            if (!req.body.perms.isSuperior[req.body.employeeType]) {
                res.status(403).end();
                return;
            }

            delete req.body.perms;
            database.connection.collection('employees')
            .insertOne(req.body)
            .then(response => {
                req.body.canEdit = true;
                res.send(req.body);
            })
            .catch(err => res.status(404).end())
        })
        .catch(reason => res.status(404).end());
    })
    .catch(reason => res.status(404).end());

});

module.exports = router;