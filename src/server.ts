import express from "express";
import pinoHttp from "pino-http";
import { City, WeatherBulletin } from "./type";
import routes from "./routes/routes";
import logger from "./logger";

const app = express();

// Middleware de logging HTTP
app.use(
  pinoHttp({
    logger: logger,
    customLogLevel: function (req, res, err) {
      if (res.statusCode >= 400 && res.statusCode < 500) {
        return "warn";
      } else if (res.statusCode >= 500 || err) {
        return "error";
      }
      return "info";
    },

    customSuccessMessage: function (req, res) {
      if (res.statusCode === 404) {
        return `Ressource non trouvée: ${req.method} ${req.url}`;
      }
      return `${req.method} ${req.url} - ${res.statusCode}`;
    },

    customErrorMessage: function (req, res, err) {
      return `Erreur lors de ${req.method} ${req.url} - ${err.message}`;
    },
  })
);

app.use(express.json());
app.use("/", routes);

export const cities: City[] = [
  { zipCode: "75000", name: "Paris" },
  { zipCode: "69000", name: "Lyon" },
  { zipCode: "13000", name: "Marseille" },
  { zipCode: "31000", name: "Toulouse" },
];

export const weather: WeatherBulletin[] = [
  { id: 1, zipCode: "75000", townName: "Paris", weather: "pluie" },
  { id: 2, zipCode: "69000", townName: "Lyon", weather: "beau" },
  { id: 3, zipCode: "13000", townName: "Marseille", weather: "neige" },
];

app.get("/", (_req, res) => {
  res.send("Hello World !");
});

// Gestion des erreurs globale
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    logger.error(
      { err, req: { method: req.method, url: req.url } },
      "Erreur non gérée"
    );
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
);

export default app;
