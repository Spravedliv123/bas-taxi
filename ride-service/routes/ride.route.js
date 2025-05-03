import express from 'express';
import {
    acceptRideHandler,
    activateLineHandler,
    activateParkingModeHandler,
    cancelRideHandler,
    completeRideHandler,
    createRideWithoutPassengerHandler,
    deactivateLineHandler,
    deactivateParkingModeHandler,
    getNearbyParkedDriversHandler,
    getRideInfoHandler,
    onsiteRideHandler,
    requestRideHandler,
    startRideByQRHandler,
    startRideHandler,
    updateRideStatusHandler,
    getDriverDetailsHandler,
    getDriverRidesHandler,
    getUserRidesHandler,
    getRideDetailsHandler,
} from '../controllers/ride.controller.js';
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { validateInputMiddleware } from '../middlewares/validateInput.middleware.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Rides
 *   description: Управление поездками
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Ride:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         passengerId:
 *           type: integer
 *           nullable: true
 *         driverId:
 *           type: integer
 *           nullable: true
 *         origin:
 *           type: string
 *         destination:
 *           type: string
 *         originName:
 *           type: string
 *           nullable: true
 *         destinationName:
 *           type: string
 *           nullable: true
 *         city:
 *           type: string
 *         distance:
 *           type: number
 *           nullable: true
 *         price:
 *           type: number
 *           nullable: true
 *         paymentType:
 *           type: string
 *           enum: [cash, card]
 *         status:
 *           type: string
 *           enum: [pending, driver_assigned, in_progress, completed, cancelled, on_site]
 *         cancellationReason:
 *           type: string
 *           nullable: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /rides/request:
 *   post:
 *     summary: Создание запроса на поездку от пассажира
 *     tags: [Rides]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               origin:
 *                 type: string
 *                 description: Координаты отправления в формате "lat,lng"
 *                 example: "43.2025,76.8921"
 *               destination:
 *                 type: string
 *                 description: Координаты назначения в формате "lat,lng"
 *                 example: "43.20917,76.76028"
 *     responses:
 *       201:
 *         description: Запрос на поездку создан
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ride:
 *                   type: object
 *                   properties:
 *                     rideId:
 *                       type: string
 *                       example: "uuid-1234"
 *                     passengerId:
 *                       type: string
 *                       example: "passenger123"
 *                     driverId:
 *                       type: string
 *                       example: null
 *                     origin:
 *                       type: object
 *                       properties:
 *                         lat:
 *                           type: number
 *                           example: 55.753215
 *                         lng:
 *                           type: number
 *                           example: 37.622504
 *                     destination:
 *                       type: object
 *                       properties:
 *                         lat:
 *                           type: number
 *                           example: 55.751244
 *                         lng:
 *                           type: number
 *                           example: 37.618423
 *                     price:
 *                       type: number
 *                       example: 70
 *                     status:
 *                       type: string
 *                       example: "requested"
 *                     createdAt:
 *                       type: number
 *                       example: 1633072800000
 *                     updatedAt:
 *                       type: number
 *                       example: 1633072800000
 *       400:
 *         description: Некорректный запрос
 *       500:
 *         description: Внутренняя ошибка сервера
 */
router.post(
    '/request', 
    authMiddleware(['driver', 'passenger']), 
    validateInputMiddleware({
        'body': ['origin', 'destination']
    }),
    requestRideHandler
);


/**
 * @swagger
 * /rides/accept:
 *   post:
 *     summary: Принять поездку водителем
 *     tags: [Rides]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rideId:
 *                 type: integer
 *                 description: Идентификатор поездки
 *     responses:
 *       200:
 *         description: Поездка успешно принята
 *       400:
 *         description: Ошибка при принятии поездки
 */
router.post(
    '/accept', 
    authMiddleware(['driver']), 
    validateInputMiddleware({
        'body': ['rideId']
    }),
    acceptRideHandler);

/**
 * @swagger
 * /rides/{rideId}/start:
 *   post:
 *     summary: Начало поездки после посадки пассажира
 *     tags: [Rides]
 *     parameters:
 *       - in: path
 *         name: rideId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Идентификатор поездки
 *     responses:
 *       200:
 *         description: Поездка успешно началась
 *       400:
 *         description: Ошибка запроса
 *       500:
 *         description: Внутренняя ошибка сервера
 */
