import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());

// Test endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Basic user endpoints
app.post("/api/users", async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const user = await prisma.user.create({
      data: {
        email,
        password, // Note: In production, you should hash the password
        name,
      },
    });
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error });
  }
});

app.get("/api/users", async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
