import express from "express";
import {City, WeatherBulletin} from "./type";
import routes from "./routes/routes";
const app = express();

app.use(express.json());
app.use('/', routes);

export const cities: City[] = [
    { zipCode: "75000", name: "Paris" },
    { zipCode: "69000", name: "Lyon" },
    { zipCode: "13000", name: "Marseille" },
    { zipCode: "31000", name: "Toulouse" }
];


export const weather: WeatherBulletin [] = [
    { id: 1, zipCode: "75000", townName: "Paris", weather: "pluie" },
    { id: 2, zipCode: "69000", townName: "Lyon", weather: "beau" },
    { id: 3, zipCode: "13000", townName: "Marseille", weather: "neige" },
];

app.get('/', (_req, res) => {
    res.send('Hello World !');
})

export default app;