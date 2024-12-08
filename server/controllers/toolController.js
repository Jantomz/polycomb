const path = require("path");
const fs = require("fs");
const { Workbook } = require("exceljs");
const crypto = require("crypto");

const fileType = ".xlsx";

function proStr(arr = []) {
  return arr.map((pro) => `\\ ${pro} \\`).join(" or ");
}

function posStr(arr = []) {
  return arr.join(", ");
}

const generateWordlist = async (req, res) => {
  try {
    const size = req.params.size || 100;
    const listName = crypto.randomBytes(8).toString("hex");
    const lines = fs
      .readFileSync(path.join("data", "wordbank.txt"), "utf8")
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    lines.sort(() => Math.random() - 0.5);

    const wb = new Workbook();
    const ws = wb.addWorksheet("Sheet 1");

    const fontFamily = "Times New Roman";

    setSheetStyle(ws, fontFamily);

    for (let i = 0; i < size; i++) {
      try {
        const term = JSON.parse(lines[i]);
        ws.addRow([
          term.name,
          proStr(term.pronunciation),
          posStr(term.partOfSpeech),
          term.definition,
          term.sentences[0],
          term.etymology,
        ]).eachCell((cell) => {
          cell.font = { name: fontFamily };
        });
      } catch (err) {
        console.error("Error parsing line:", lines[i]);
        console.error("Error details:", err);
      }
    }
    const filePath = path.join("/tmp", `${listName}${fileType}`);
    await wb.xlsx.writeFile(filePath);

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=Noam-Wordlist-${size}${fileType}`
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);

    fileStream.on("end", () => {
      deleteFile(filePath);
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
    cell.font = { size: 13, bold: true, name: fontFamily };
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
      return res.status(400).json({ error: "Word is required" });
    }

    const wordFrequency = (word, corpus) => {
      const words = corpus.split(/[^a-zA-Z]+/).filter((w) => w.length > 1);
      const frequency = words.filter(
        (w) => w.toLowerCase() === word.toLowerCase()
      ).length;
      return frequency;
    };

    const corpus = fs.readFileSync(
      path.join("data/nltk", "corpus.txt"),
      "utf8"
    );
    const frequency = wordFrequency(word, corpus);

    res.status(200).json({ word, frequency });
  } catch (err) {
    console.error("Error generating difficulty rating:", err);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = { generateWordlist, generateDifficultyRating };
