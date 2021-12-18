#! /usr/bin/env node

// Get arguments passed on command line
const userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
const fs = require('fs');
const path = require('path');
const async = require('async')
const Car = require('./models/car');
const Maker = require('./models/maker');
const Type = require('./models/type');
const Image = require('./models/image');

const mongoose = require('mongoose');
const mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const cars = [];
const makers = [];
const types = [];
const images = [];

function imageCreate(theData, theContent_type, cb) {
  const imageDetail = {
    data: theData,
    content_type: theContent_type,
  };

  const image = new Image(imageDetail);

  image.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log(`New Image: ${image.content_type}`);
    images.push(image);
    cb(null, image);
  });
}

function makerCreate(name, est_year, logo, cb) {
  const makerDetail = {
    name: name,
    established_year: est_year,
    logo: logo,
  };

  const maker = new Maker(makerDetail);
  
  maker.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log(`New Maker: ${maker}`);
    makers.push(maker);
    cb(null, maker);
  });
}

function typeCreate(name, des, cb) {
  const typeDetail = {
    name: name,
    description: des,
  };
  
  const type = new Type(typeDetail);
  
  type.save(function(err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log(`New Maker: ${type}`);
    types.push(type);
    cb(null, type);
  });
}

function carCreate(name, theMaker, theType, price, pic, des, release, numb_in, cb) {
  const carDetail = {
    name: name,
    price: price,
    picture: pic,
    description: des,
    release_year: release,
    number_in_stock: numb_in,
  }
  if (theMaker != false) carDetail.maker = theMaker;
  if (theType != false) carDetail.type = theType;
  
  const car = new Car(carDetail);
  
  car.save(function(err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log(`New Maker: ${car}`);
    types.push(car);
    cb(null, car);
  });
}

function createImage(cb) {
  async.series([
    function(callback) {
      imageCreate(fs.readFileSync(path.join(__dirname + '/public/images/picture/db11.jpg')), 'image/jpg', callback);
    },
    function(callback) {
      imageCreate(fs.readFileSync(path.join(__dirname + '/public/images/picture/m5.jpg')), 'image/jpg', callback);
    },
    function(callback) {
      imageCreate(fs.readFileSync(path.join(__dirname + '/public/images/picture/roma.jpg')), 'image/jpg', callback);
    },
    function(callback) {
      imageCreate(fs.readFileSync(path.join(__dirname + '/public/images/picture/evoque.jpg')), 'image/jpg', callback);
    },
    function(callback) {
      imageCreate(fs.readFileSync(path.join(__dirname + '/public/images/picture/amg_gt.jpg')), 'image/jpg', callback);
    },
    function(callback) {
      imageCreate(fs.readFileSync(path.join(__dirname + '/public/images/picture/modelX.jpg')), 'image/jpg', callback);
    },
    function(callback) {
      imageCreate(fs.readFileSync(path.join(__dirname + '/public/images/logo/Aston_Martin_logo.jpg')), 'image/jpg', callback);
    },
    function(callback) {
      imageCreate(fs.readFileSync(path.join(__dirname + '/public/images/logo/BMW_logo.jpg')), 'image/jpg', callback);
    },
    function(callback) {
      imageCreate(fs.readFileSync(path.join(__dirname + '/public/images/logo/Ferrari_logo.jpg')), 'image/jpg', callback);
    },
    function(callback) {
      imageCreate(fs.readFileSync(path.join(__dirname + '/public/images/logo/Land_Rover_logo.jpg')), 'image/jpg', callback);
    },
    function(callback) {
      imageCreate(fs.readFileSync(path.join(__dirname + '/public/images/logo/Mercedes_logo.jpg')), 'image/jpg', callback);
    },
    function(callback) {
      imageCreate(fs.readFileSync(path.join(__dirname + '/public/images/logo/Tesla_logo.jpg')), 'image/jpg', callback);
    },
  ], cb);
}

