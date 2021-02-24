const connectDB = require("./config/db");
const File = require("./models/file");
const fs = require("fs");
//  script to clear files older than 1 hour

connectDB();

// Get all records older than 1 hour
async function fetchData() {
  const files = await File.find({
    createdAt: { $lt: new Date(Date.now() - 60 * 60 * 1000) },
  });
  if (files.length) {
    for (const file of files) {
      try {
        fs.unlinkSync(file.path);
        await file.remove();
        console.log(`successfully deleted ${file.filename}`);
      } catch (err) {
        console.log(`error while deleting file ${err} `);
      }
    }
  }
  console.log("Job done!");
}

fetchData().then(process.exit);
