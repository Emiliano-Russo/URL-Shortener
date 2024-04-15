require("dotenv").config();
const express = require("express");
const cors = require("cors");
const redis = require("redis");
const shortid = require("shortid");
const NodeCache = require("node-cache");
const myCache = new NodeCache({ stdTTL: 600, checkperiod: 120 });
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

const redisClient = redis.createClient({
  host: process.env.REDIS_URL,
  port: process.env.REDIS_PORT,
});
redisClient.on("error", (err) => console.log("Redis Client Error", err));
redisClient.connect();

function normalizeUrl(url) {
  try {
    const urlObj = new URL(url);
    urlObj.protocol = urlObj.protocol.toLowerCase();
    urlObj.hostname = urlObj.hostname.toLowerCase();
    return urlObj.toString();
  } catch (error) {
    return null;
  }
}

app.post("/shorten", async (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  const normalizedUrl = normalizeUrl(url);
  if (!normalizedUrl) {
    return res.status(400).json({ error: "Invalid URL" });
  }

  const id = shortid.generate();
  await redisClient.set(id, normalizedUrl);
  res.json({ shortUrl: `${process.env.BASE_URL}/${id}` });
});

app.get("/:id", async (req, res) => {
  const { id } = req.params;
  let url = myCache.get(id);
  if (url) {
    res.redirect(url);
    return;
  }

  url = await redisClient.get(id);
  if (url) {
    myCache.set(id, url); // Guardar en el cache en memoria
    res.redirect(url);
  } else {
    res.status(404).send("URL not found");
  }
});

app.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const url = await redisClient.del(id);
  if (url === 1) {
    // Redis devuelve 1 si el key fue borrado exitosamente
    // Ahora eliminamos la entrada del cache en memoria
    myCache.del(id);
    res.status(200).send("URL deleted successfully");
  } else {
    // Si no se encontro la URL en Redis, intentamos eliminar del cache por si acaso
    myCache.del(id);
    res.status(404).send("URL not found");
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
