const Car = require('../models/car');
const Maker = require('../models/maker');
const Type = require('../models/type');
const { body, validationResult } = require('express-validator');
const async = require('async');

exports.index = (req, res) => {
    res.render('index', {
        title: 'Car Inventory', 
        page: './home', 
        content: {title: "Car Inventory"}
    });
}

exports.car_list = (req, res, next) => {
    Car.find({}, 'name maker type number_in_stock')
    .sort({name: 1})
    .populate('maker').populate('type')
    .exec((err, list_car) => {
        if (err)
            return next(err);
        res.render('index', {
            title: "All Cars",
            page: './car_list',
            content: {
                title: 'All Cars',
                car_list: list_car
            }
        })
    });
}

exports.car_detail = (req, res, next) => {
    Car.findById(req.params.id).populate('maker').populate('type')
    .exec((err, theCar) => {
        if (err)
            return next(err);
        if (theCar === null) {
            const err = new Error('No such Car in Inventory');
            err.status = 404;
            return next(err);
        }
        res.render('index', {title: theCar.name, 
                    page: 'car_detail',
                    content: {
                        title: theCar.name,
                        car: theCar
                    }});
    });
}

exports.car_create_get = (req, res, next) => {
    async.parallel({
        makers: (callback) => {
            Maker.find(callback);
        },
        types: (callback) => {
            Type.find(callback);
        }
    }, (err, results) => {
        if (err)
            return next(err);
        res.render('index', {
            title: "Create Car",
            page: './car_form',
            content: {
                title: 'Create Car',
                all_maker: results.makers,
                all_type: results.types
            }
        });
    });
}

exports.car_create_post = [
    body('name', 'Name must not be empty.').trim().isLength({min: 1}).escape(),
    body('price', 'Price must not be empty.').trim().isLength({min: 1}).escape(),
    body('description', 'Description must not be empty.').trim().isLength({min: 1}).escape(),
    body('release_year', 'Released Year must not be empty.').trim().isLength({min: 1}).escape(),
    body('number_in_stock', 'Number in stock must not be empty.').trim().isLength({min: 1}).escape(),
    (req, res, next) => {
        const errors = validationResult(req);
        const car = new Car(
            {
                name: req.body.name,
                maker: req.body.maker,
                type: req.body.type,
                price: req.body.price,
                description: req.body.description,
                release_year: req.body.release_year,
                number_in_stock: req.body.number_in_stock
            }
            )
            if (!errors.isEmpty()) {
                async.parallel({
                    maker: (callback) => {
                        Maker.find(callback);
                    },
                    type: (callback) => {
                        Type.find(callback);
                    },
                }, (err, results) => {
                    res.render('index', {
                        title: 'Create Car',
                        page: './car_form',
                        content: {
                            title: 'Create Car',
                            all_maker: results.maker,
                            all_type: results.type
                        }
                    });
                });
                return;
            } else {
                car.save((err) => {
                    if (err)
                    return next(err);
                    res.redirect(car.url);
                })
        }
    }
]

exports.car_delete_get = (req, res, next) => {
    Car.findById(req.params.id).populate('maker').populate('type')
    .exec((err, theCar) => {
        if (err)
            return next(err);
        if (theCar === null)
            res.redirect('/cars');
        res.render('index', {title: 'Delete Car', page: './car_delete', 
                            content:{
                                title: 'Delete Car',
                                car: theCar,
                            }});
    })
}

exports.car_delete_post = (req, res, next) => {
    Car.findById(req.params.id)
    .exec((err, theCar) => {
        if (err)
        return next(err);
        Car.findByIdAndRemove(req.body.carid, (err) => {
            if (err)
            return next(err);
            res.redirect('/cars');
        });
    })
}

exports.car_update_get = (req, res, next) => {
    async.parallel({
        car: (callback) => {
            Car.findById(req.params.id).populate('maker').populate('type')
            .exec(callback);
        },
        maker: (callback) => {
            Maker.find(callback);
        },
        type: (callback) => {
            Type.find(callback);
        }
    }, (err, results) => {
        if (err)
        return next(err);
        if (results.car === null) {
            const err = new Error('No such car');
            err.status = 404;
            return next(err);
        }
        res.render('index', {title: 'Update Car', page:'./car_form', 
        content: {
            title: 'Update Car',
            car: results.car,
            all_maker: results.maker,
            all_type: results.type
        }});
    });
}

exports.car_update_post = [
    body('name', 'Name must not be empty.').trim().isLength({min: 1}).escape(),
    body('price', 'Price must not be empty.').trim().isLength({min: 1}).escape(),
    body('description', 'Description must not be empty.').trim().isLength({min: 1}).escape(),
    body('release_year', 'Released Year must not be empty.').trim().isLength({min: 1}).escape(),
    body('number_in_stock', 'Number in stock must not be empty.').trim().isLength({min: 1}).escape(),
    (req, res, next) => {
        const errors = validationResult(req);
        const car = new Car(
            {
                name: req.body.name,
                maker: req.body.maker,
                type: req.body.type,
                price: req.body.price,
                description: req.body.description,
                release_year: req.body.release_year,
                number_in_stock: req.body.number_in_stock,
                _id:req.params.id
            }
        );
        if (req.body.picture !== '')
            car.picture = req.body.picture;
        if (!errors.isEmpty()) {
            async.parallel({
                maker: (callback) => {
                    Maker.find(callback);
                },
                type: (callback) => {
                    Type.find(callback);
                },
            }, (err, results) => {
                res.render('index', {
                    title: 'Create Car',
                    page: './car_form',
                    content: {
                        title: 'Create Car',
                        all_maker: results.maker,
                        all_type: results.type,
                        car: car,
                    }
                });
            });
            return;
        } else {
            Car.findByIdAndUpdate(req.params.id, car, {}, (err, theCar) => {
                if (err)
                    return next(err);
                res.redirect(theCar.url);
            })
        }
    }
]