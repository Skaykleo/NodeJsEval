import express from 'express';
import { cities } from '../server';

const routes = express.Router();

routes.get('/cities', (_req, res) => {
    console.log(cities);
    res.json(cities);

});

routes.get('/cities/:zipCode', (_req, res) => {
    const zipCode = _req.params.zipCode;
    const city = cities.find(c => c.zipCode === zipCode);
    if (!city) {
        return res.status(404).json({ error: 'Ville non trouvée' });
    }
    res.json(city);
})

export default routes;


