// server.js
const http = require("http");
const fs = require("fs");
const path = require("path");
const { MongoClient } = require("mongodb");
const url = require("url");

const uri = "mongodb://127.0.0.1:27017";
const client = new MongoClient(uri);

let db;

async function connectDB() {
  await client.connect();
  db = client.db("result"); // ✅ your actual DB name
  console.log("✅ Connected to MongoDB (result)");
}
connectDB();

function serveFile(res, filePath, contentType) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Not Found");
    } else {
      res.writeHead(200, { "Content-Type": contentType });
      res.end(data);
    }
  });
}

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);

  if (req.url === "/" || req.url === "/form.html") {
    serveFile(res, path.join(__dirname, "form.html"), "text/html");
  }
  else if (req.url.startsWith("/result.html")) {
    serveFile(res, path.join(__dirname, "result.html"), "text/html");
  }
  else if (parsedUrl.pathname === "/result") {
    const { roll, dob, school } = parsedUrl.query;

    console.log("🔍 Searching for:", { roll, dob, school });

    try {
      const student = await db.collection("student_result").findOne({
        roll_number: parseInt(roll),
        dob: dob,
        school_name: school
      });

      console.log("🎯 Query Result:", student);

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(student || {}));
    } catch (err) {
      console.error("❌ Error fetching data:", err);
      res.writeHead(500);
      res.end("Server Error");
    }
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not Found");
  }
});

server.listen(3000, () => {
  console.log("🚀 Server running at http://localhost:3000");
});