function createMaker(cb) {
  async.series([
    function(callback) {
      makerCreate('Aston Martin', 1914, images[6], callback);
    },
    function(callback) {
      makerCreate('BMW', 1916, images[7], callback);
    },
    function(callback) {
      makerCreate('Ferrari', 1947, images[8], callback);
    },
    function(callback) {
      makerCreate('Land Rover', 1978, images[9], callback);
    },
    function(callback) {
      makerCreate('Mercedes', 1026, images[10], callback);
    },
    function(callback) {
      makerCreate('Tesla', 2003, images[11], callback);
    },
  ], cb);
}

function createType(cb) {
  async.series([
    function(callback) {
      typeCreate('SUV', 'A sport utility vehicle or SUV is a car classification that combines elements of road-going passenger cars with features from off-road vehicles, such as raised ground clearance and four-wheel drive.', callback);
    },
    function(callback) {
      typeCreate('Coupe', 'A coupe or coupé is a passenger car with a sloping or truncated rear roofline and two doors. The term coupé was first applied to horse-drawn carriages for two passengers without rear-facing seats. It comes from the French translation of "cut"', callback);
    },
    function(callback) {
      typeCreate('Sedan', 'A sedan or saloon (British English) is a passenger car in a three-box configuration with separate compartments for engine, passenger, and cargo.', callback);
    },
    function(callback) {
      typeCreate('Electric', 'An electric vehicle (EV) is a vehicle that uses one or more electric motors for propulsion. It can be powered by a collector system, with electricity from extravehicular sources, or it can be powered autonomously by a battery', callback);
    },
  ], cb);
}

function createCar(cb) {
  async.series([
    function(callback) {
      carCreate('DB11', makers[0], types[1], 208425, images[0], 
                  "The 2021 Aston Martin DB11 provides a special type of theater, with breathtaking visuals and entertaining performance. The astonishing Aston Martin comes as a graceful coupe or a gorgeous convertible that the Brits call Volante.",
                  2021, 3, callback);
    },
    function(callback) {
      carCreate('M5', makers[1], types[2], 105495, images[1], 
                  "The M5 is a serious high-performance vehicle that delivers the kind of thrills expected of a much smaller exotic coupe, yet it can also be as docile as a luxury sedan.",
                  2021, 6, callback);
    },
    function(callback) {
      carCreate('Roma', makers[2], types[1], 222620, images[2], 
                  "The shapely coupe is the latest model to come out of the company's Maranello headquarters and named after the country's capital—Rome. While its sheetmetal recalls Ferraris from the 50s and 60s, the grand tourer also hides serious performance hardware and cutting-edge technology.",
                  2021, 1, callback);
    },
    function(callback) {
      carCreate('Range Rover Evoque', makers[3], types[0], 45750, images[3], 
                  "The 2022 Range Rover Evoque has a style stranglehold on its subcompact luxury SUV competitors, but its charms fall victim to practical downfalls such as its puny cargo area and snug rear-seat space.",
                  2022, 12, callback);
    },
    function(callback) {
      carCreate('AMG GT', makers[4], types[1], 116895, images[4], 
                  "The AMG GT represents everything that's right about a Grand Touring car. It has a luscious body with that classic long hood that houses a high-performance engine, namely the 4.0-liter twin-turbocharged V-8, the widened hips, the low roofline coupled with a generous windshield and the rounded, cheeky-looking, tail end.",
                  2020, 7, callback);
    },
    function(callback) {
      carCreate('Model X', makers[5], types[3], 106440, images[5], 
                  "The 2022 Tesla Model X is a prime example of the EV automakers' brand ethos. Quick, high-tech, and featuring a flashy gimmick in its Falcon-wing rear doors, it presents a unique-but-expensive proposition in the growing EV-crossover segment.",
                  2022, 0, callback);
    },
  ], cb);
}

async.series([
  createImage,
  createMaker,
  createType,
  createCar
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    else {
        console.log('Car: '+ cars);
        
    }
    // All done, disconnect from database
    mongoose.connection.close();
});