router.post(
    '/:rideId/start', 
    authMiddleware(['driver']), 
    validateInputMiddleware({
        'params': ['rideId']
    }),
    startRideHandler);

/**
 * @swagger
 * /rides/{rideId}/onsite:
 *   post:
 *     summary: Водитель на месте
 *     tags: [Rides]
 *     parameters:
 *       - in: path
 *         name: rideId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Идентификатор поездки
 *     responses:
 *       200:
 *         description: Водитель на месте
 *       400:
 *         description: Ошибка запроса
 *       500:
 *         description: Внутренняя ошибка сервера
 */
router.post('/:rideId/onsite', authMiddleware(['driver']), onsiteRideHandler);

/**
 * @swagger
 * /rides/{rideId}/complete:
 *   post:
 *     summary: Завершение поездки водителем
 *     tags: [Rides]
 *     parameters:
 *       - in: path
 *         name: rideId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Идентификатор поездки
 *     responses:
 *       200:
 *         description: Поездка успешно завершена
 *       400:
 *         description: Ошибка запроса
 *       500:
 *         description: Внутренняя ошибка сервера
 */
router.post('/:rideId/complete', authMiddleware(['driver']), completeRideHandler);

/**
 * @swagger
 * /rides/{rideId}/cancel:
 *   post:
 *     summary: Отмена поездки пассажиром
 *     tags: [Rides]
 *     parameters:
 *       - in: path
 *         name: rideId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Идентификатор поездки
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - cancellationReason
 *             properties:
 *               cancellationReason:
 *                 type: string
 *                 description: Причина отмены поездки
 *     responses:
 *       200:
 *         description: Поездка успешно отменена
 *       400:
 *         description: Ошибка запроса
 */
router.post('/:rideId/cancel', authMiddleware(['passenger']), cancelRideHandler);

/**
 * @swagger
 * /rides/without-passenger:
 *   post:
 *     summary: Создание поездки водителем без участия пассажира
 *     tags: [Rides]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               origin:
 *                 type: string
 *                 description: Координаты отправления в формате "lat,lng"
 *                 example: "43.2025,76.8921"
 *               destination:
 *                 type: string
 *                 description: Координаты назначения в формате "lat,lng"
 *                 example: "43.20917,76.76028"
 *     responses:
 *       201:
 *         description: Поездка создана
 *       400:
 *         description: Некорректный запрос
 *       500:
 *         description: Внутренняя ошибка сервера
 */
router.post('/without-passenger', authMiddleware(['driver']), createRideWithoutPassengerHandler);

/**
 * @swagger
 * /rides/start-by-qr:
 *   post:
 *     summary: Создание поездки после сканирования QR-кода
 *     tags: [Rides]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               driverId:
 *                 type: string
 *                 example: "driver123"
 *               origin:
 *                 type: string
 *                 description: Координаты отправления в формате "lat,lng"
 *                 example: "43.2025,76.8921"
 *               destination:
 *                 type: string
 *                 description: Координаты назначения в формате "lat,lng"
 *                 example: "43.20917,76.76028"
 *     responses:
 *       201:
 *         description: Поездка создана по QR-коду
 *       400:
 *         description: Некорректный запрос
 *       500:
 *         description: Внутренняя ошибка сервера
 */
router.post('/start-by-qr', authMiddleware(['passenger']), startRideByQRHandler);

/**
 * @swagger
 * /rides/update-status:
 *   put:
 *     summary: Обновление статуса поездки
 *     tags: [Rides]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rideId:
 *                 type: string
 *                 example: "uuid-1234"
 *               status:
 *                 type: string
 *                 example: "completed"
 *     responses:
 *       200:
 *         description: Статус поездки обновлен
 *       400:
 *         description: Некорректный запрос
 *       500:
 *         description: Внутренняя ошибка сервера
 */
router.put('/update-status', authMiddleware(['driver', 'passenger']), updateRideStatusHandler);

/**
 * @swagger
 * /rides/price:
 *   post:
 *     summary: Расчет расстояния и цены поездки
 *     tags: [Rides]
 *     parameters:
 *       - in: query
 *         name: origin
 *         schema:
 *           type: string
 *           example: '{"lat":55.753215,"lng":37.622504}'
 *         required: true
 *         description: Координаты отправления в формате JSON
 *       - in: query
 *         name: destination
 *         schema:
 *           type: string
 *           example: '{"lat":55.751244,"lng":37.618423}'
 *         required: true
 *         description: Координаты назначения в формате JSON
 *     responses:
 *       200:
 *         description: Информация о поездке получена
 *       400:
 *         description: Некорректный запрос
 *       500:
 *         description: Внутренняя ошибка сервера
 */
