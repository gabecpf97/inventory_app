const Type = require('../models/type');
const Car = require('../models/car');
const { body, validationResult} = require('express-validator');
const async = require('async');

exports.type_list = (req, res, next) => {
    Type.find({}).exec((err, list_types) => {
        if (err)
            return next(err);
        res.render('index', {title: 'All types', page: './type_list',
                            content: {
                                title: 'Types in Inventory',
                                type_list: list_types,
                            }})
    });
}

exports.type_detail = (req, res, next) => {
    async.parallel({
        type: (callback) => {
            Type.findById(req.params.id).exec(callback);
        },
        cars: (callback) => {
            Car.find({'type': req.params.id}).populate('maker')
            .exec(callback);
        }
    }, (err, results) => {
        if (err)
            return next(err);
        if (results.type === null) {
            const err = new Error('No such Type');
            err.status = 404;
            return next(err);
        }
        res.render('index', {title: results.type.name, page: './type_detail',
                            content: {
                                type: results.type,
                                cars: results.cars
                            }});
    });
}

exports.type_create_get = (req, res, next) => {
    res.render('index', {title: 'Create Type', page: './type_form',
                        content: {title: 'Create Type'}});
}

exports.type_create_post = [
    body('name', "Name must not be empty").trim().isLength({min: 1}).escape(),
    body('description', 'Description must not be empty').trim().isLength({min: 1}).escape(),
    (req, res, next) => {
        const errors = validationResult(req);
        const type = new Type({
            name: req.body.name,
            description: req.body.description
        })
        if (!errors.isEmpty()) {
            res.render('index', {title: 'Create Type', page: './type_form',
                                content: {title: 'Create Type'}});
            return;
        } else {
            type.save((err) => {
                if (err)
                    return next(err);
                res.redirect(type.url);
            })
        }
    }
]

exports.type_delete_get = (req, res, next) => {
    Type.findById(req.params.id).exec((err, theType) => {
        if (err)
            return next(err);
        if (theType === null) {
            res.redirect('/types');
        } else {
            res.render('index', {title: 'Delete Type', page: './type_delete', 
                                content: {type: theType}});
        };
    });
}

exports.type_delete_post = (req, res, next) => {
    if (req.body.status !== 'admin5678') {
        res.redirect('/type/' + req.params.id);
        return;
    };
    Type.findById(req.params.id).exec((err, theType) => {
        if (err)
            return next(err);
        Type.findByIdAndRemove(req.body.typeid, (err) => {
            if (err)
                return next(err);
            res.redirect('/types');
        });
    });
}

exports.type_update_get = (req, res, next) => {
    Type.findById(req.params.id).exec((err, theType) => {
        if (err)
            return next(err);
        if (theType === null) {
            const err = new Error('No such Type');
            err.status = 404;
            return next(err);
        } else {
            res.render('index', {title: 'Update Type', page: './type_form',
                                content: {
                                    title: 'Update Type',
                                    type: theType
                                }});
        }
    });
}

exports.type_update_post = [
    body('name', "Name must not be empty").trim().isLength({min: 1}).escape(),
    body('description', 'Description must not be empty').trim().isLength({min: 1}).escape(),
    (req, res, next) => {
        const errors = validationResult(req);
        const type = new Type({
            name: req.body.name,
            description: req.body.description,
            _id: req.params.id
        });
        if (req.body.status !== 'admin5678') {
            res.redirect('/type/' + req.params.id);
            return;
        };
        if (!errors.isEmpty()) {
            res.render('index', {title: 'Create Type', page: './type_form',
                                content: {
                                    title: 'Create Type',
                                    type: type,
                                    errors: errors,
                                }});
            return;
        } else {
            Type.findByIdAndUpdate(req.params.id, type, {}, (err, theType) => {
                if (err)
                    return next(err);
                res.redirect(theType.url);
            })
        }
    }
]