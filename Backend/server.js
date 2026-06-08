const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");

const itemRoutes = require("./routes/itemRoutes");

console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_NAME:", process.env.DB_NAME);
const app = express();

const corsOptions = {
  origin: [
    "http://localhost:3000",
    "https://inventory-project-fzqz.vercel.app",
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());

app.use("/api", itemRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server Running on Port ${PORT}`);
});
