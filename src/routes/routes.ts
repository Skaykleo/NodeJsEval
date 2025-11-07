import express from "express";
import { cities, weather } from "../server";

const routes = express.Router();

routes.get("/cities", (_req, res) => {
  console.log(cities);
  res.json(cities);
});

routes.get("/cities/:zipCode", (_req, res) => {
  const zipCode = _req.params.zipCode;
  const city = cities.find((c) => c.zipCode === zipCode);
  if (!city) {
    return res.status(404).json({ error: "Ville non trouvée" });
  }
  res.json(city);
});

routes.delete("/cities/:zipCode", (_req, res) => {
  const zipCode = _req.params.zipCode;
  const cityIndex = cities.findIndex((c) => c.zipCode === zipCode);
  if (cityIndex === -1) {
    return res.status(404).json({ error: "Ville non trouvée" });
  }
  cities.splice(cityIndex, 1);
  res.status(204).send();
});

routes.put("/cities/:zipCode", (_req, res) => {
  const zipCode = _req.params.zipCode;
  const city = cities.find((c) => c.zipCode === zipCode);
  if (!city) {
    return res.status(404).json({ error: "Ville non trouvée" });
  }
  const { name } = _req.body;
  if (name) {
    city.name = name;
  }
  res.json(city);
});

routes.get("/cities/:zipCode/weather", (_req, res) => {
  const zipCode = _req.params.zipCode;
  const city = cities.find((c) => c.zipCode === zipCode);
  if (!city) {
    return res.status(404).json({ error: "Ville non trouvée" });
  }
  const weatherBulletin = weather.find((w) => w.zipCode === zipCode);
  if (!weatherBulletin) {
    return res
      .status(404)
      .json({ error: "Bulletin météo non trouvé pour cette ville" });
  }
  res.json({
    zipCode: zipCode,
    name: city.name,
    weather: weatherBulletin.weather,
  });
});

routes.post("/cities/:zipCode/weather", (_req, res) => {
  const zipCode = _req.params.zipCode;
  const city = cities.find((c) => c.zipCode === zipCode);

  if (!city) {
    return res.status(404).json({ error: "Ville non trouvée" });
  }

  const { weather: weatherType } = _req.body;

  if (!weatherType || !["pluie", "beau", "neige"].includes(weatherType)) {
    return res.status(400).json({ error: "Informations météo manquantes" });
  }

  // Générer un nouvel ID pour le bulletin météo
  const newId =
    weather.length > 0 ? Math.max(...weather.map((w) => w.id)) + 1 : 1;

  const newWeatherBulletin = {
    id: newId,
    zipCode: zipCode,
    townName: city.name,
    weather: weatherType,
  };

  weather.push(newWeatherBulletin);
  console.log(
    `Bulletin météo crée avec l'ID ${newId} pour la ville ${city.name}`
  );

  res.status(201).json({ id: newId });
});

routes.delete("/weather/:id", (_req, res) => {
    const id = Number(_req.params.id);
    const weatherIndex = weather.findIndex((w) => w.id === id);
    if (weatherIndex === -1) {
        return res.status(404).json({ error: "Bulletin météo non trouvé" });
    }
    weather.splice(weatherIndex, 1);
    res.status(204).send();
})

routes.get("/cities/:zipCode/weather/:id", (_req, res) => {
    const zipCode = _req.params.zipCode;
    const id = Number(_req.params.id);
    const city = cities.find((c) => c.zipCode === zipCode);
    if (!city) {
        return res.status(404).json({ error: "Ville non trouvée" });
    }
    const weatherBulletin = weather.find((w) => w.zipCode === zipCode && w.id === id);
    if (!weatherBulletin) {
        return res.status(404).json({ error: "Bulletin météo non trouvé pour cette ville" });
    }
    res.json({
        id :  weatherBulletin.id,
        zipCode: zipCode,
        townName: city.name,
        weather: weatherBulletin.weather,
    });
})
routes.get("/weather/:id", (_req, res) => {
    const id = Number(_req.params.id);
    const weatherBulletin = weather.find((w) => w.id === id);
    if (!weatherBulletin) {
        return res.status(404).json({ error: "Bulletin météo non trouvé" });
    }
    res.json(weatherBulletin);
})

routes.get("/weather", (_req, res) => {
    res.json(weather);
})
export default routes;
