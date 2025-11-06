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

routes.delete('/cities/:zipCode', (_req, res) => {
    const zipCode = _req.params.zipCode;
    const cityIndex = cities.findIndex(c => c.zipCode === zipCode);
    if (cityIndex === -1) {
        return res.status(404).json({ error: 'Ville non trouvée' });
    }
    cities.splice(cityIndex, 1);
    res.status(204).send();
})

routes.put('/cities/:zipCode', (_req, res) => {
    const zipCode = _req.params.zipCode;
    const city = cities.find(c => c.zipCode === zipCode);
    if (!city) {
        return res.status(404).json({ error: 'Ville non trouvée' });
    }
    const { name } = _req.body;
    if (name) {
        city.name = name;
    }
    res.json(city);
})

export default routes;


