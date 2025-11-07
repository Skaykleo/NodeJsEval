import { describe, it, expect, beforeAll, beforeEach } from "vitest";
import request from "supertest";

import app, { cities, weather } from "../server";

beforeAll(async () => {
  // Import dynamique du serveur
  await import("../server");
  await new Promise((resolve) => setTimeout(resolve, 1000));

  console.log("Serveur démarré pour les tests");
}, 10000);

// Fonction pour réinitialiser les données entre les tests
const resetData = () => {
  cities.length = 0;
  cities.push(
    { zipCode: "75000", name: "Paris" },
    { zipCode: "69000", name: "Lyon" },
    { zipCode: "13000", name: "Marseille" },
    { zipCode: "31000", name: "Toulouse" },
    { zipCode: "21000", name: "Dijon" }
  );

  weather.length = 0;
  weather.push(
    { id: 1, zipCode: "75000", townName: "Paris", weather: "pluie" },
    { id: 2, zipCode: "69000", townName: "Lyon", weather: "beau" },
    { id: 3, zipCode: "13000", townName: "Marseille", weather: "neige" }
  );
};

beforeEach(() => {
  resetData();
});

describe(app, () => {
  it("Devrait retourner le message d'accueil", async () => {
    const response = await request(app).get("/");

    expect(response.status).toBe(200);
    expect(response.text).toBe("Hello World !");
  });

  it("Devrait retourner toutes les villes", async () => {
    const response = await request(app).get("/cities");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it("Devrait retourner une ville par son code postal", async () => {
    const response = await request(app).get("/cities/75000");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("name", "Paris");
  });

  it("Devrait supprimer une ville par son code postal", async () => {
    const response = await request(app).delete("/cities/69000");

    expect(response.status).toBe(204);
    const responseCheck = await request(app).get("/cities/69000");
    expect(responseCheck.status).toBe(404);
  });

  it("Devrait mettre à jour une ville par son code postal", async () => {
    const response = await request(app)
      .put("/cities/13000")
      .send({ name: "Marseille Updated" });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("name", "Marseille Updated");
  });

  it("Devrait retourner la météo la plus représentée d'une ville", async () => {
    // Ajouter plusieurs bulletins pour Paris avec différentes météos
    weather.push(
      { id: 4, zipCode: "75000", townName: "Paris", weather: "beau" },
      { id: 5, zipCode: "75000", townName: "Paris", weather: "beau" },
      { id: 6, zipCode: "75000", townName: "Paris", weather: "neige" }
    );

    const response = await request(app).get("/cities/75000/weather");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("zipCode", "75000");
    expect(response.body).toHaveProperty("name", "Paris");
    expect(response.body).toHaveProperty("weather", "beau");
  });

  it("Devrait retourner le bulletin météo unique si un seul existe", async () => {
    const response = await request(app).get("/cities/75000/weather");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("weather", "pluie");
  });

  it("Devrait retourner 'beau' en cas d'égalité (optimisme)", async () => {
    weather.push(
      { id: 4, zipCode: "31000", townName: "Toulouse", weather: "pluie" },
      { id: 5, zipCode: "31000", townName: "Toulouse", weather: "beau" }
    );

    const response = await request(app).get("/cities/31000/weather");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("weather", "beau");
  });

  it("Devrait retourner 'neige' en cas d'égalité avec pluie (optimisme)", async () => {
    weather.push(
      { id: 4, zipCode: "31000", townName: "Toulouse", weather: "pluie" },
      { id: 5, zipCode: "31000", townName: "Toulouse", weather: "neige" }
    );

    const response = await request(app).get("/cities/31000/weather");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("weather", "neige");
  });

  it("Devrait retourner 'beau' en cas d'égalité triple (optimisme)", async () => {
    weather.push(
      { id: 4, zipCode: "31000", townName: "Toulouse", weather: "pluie" },
      { id: 5, zipCode: "31000", townName: "Toulouse", weather: "beau" },
      { id: 6, zipCode: "31000", townName: "Toulouse", weather: "neige" }
    );

    const response = await request(app).get("/cities/31000/weather");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("weather", "beau");
  });

  it("Devrait créer un nouveau bulletin météo", async () => {
    const response = await request(app)
      .post("/cities/75000/weather")
      .send({ weather: "beau" });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(typeof response.body.id).toBe("number");
  });

  it("Devrait deleter un bulletin météo", async () => {
    const response = await request(app).delete("/weather/1");

    expect(response.status).toBe(204);
    const responseCheck = await request(app).get("/weather/1");
    expect(responseCheck.status).toBe(404);
  });
  it("Devrait donner les détails d'un bulletin météo spécifique d'une ville", async () => {
    const response = await request(app).get("/cities/13000/weather/3");
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("weather", "neige");
    expect(response.body).toHaveProperty("zipCode", "13000");
    expect(response.body).toHaveProperty("id", 3);
  });

  it("Devrait retourner un bulletin météo", async () => {
    const response = await request(app).get("/weather/3");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("weather", "neige");
    expect(response.body).toHaveProperty("id", 3);
  });

  it("Devrait renvoyer tous les bulletins météo", async () => {
    const response = await request(app).get("/weather");
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it("400 | Devrait retourner une erreur si type de météo invalide", async () => {
    const response = await request(app)
      .post("/cities/31000/weather")
      .send({ weather: "orage" });

    expect(response.status).toBe(400);
  });

  it("404 | Devrait retourner une erreur si mauvais code postal", async () => {
    const response = await request(app).get("/cities/99999");

    expect(response.status).toBe(404);
  });

  it("404 | Devrait retourner une erreur si suppression avec mauvais code postal", async () => {
    const response = await request(app).delete("/cities/99999");

    expect(response.status).toBe(404);
  });

  it("404 | Devrait retourner une erreur si bulletin météo inexistant", async () => {
    const response = await request(app).get("/weather/9999");

    expect(response.status).toBe(404);
  });

  it("404 | Devrait retourner une erreur si bulletin météo spécifique inexistant", async () => {
    const response = await request(app).get("/cities/13000/weather/9999");
    expect(response.status).toBe(404);
  });

  it("404 | Devrait retourner une erreur si ville pour bulletin météo spécifique inexistant", async () => {
    const response = await request(app).get("/cities/99999/weather/3");
    expect(response.status).toBe(404);
  });

  it("404 | Devrait retourner une erreur si suppression de bulletin météo inexistant", async () => {
    const response = await request(app).delete("/weather/9999");
    expect(response.status).toBe(404);
  });

  it("404 | Devrait retourner une erreur si création de bulletin pour ville inexistante", async () => {
    const response = await request(app)
      .post("/cities/99999/weather")
      .send({ weather: "beau" });

    expect(response.status).toBe(404);
  });

  it("404 | Devrait retourner une erreur si bulletin météo avec mauvais code postal", async () => {
    const response = await request(app).get("/cities/99999/weather");

    expect(response.status).toBe(404);
  });

  it("404 | Devrait retourner une erreur si bulletin météo introuvable", async () => {
    const response = await request(app).get("/cities/21000/weather");

    expect(response.status).toBe(404);
  });

  it("404 | Devrait retourner une erreur si mise à jour avec mauvais code postal", async () => {
    const response = await request(app)
      .put("/cities/99999")
      .send({ name: "Ville Inconnue" });

    expect(response.status).toBe(404);
  });
});
