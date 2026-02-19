import express from "express";
import dogFacts from "./dog_facts.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Optional home route
app.get("/", (req, res) => {
  res.json({
    message: "Dog Facts API v1 Replica is running.",
    usage: [
      "GET /facts",
      "GET /facts?number=1"
    ],
    success: true
  });
});

app.get("/facts", (req, res) => {
  const { number } = req.query;

  // If number is not provided, return all facts
  if (number === undefined) {
    return res.json({ facts: dogFacts, success: true });
  }

  const n = Number(number);

  // Validate: must be an integer
  if (!Number.isInteger(n)) {
    return res.status(400).json({
      error: "Query parameter 'number' must be an integer.",
      success: false
    });
  }

  // Validate: must be >= 1
  if (n < 1) {
    return res.status(400).json({
      error: "Query parameter 'number' must be at least 1.",
      success: false
    });
  }

  // Return up to available facts (if number > facts length, return all)
  const factsToReturn = dogFacts.slice(0, Math.min(n, dogFacts.length));
  return res.json({ facts: factsToReturn, success: true });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found.", success: false });
});

app.listen(PORT, () => {
  console.log(`Dog Facts API running on http://localhost:${PORT}`);
});
