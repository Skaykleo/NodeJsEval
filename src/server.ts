import express from "express";
import {City} from "./type";
import routes from "./routes/routes";
const app = express();

app.use(express.json());
app.use('/', routes);

export const cities: City[] = [
    { zipCode: "75000", name: "Paris" },
    { zipCode: "69000", name: "Lyon" },
    { zipCode: "13000", name: "Marseille" }
];

app.get('/', (_req, res) => {
    res.send('Hello World !');
})

export default app;