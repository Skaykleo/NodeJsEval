import pino from "pino";
import fs from "node:fs";
import path from "node:path";

// Créer le dossier logs s'il n'existe pas
const logDir = path.join(process.cwd(), "logs");
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// Configuration du logger avec transports multiples
const logger = pino({
  level: process.env.LOG_LEVEL || "info",
  transport: {
    targets: [
      {
        // Transport pour la console
        target: "pino-pretty",
        level: "info",
        options: {
          colorize: true,
          translateTime: "SYS:dd-mm-yyyy HH:MM:ss",
          ignore: "pid,hostname",
          singleLine: false,
        },
      },
      {
        // Transport pour le fichier d'erreurs
        target: "pino/file",
        level: "error",
        options: {
          destination: path.join(logDir, "error.log"),
          mkdir: true,
        },
      },
    ],
  },
});

export default logger;
