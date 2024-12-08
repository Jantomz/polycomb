const path = require("path");
const fs = require("fs");
const { Workbook } = require("exceljs");
const crypto = require("crypto");

const fileType = ".xlsx";

function proStr(arr = []) {
  // Format pronunciation array into a string with " or " separator
  return arr.map((pro) => `\\ ${pro} \\`).join(" or ");
}

function posStr(arr = []) {
  // Join parts of speech array into a comma-separated string
  return arr.join(", ");
}

const generateWordlist = async (req, res) => {
  try {
    const size = req.params.size || 100; // Default size to 100 if not provided
    const listName = crypto.randomBytes(8).toString("hex"); // Generate a random filename
    const lines = fs
      .readFileSync(path.join("data", "wordbank.txt"), "utf8") // Read wordbank file
      .split("\n") // Split file into lines
      .map((line) => line.trim()) // Trim whitespace from each line
      .filter((line) => line.length > 0); // Filter out empty lines

    lines.sort(() => Math.random() - 0.5); // Shuffle lines randomly

    const wb = new Workbook(); // Create a new Excel workbook
    const ws = wb.addWorksheet("Sheet 1"); // Add a worksheet to the workbook

    const fontFamily = "Times New Roman"; // Set default font family

    setSheetStyle(ws, fontFamily); // Apply styles to the worksheet

    for (let i = 0; i < size; i++) {
      try {
        const term = JSON.parse(lines[i]); // Parse each line as JSON
        ws.addRow([
          term.name,
          proStr(term.pronunciation), // Format pronunciation
          posStr(term.partOfSpeech), // Format parts of speech
          term.definition,
          term.sentences[0],
          term.etymology,
        ]).eachCell((cell) => {
          cell.font = { name: fontFamily }; // Apply font to each cell
        });
      } catch (err) {
        console.error("Error parsing line:", lines[i]);
        console.error("Error details:", err);
      }
    }
    const filePath = path.join("/tmp", `${listName}${fileType}`); // Define file path
    await wb.xlsx.writeFile(filePath); // Write workbook to file

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=Noam-Wordlist-${size}${fileType}` // Set download filename
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" // Set content type for Excel file
    );

    const fileStream = fs.createReadStream(filePath); // Create a read stream for the file
    fileStream.pipe(res); // Pipe the file stream to the response

    fileStream.on("end", () => {
      deleteFile(filePath); // Delete the file after streaming
    });

    fileStream.on("error", (err) => {
      console.error("Error streaming file:", err);
      res.status(500).send("Error downloading file");
    });
  } catch (err) {
    console.error("Error generating wordlist:", err);
    res.status(500).send("Internal Server Error");
  }
};

function setSheetStyle(ws, fontFamily) {
  const headers = [
    "Word",
    "Pronunciation",
    "Part Of Speech",
    "Definition",
    "Sentence",
    "Etymology",
  ];
  ws.addRow(headers).eachCell((cell) => {
    cell.font = { size: 13, bold: true, name: fontFamily }; // Apply header styles
  });
}

function deleteFile(filePath) {
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error("Error deleting file:", err);
    }
  });
}

const generateDifficultyRating = async (req, res) => {
  try {
    const { word } = req.params;

    if (!word) {
      return res.status(400).json({ error: "Word is required" }); // Validate input
    }

    const wordFrequency = (word, corpus) => {
      const words = corpus.split(/[^a-zA-Z]+/).filter((w) => w.length > 1); // Split corpus into words
      const frequency = words.filter(
        (w) => w.toLowerCase() === word.toLowerCase() // Count occurrences of the word
      ).length;
      return frequency;
    };

    const corpus = fs.readFileSync(
      path.join("data/nltk", "corpus.txt"),
      "utf8"
    ); // Read corpus file
    const frequency = wordFrequency(word, corpus); // Calculate word frequency

    res.status(200).json({ word, frequency }); // Respond with word frequency
  } catch (err) {
    console.error("Error generating difficulty rating:", err);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = { generateWordlist, generateDifficultyRating };
