import express from "express";

const app = express();

app.listen(3001, "0.0.0.0", () => {
  console.log("Server running on port 3001");
});
