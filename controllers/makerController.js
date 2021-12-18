const Maker = require('../models/maker');
const Car = require('../models/car');
const Image = require('../models/image');
const { body, validationResult} = require('express-validator');
const async = require('async');
const fs = require('fs');
const path = require('path');

exports.maker_list = (req, res, next) => {
    Maker.find({}, 'name established_year').sort({name: 1})
    .exec((err, list_maker) => {
        if (err)
            return next(err);
        res.render('index', {title: 'All Makers', page: './maker_list', 
                    content: {
                        title: 'All Makers',
                        maker_list: list_maker, 
                    }});
    });
}

exports.maker_detail = (req, res, next) => {
    async.parallel({
        maker: (callback) => {
            Maker.findById(req.params.id).populate('logo').exec(callback);
        },
        cars: (callback) => {
            Car.find({'maker': req.params.id}).populate('type').populate('maker')
            .exec(callback);
        }
    }, (err, results) => {
        if (err)
            return next(er);
        if (results.maker === null) {
            const err = new Error('No such maker');
            err.status = 404;
            return next(err);
        }
        res.render('index', {title: results.maker.name, page: './maker_detail',
                    content: {
                        maker: results.maker,
                        cars: results.cars,
                    }});
    });
}

exports.maker_create_get = (req, res, next) => {
    res.render('index', {title: 'Create Maker', page: './maker_form', 
                        content: {title: 'Create Maker'}
                });
}

exports.maker_create_post = [
    body('name', 'Name must not be empty').trim().isLength({min: 1}).escape(),
    body('established_year', 'Established year must not be empty').trim().isLength({min: 1}).escape(),
    (req, res, next) => {
        const errors = validationResult(req);
        async.parallel({
            image: (callback) => {
                const img = new Image({
                    data: fs.readFileSync(path.join(__dirname, '../uploads/', req.file.filename)),
                    content_type: 'image/jpg',
                });
                img.save((err) => {
                    if (err)
                        return next(err);
                    callback(null, img);    
                });
            },
            maker: (callback) => {
                callback(null, new Maker({
                        name: req.body.name,
                        established_year: req.body.established_year,
                }));
            },
        }, (err, results) => {
            const maker = results.maker;
            maker.logo = results.image;
            if (!errors.isEmpty()) {
                res.render('index', {title: 'Create Maker', page: './maker_form', 
                                    content: {title: 'Create Maker'}
                        });
                return;
            } else {
                maker.save((err) => {
                    if (err)
                    return next(err);
                    res.redirect(maker.url);
                })
            }
        });
    }
]

exports.maker_delete_get = (req, res, next) => {
    Maker.findById(req.params.id).exec((err, theMaker) => {
        if (err)
            return next(err);
        if (theMaker === null) 
            res.redirect('/makers');
        res.render('index', {title: 'Delete Maker', page: './maker_delete', 
                            content: {
                                maker: theMaker
                            }});
    });
}

exports.maker_delete_post = (req, res, next) => {
    if (req.body.status !== 'admin5678') {
        res.redirect('/maker/' + req.params.id);
        return;
    };
    Maker.findById(req.params.id).exec((err, theMaker) => {
        if (err)
            return next(err);
        Maker.findByIdAndRemove(req.body.makerid, (err) => {
            if (err)
                return next(err);
            res.redirect('/makers');
        })
    });
}

exports.maker_update_get = (req, res, next) => {
    Maker.findById(req.params.id).exec((err, theMaker) => {
        if (err)
            return next(err);
        if(theMaker === null) {
            const err = new Error('No such Maker');
            err.status = 404;
            return next(err);
        }
        res.render('index', {title: 'Update Maker', page: './maker_form',
                            content: {
                                title: 'Update Maker',
                                maker: theMaker
                            }});
    });
}

exports.maker_update_post = [
    body('name', 'Name must not be empty').trim().isLength({min: 1}).escape(),
    body('established_year', 'Established year must not be empty').trim().isLength({min: 1}).escape(),
    (req, res, next) => {
        const errors = validationResult(req);
        async.parallel({
            image: (callback) => {
                const img = new Image({
                    data: fs.readFileSync(path.join(__dirname, '../uploads/', req.file.filename)),
                    content_type: 'image/jpg',
                });
                img.save((err) => {
                    if (err)
                        return next(err);
                    callback(null, img);    
                });
            },
            maker: (callback) => {
                callback(null, new Maker({
                    name: req.body.name,
                    established_year: req.body.established_year,
                    _id: req.params.id
                }));
            },
        }, (err, results) => {
            const maker = results.maker;
            maker.logo = results.image;
            if (req.body.status !== 'admin5678') {
                res.redirect('/maker/' + req.params.id);
                return;
            }
            if (!errors.isEmpty()) {
                res.render('index', {title: 'Update Maker', page: './maker_form',
                content: {
                    title: 'Update Maker',
                    maker: theMaker,
                    errors: errors
                }});        
                return;
            } else {
                Maker.findByIdAndUpdate(req.params.id, maker, {}, (err, theMaker) => {
                    if (err)
                        return next(err);
                    res.redirect(theMaker.url);
                });
            }
        });
    }
]