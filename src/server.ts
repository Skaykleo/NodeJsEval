import express from "express";
import {City} from "./type";
import routes from "./routes/routes";
const app = express();

app.use(express.json());
app.use('/', routes);

export const cities: City[] = [
    { name: "Paris", zipCode: "75000" },
    { name: "Lyon", zipCode: "69000" },
    { name: "Marseille", zipCode: "13000" },
];

app.get('/', (_req, res) => {
    res.send('Hello World !');
})

export default app;