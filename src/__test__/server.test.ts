import { describe, it, expect, beforeAll, afterAll, afterEach } from "vitest";
import request from "supertest";

import app from "../server";

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
});

