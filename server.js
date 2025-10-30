const http = require("http");
const fs = require("fs");
const url = require("url");
const { MongoClient } = require("mongodb");

const uri = "mongodb://127.0.0.1:27017";
const client = new MongoClient(uri);
const dbName = "result";
const collectionName = "student_result";

async function getStudentByRoll(roll) {
  await client.connect();
  const db = client.db(dbName);
  const students = db.collection(collectionName);

  const rollNum = parseInt(roll, 10); // ✅ convert to integer
  console.log("🔹 Searching roll number:", rollNum);

  const student = await students.findOne({ roll_number: rollNum });
  console.log("🔹 Query result:", student);
  return student;
}

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);

  if (parsedUrl.pathname === "/" || parsedUrl.pathname === "/form.html") {
    fs.readFile("form.html", (err, data) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "text/plain" });
        return res.end("Error loading form.html");
      }
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(data);
    });
  } else if (parsedUrl.pathname === "/result.html") {
    fs.readFile("result.html", (err, data) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "text/plain" });
        return res.end("Error loading result.html");
      }
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(data);
    });
  } else if (parsedUrl.pathname === "/result") {
    const { roll } = parsedUrl.query;

    if (!roll) {
      res.writeHead(400, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ error: "Roll number is required" }));
    }

    try {
      const student = await getStudentByRoll(roll);

      if (!student) {
        res.writeHead(404, { "Content-Type": "application/json" });
        return res.end(
          JSON.stringify({
            message:
              "You have entered an incorrect Roll Number, Date of Birth, or School Name. Please check and try again.",
          })
        );
      }

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(student));
    } catch (err) {
      console.error("❌ Database error:", err);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Internal Server Error" }));
    }
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not Found");
  }
});

server.listen(3000, () =>
  console.log("✅ Server running at http://localhost:3000")
);