router.post('/price', authMiddleware(['driver', 'passenger']), getRideInfoHandler);


/**
 * @swagger
 * /rides/parking/activate:
 *   post:
 *     summary: Активация режима парковки водителем
 *     tags: [Rides]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               latitude:
 *                 type: number
 *                 example: 55.753215
 *               longitude:
 *                 type: number
 *                 example: 37.622504
 *     responses:
 *       200:
 *         description: Режим парковки активирован
 *       400:
 *         description: Некорректный запрос
 *       500:
 *         description: Внутренняя ошибка сервера
 */
router.post('/parking/activate', authMiddleware(['driver']), activateParkingModeHandler);

/**
 * @swagger
 * /rides/parking/deactivate:
 *   post:
 *     summary: Деактивация режима парковки водителем
 *     tags: [Rides]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Режим парковки деактивирован
 *       400:
 *         description: Ошибка в запросе
 *       500:
 *         description: Внутренняя ошибка сервера
 */
router.post('/parking/deactivate', authMiddleware(['driver']), deactivateParkingModeHandler);

/**
 * @swagger
 * /rides/parking:
 *   get:
 *     summary: Получение списка водителей в режиме парковки
 *     tags: [Rides]
 *     parameters:
 *       - in: query
 *         name: latitude
 *         required: true
 *         schema:
 *           type: number
 *           example: 55.753215
 *         description: Широта текущей точки пользователя
 *       - in: query
 *         name: longitude
 *         required: true
 *         schema:
 *           type: number
 *           example: 37.622504
 *         description: Долгота текущей точки пользователя
 *       - in: query
 *         name: radius
 *         schema:
 *           type: number
 *           default: 5
 *           example: 10
 *         description: Радиус поиска в километрах
 *     responses:
 *       200:
 *         description: Список парковочных водителей
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   driverId:
 *                     type: integer
 *                     example: 4
 *                   distance:
 *                     type: number
 *                     format: float
 *                     example: 0.0001
 *                   coordinates:
 *                     type: object
 *                     properties:
 *                       latitude:
 *                         type: number
 *                         example: 43.20250096377944
 *                       longitude:
 *                         type: number
 *                         example: 76.89210087060928
 *       400:
 *         description: Некорректный запрос
 *       500:
 *         description: Внутренняя ошибка сервера
 */
router.get('/parking', authMiddleware(['passenger']), getNearbyParkedDriversHandler);

/**
 * @swagger
 * tags:
 *   name: Line
 *   description: Управление водителем
 */

/**
 * @swagger
 * /line/activate:
 *   post:
 *     summary: Вход на линию водителем
 *     tags: [Line]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               latitude:
 *                 type: number
 *                 description: Широта местоположения
 *                 example: 55.753215
 *               longitude:
 *                 type: number
 *                 description: Долгота местоположения
 *                 example: 37.622504
 *     responses:
 *       200:
 *         description: Водитель вышел на линию
 *       400:
 *         description: Ошибка в запросе
 *       500:
 *         description: Внутренняя ошибка сервера
 */
router.post('/line/activate', authMiddleware(['driver']), activateLineHandler);

/**
 * @swagger
 * /line/deactivate:
 *   post:
 *     summary: Выход с линии водителем
 *     tags: [Line]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Водитель вышел с линии
 *       500:
 *         description: Внутренняя ошибка сервера
 */
router.post('/line/deactivate', authMiddleware(['driver']), deactivateLineHandler);

/**
 * @swagger
 * /driver/{driverId}:
 *   get:
 *     summary: Получение данных о водителе по driverId
 *     tags: [Rides]
 *     parameters:
 *       - in: path
 *         name: driverId
 *         required: true
 *         schema:
 *           type: string
 *         description: Идентификатор водителя
 *     responses:
 *       200:
 *         description: Данные о водителе получены
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 phone:
 *                   type: string
 *                 rating:
 *                   type: number
 *                 reviewCount:
 *                   type: integer
 *       400:
 *         description: Не указан driverId
 *       404:
 *         description: Данные о водителе не найдены
 *       500:
 *         description: Не удалось получить данные о водителе
 */
