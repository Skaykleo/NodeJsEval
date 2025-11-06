import express from "express";

const app = express();

export default app;

app.get('/', (_req, res) => {
    res.send('Hello World !');
});