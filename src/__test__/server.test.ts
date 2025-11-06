import { describe, it, expect, beforeAll, afterAll, afterEach } from "vitest";
import request from "supertest";

import app from "../server";

beforeAll(async () => {
    // Import dynamique du serveur
    await import ("../server");
    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log("Serveur démarré pour les tests");
}, 10000);

describe(app, () => {
    it("Devrait retourner le message d'accueil", async () => {
        const response = await request(app).get("/");

        expect(response.status).toBe(200);
        expect(response.text).toBe("Hello World !");
    });
    it ("Devrait retourner toutes les villes", async () => {
        const response = await request(app).get("/cities");

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    })
    it("Devrait retourner une ville par son code postal", async () => {
        const response = await request(app).get("/cities/75000");

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("name", "Paris");
    })
    it("404 | Devrait retourner une erreur si mauvais code postal", async () => {
        const response = await request(app).get("/cities/99999");

        expect(response.status).toBe(404);
    })
    it ("Devrait supprimer une ville par son code postal", async () => {
        const response = await request(app).delete("/cities/69000");

        expect(response.status).toBe(204);
        const responseCheck = await request(app).get("/cities/69000");
        expect(responseCheck.status).toBe(404);
    })
    it("404 | Devrait retourner une erreur si suppression avec mauvais code postal", async () => {
        const response = await request(app).delete("/cities/99999");

        expect(response.status).toBe(404);
    })

});

