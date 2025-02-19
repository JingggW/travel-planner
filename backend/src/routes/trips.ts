import express from "express";
import { prisma } from "../lib/prisma";

const router = express.Router();

router.get("/", async (req, res) => {
  const trips = await prisma.trip.findMany();
  res.json(trips);
});

router.post("/", async (req, res) => {
  try {
    const { title, startDate, endDate, destination, ownerId } = req.body;

    // Validate required fields
    if (!title || !startDate || !endDate || !destination || !ownerId) {
      return res.status(400).json({
        error:
          "Missing required fields: title, startDate, endDate, destination, and ownerId are required",
      });
    }

    // Parse dates and validate
    const parsedStartDate = new Date(startDate);
    const parsedEndDate = new Date(endDate);

    if (isNaN(parsedStartDate.getTime()) || isNaN(parsedEndDate.getTime())) {
      return res.status(400).json({ error: "Invalid date format" });
    }

    if (parsedEndDate < parsedStartDate) {
      return res
        .status(400)
        .json({ error: "End date must be after start date" });
    }

    const trip = await prisma.trip.create({
      data: {
        title: title.trim(),
        startDate: parsedStartDate,
        endDate: parsedEndDate,
        destination: destination.trim(),
        ownerId,
        // status will default to "PLANNING" as defined in schema
      },
    });

    res.status(201).json(trip);
  } catch (error) {
    console.error("Error creating trip:", error);
    res.status(500).json({ error: "Failed to create trip" });
  }
});

export default router;
