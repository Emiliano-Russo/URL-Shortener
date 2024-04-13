require("dotenv").config();
const express = require("express");
const cors = require("cors");
const redis = require("redis");
const shortid = require("shortid");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

const redisClient = redis.createClient({
  host: "localhost",
  port: 6379,
});
redisClient.on("error", (err) => console.log("Redis Client Error", err));
redisClient.connect();

app.post("/shorten", async (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }
  const id = shortid.generate();
  await redisClient.set(id, url);
  res.json({ shortUrl: `${process.env.BASE_URL}/${id}` });
});

app.get("/:id", async (req, res) => {
  const { id } = req.params;
  const url = await redisClient.get(id);
  if (url) {
    // Opción para redirigir automáticamente al usuario a la URL original
    res.redirect(url);
    // Opción para devolver la URL original como un objeto JSON
    // res.json({ originalUrl: url });
  } else {
    res.status(404).send("URL not found"); // Maneja el caso donde la URL no existe
  }
});

// Endpoint para eliminar una URL corta
app.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const url = await redisClient.del(id);
  if (url === 1) {
    // Redis devuelve 1 si el key fue borrado exitosamente
    res.status(200).send("URL deleted successfully");
  } else {
    res.status(404).send("URL not found");
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
