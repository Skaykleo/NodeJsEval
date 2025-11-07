import express from "express";
import { cities, weather } from "../server";
import logger from "../logger";

const routes = express.Router();

routes.get("/cities", (_req, res) => {
  logger.info(`Liste de ${cities.length} villes récupérée`);
  res.json(cities);
});

routes.get("/cities/:zipCode", (_req, res) => {
  const zipCode = _req.params.zipCode;
  const city = cities.find((c) => c.zipCode === zipCode);

  if (!city) {
    logger.warn({ zipCode }, "Ville non trouvée");
    return res.status(404).json({ error: "Ville non trouvée" });
  }

  logger.info({ zipCode, cityName: city.name }, "Ville récupérée");
  res.json(city);
});

routes.delete("/cities/:zipCode", (_req, res) => {
  const zipCode = _req.params.zipCode;
  const cityIndex = cities.findIndex((c) => c.zipCode === zipCode);

  if (cityIndex === -1) {
    logger.warn({ zipCode }, "Ville non trouvée pour suppression");
    return res.status(404).json({ error: "Ville non trouvée" });
  }

  const deletedCity = cities[cityIndex];
  cities.splice(cityIndex, 1);
  logger.info(
    { zipCode, cityName: deletedCity.name },
    "Ville supprimée avec succès"
  );

  res.status(204).send();
});

routes.put("/cities/:zipCode", (_req, res) => {
  const zipCode = _req.params.zipCode;
  const city = cities.find((c) => c.zipCode === zipCode);

  if (!city) {
    logger.warn({ zipCode }, "Ville non trouvée pour mise à jour");
    return res.status(404).json({ error: "Ville non trouvée" });
  }

  const { name } = _req.body;
  const oldName = city.name;

  if (name) {
    city.name = name;
    logger.info(
      { zipCode, oldName, newName: name },
      "Ville modifiée avec succès"
    );
  }
  res.json(city);
});

routes.get("/cities/:zipCode/weather", (_req, res) => {
  const zipCode = _req.params.zipCode;
  const city = cities.find((c) => c.zipCode === zipCode);

  if (!city) {
    logger.warn({ zipCode }, "Ville non trouvée pour récupération météo");
    return res.status(404).json({ error: "Ville non trouvée" });
  }

  const weatherBulletin = weather.find((w) => w.zipCode === zipCode);

  if (!weatherBulletin) {
    logger.warn({ zipCode }, "Bulletin météo non trouvé pour cette ville");
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
    logger.warn({ zipCode }, "Ville non trouvée pour création météo");
    return res.status(404).json({ error: "Ville non trouvée" });
  }

  const { weather: weatherType } = _req.body;

  if (!weatherType || !["pluie", "beau", "neige"].includes(weatherType)) {
    logger.error(
      { zipCode, weatherType },
      "Informations météo manquantes ou invalides"
    );
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
  logger.info(
    { id: newId, zipCode, cityName: city.name, weather: weatherType },
    "Bulletin météo créé avec succès"
  );

  res.status(201).json({ id: newId });
});

routes.delete("/weather/:id", (_req, res) => {
  const id = Number(_req.params.id);
  const weatherIndex = weather.findIndex((w) => w.id === id);

  if (weatherIndex === -1) {
    logger.warn(
      { id },
      "Tentative de suppression d'un bulletin météo inexistant"
    );
    return res.status(404).json({ error: "Bulletin météo non trouvé" });
  }

  const deletedBulletin = weather[weatherIndex];
  weather.splice(weatherIndex, 1);
  logger.info(
    {
      id,
      townName: deletedBulletin.townName,
      weather: deletedBulletin.weather,
    },
    "Bulletin météo supprimé avec succès"
  );
  res.status(204).send();
});

routes.get("/cities/:zipCode/weather/:id", (_req, res) => {
  const zipCode = _req.params.zipCode;
  const id = Number(_req.params.id);

  const city = cities.find((c) => c.zipCode === zipCode);

  if (!city) {
    logger.warn(
      { zipCode },
      "Ville non trouvée pour récupération météo par ID"
    );
    return res.status(404).json({ error: "Ville non trouvée" });
  }

  const weatherBulletin = weather.find(
    (w) => w.zipCode === zipCode && w.id === id
  );

  if (!weatherBulletin) {
    logger.warn(
      { zipCode, id, cityName: city.name },
      "Bulletin météo non trouvé pour cette ville et cet ID"
    );
    return res
      .status(404)
      .json({ error: "Bulletin météo non trouvé pour cette ville" });
  }

  logger.info(
    { zipCode, id, cityName: city.name },
    "Bulletin météo spécifique récupéré"
  );
  res.json({
    id: weatherBulletin.id,
    zipCode: zipCode,
    townName: city.name,
    weather: weatherBulletin.weather,
  });
});

routes.get("/weather/:id", (_req, res) => {
  const id = Number(_req.params.id);

  const weatherBulletin = weather.find((w) => w.id === id);

  if (!weatherBulletin) {
    logger.warn({ id }, "Bulletin météo non trouvé");
    return res.status(404).json({ error: "Bulletin météo non trouvé" });
  }

  logger.info(
    { id, townName: weatherBulletin.townName },
    "Bulletin météo récupéré par ID"
  );
  res.json(weatherBulletin);
});

routes.get("/weather", (_req, res) => {
  logger.info(`Liste de ${weather.length} bulletins météo récupérée`);
  res.json(weather);
});
export default routes;
