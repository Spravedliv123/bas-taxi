import express from 'express';
import {
    geocodeAddress,
    reverseGeocode,
    getDistanceAndDuration,
    getDirections,
    findNearestDrivers,
    updateDriverLocation, getCityByCoordinates,
} from '../controllers/geo.controller.js';
import { validateInputMiddleware } from '../middleware/validateInput.middleware.js';

const router = express.Router();

router.post(
    '/geocode', 
    validateInputMiddleware({
        "body": ["address"]
    }),
    geocodeAddress
);

router.post(
    '/get-city', 
    validateInputMiddleware({
        "body": ["latitude", "longitude"]
    }),
    getCityByCoordinates
);

router.get(
    '/reverse-geocode', 
    validateInputMiddleware({
        "query": ["latitude", "longitude"]
    }),
    reverseGeocode
);

router.post(
    '/distance', 
    validateInputMiddleware({
        "body": ["origin", "destination"]
    }),
    getDistanceAndDuration
);

router.post(
    '/directions', 
    validateInputMiddleware({
        "body": ["origin", "destination"]
    }),
    getDirections
);

router.get(
    '/nearest-drivers', 
    validateInputMiddleware({
        "query": ["latitude", "longitude", "radius"]
    }),
    findNearestDrivers
);

router.post(
    '/update-location',
    validateInputMiddleware({
        "body": ["driverId", "latitude", "longitude"]
    }),
    updateDriverLocation
);

export default router;
