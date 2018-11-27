'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _users = require('../controllers/users');

var _users2 = _interopRequireDefault(_users);

var _parcels = require('../controllers/parcels');

var _parcels2 = _interopRequireDefault(_parcels);

var _Auth = require('../middleware/Auth');

var _Auth2 = _interopRequireDefault(_Auth);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.use((0, _express.json)());
router.use((0, _express.urlencoded)({ extended: false }));

router.post('/api/v1/auth/signup', _users2.default.signUp);
router.get('/api/v1/auth/login', _users2.default.signIn);

router.post('/api/v1/parcels', _Auth2.default.verifyToken, _parcels2.default.createParcel);
router.get('/api/v1/parcels', _Auth2.default.verifyToken, _parcels2.default.getAllParcels);
router.get('/api/v1/parcels/:id', _Auth2.default.verifyToken, _parcels2.default.getParcel);
router.put('/api/v1/parcels/:id/cancel', _Auth2.default.verifyToken, _parcels2.default.cancelParcel);
router.put('/api/v1/parcels/:id/destination', _Auth2.default.verifyToken, _parcels2.default.changeDestination);
// admin
router.get('/api/v1/admin/parcels', _Auth2.default.adminToken, _parcels2.default.getAllParcelsAdmin);

exports.default = router;