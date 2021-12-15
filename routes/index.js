const express = require('express');
const router = express.Router();

const car_controller = require('../controllers/carController');
const maker_controller = require('../controllers/makerController');
const type_controller = require('../controllers/typeController');

/* GET home page. */
router.get('/', car_controller.index);

// GET and POST for car controller
router.get('/cars', car_controller.car_list);
router.get('/car/create', car_controller.car_create_get);
router.post('/car/create', car_controller.car_create_post);
router.get('/car/:id', car_controller.car_detail);
router.get('/car/:id/delete', car_controller.car_delete_get);
router.post('/car/:id/delete', car_controller.car_delete_post);
// router.get('/car/:id/update', car_controller.car_update_get);
// router.post('/car/:id/update', car_controller.car_update_post);

// // GET and POST for maker controller
// router.get('/makers', maker_controller.maker_list);
// router.get('/maker/:id', maker_controller.maker_detail);
// router.get('/maker/create', maker_controller.maker_create_get);
// router.post('/maker/create', maker_controller.maker_create_post);
// router.get('/maker/:id/delete', maker_controller.maker_detele_get);
// router.post('/maker/:id/delete', maker_controller.maker_delete_post);
// router.get('/maker/:id/update', maker_controller.maker_update_get);
// router.post('/maker/:id/update', maker_controller.maker_update_post);

// // GET and POST for type controller
// router.get('/types', type_controller.type_list);
// router.get('/type/:id', type_controller.type_detail);
// router.get('/type.create', type_controller.type_create_get);
// router.post('/type.create', type_controller.type_create_post);
// router.get('/type/:id/delete', type_controller.type_detele_get);
// router.post('/type/:id/delete', type_controller.type_delete_post);
// router.get('/type/:id/update', type_controller.type_update_get);
// router.post('/type/:id/update', type_controller.type_update_post);

module.exports = router;