router.get('/driver/:driverId', getDriverDetailsHandler);

/**
 * @swagger
 * /ride/{rideId}:
 *   get:
 *     summary: Получение деталей поездки
 *     tags: [Rides]
 *     parameters:
 *       - in: path
 *         name: rideId
 *         required: true
 *         schema:
 *           type: string
 *         description: Идентификатор поездки
 *     responses:
 *       200:
 *         description: Данные о поездке получены
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ride'
 *       400:
 *         description: Не указан rideId
 *       404:
 *         description: Данные о поездке не найдены
 *       500:
 *         description: Не удалось получить данные о поездке
 */
router.get('/ride/:rideId', getRideDetailsHandler);

/**
 * @swagger
 * /driver/rides/my:
 *   get:
 *     summary: Водитель получает список своих активных поездок
 *     tags: [Rides]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Список поездок водителя получен
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Ride'
 *       401:
 *         description: Не авторизован
 *       403:
 *         description: Нет прав доступа (пользователь не водитель)
 *       404:
 *         description: Поездки не найдены
 *       500:
 *         description: Ошибка сервера
 */
router.get(
    '/driver/rides/my',
    authMiddleware(['driver']),
    (req, res) => getDriverRidesHandler({ params: { driverId: req.user.id } }, res)
);

/**
 * @swagger
 * /user/rides/my:
 *   get:
 *     summary: Пассажир получает список своих активных поездок
 *     tags: [Rides]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Список поездок пассажира получен
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Ride'
 *       401:
 *         description: Не авторизован
 *       403:
 *         description: Нет прав доступа (пользователь не пассажир)
 *       404:
 *         description: Поездки не найдены
 *       500:
 *         description: Ошибка сервера
 */
router.get(
    '/user/rides/my',
    authMiddleware(['user']),
    (req, res) => getUserRidesHandler({ params: { userId: req.user.id } }, res)
);

/**
 * @swagger
 * /rides/{rideId}:
 *   get:
 *     summary: Получение данных о конкретной поездке
 *     tags: [Rides]
 *     parameters:
 *       - in: path
 *         name: rideId
 *         required: true
 *         schema:
 *           type: string
 *         description: Идентификатор поездки
 *     responses:
 *       200:
 *         description: Данные о поездке получены
 *       400:
 *         description: Не указан rideId
 *       404:
 *         description: Данные о поездке не найдены
 *       500:
 *         description: Не удалось получить данные о поездке
 */
router.get('/rides/:rideId', authMiddleware(['driver', 'passenger', 'admin', ' moderator']), getRideDetailsHandler);

// /**
//  * @swagger
//  * /driver/{driverId}/rides:
//  *   get:
//  *     summary: Получение списка поездок водителя
//  *     tags: [Rides]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: driverId
//  *         required: true
//  *         schema:
//  *           type: string
//  *         description: Идентификатор водителя
//  *     responses:
//  *       200:
//  *         description: Данные о поездках получены
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: array
//  *               items:
//  *                 $ref: '#/components/schemas/Ride'
//  *       400:
//  *         description: Не указан driverId
//  *       404:
//  *         description: Поездки с указанным driverId не найдены
//  *       500:
//  *         description: Не удалось получить данные о поездках
//  */
router.get('/driver/:driverId/rides', authMiddleware(['admin']), getDriverRidesHandler);

// /**
//  * @swagger
//  * /user/{userId}/rides:
//  *   get:
//  *     summary: Получение списка поездок пользователя
//  *     tags: [Rides]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: userId
//  *         required: true
//  *         schema:
//  *           type: string
//  *         description: Идентификатор пользователя
//  *     responses:
//  *       200:
//  *         description: Данные о поездках получены
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: array
//  *               items:
//  *                 $ref: '#/components/schemas/Ride'
//  *       400:
//  *         description: Не указан userId
//  *       404:
//  *         description: Поездки с указанным userId не найдены
//  *       500:
//  *         description: Не удалось получить данные о поездках
//  */
router.get('/user/:userId/rides', authMiddleware(['admin']), getUserRidesHandler);
router.get('/:rideId', getRideDetailsHandler);

export default router;
