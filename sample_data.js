const { MongoClient } = require("mongodb");

const uri = "mongodb://127.0.0.1:27017";
const client = new MongoClient(uri);

async function insertSampleData() {
  try {
    await client.connect();
    const db = client.db("schoolDB");
    const students = db.collection("students");

    const sampleStudents = [
      {
        rollNumber: 101,
        fullName: "Amit Sharma",
        fatherName: "Rajesh Sharma",
        motherName: "Suman Sharma",
        dob: "2007-05-12",
        schoolName: "Green Valley School",
        subjects: {
          English: 89,
          Hindi: 78,
          Math: 92,
          Science: 85,
          "Social Science": 80,
          Punjabi: 74
        }
      },
      {
        rollNumber: 102,
        fullName: "Sara Khan",
        fatherName: "Imran Khan",
        motherName: "Nasreen Khan",
        dob: "2007-09-18",
        schoolName: "City Public School",
        subjects: {
          English: 82,
          Hindi: 88,
          Biology: 90,
          Science: 86,
          "Social Science": 84,
          Urdu: 79
        }
      }
    ];

    await students.insertMany(sampleStudents);
    console.log("✅ Sample data inserted!");
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

insertSampleData();
