import express from 'express';
import { cities } from '../server';

const routes = express.Router();

routes.get('/cities', (_req, res) => {
    console.log(cities);
    res.json(cities);

});

export default routes;


