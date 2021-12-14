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
    Car.find({}, 'name maker type picture number_in_stock')
    .sort({name: 1})
    .populate('maker').populate('type')
    .exec((err, list_car) => {
        if (err)
            return async.nextTick(err);
        // res.render('car_list', {title: 'All Cars', car_list: list_car});
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
