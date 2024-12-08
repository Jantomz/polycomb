const useCSV = () => {
  const parseCSV = async (csv) => {
    try {
      const text = await csv.text();
      const lines = String(text).split("\n");
      if (lines.length === 0) throw new Error("CSV file is empty");

      const headers = lines[0]
        .split(",")
        .map((header) => header.trim().toLowerCase());
      const requiredHeaders = [
        "Word",
        "Pronunciation",
        "Part Of Speech",
        "Definition",
        "Etymology",
        "Sentence",
        "Notes",
      ].map((header) => header.trim().toLowerCase());

      console.log("Headers: ", headers);
      console.log("Required Headers: ", requiredHeaders);
      console.log("Lines: ", lines);

      if (!requiredHeaders.every((header) => headers.includes(header))) {
        throw new Error("CSV file is missing required headers");
      }

      return lines.slice(1).map((line, lineIndex) => {
        const values = [];
        let current = "";
        let inQuotes = false;
        for (let char of line) {
          if (char === '"' && inQuotes) {
            inQuotes = false;
          } else if (char === '"' && !inQuotes) {
            inQuotes = true;
          } else if (char === "," && !inQuotes) {
            values.push(current.trim());
            current = "";
          } else {
            current += char;
          }
        }
        values.push(current.trim());

        let wordObject = {};
        headers.forEach((header, index) => {
          if (requiredHeaders.includes(header)) {
            wordObject[header] = values[index] ? values[index].trim() : "";
          }
        });

        wordObject = {
          ...wordObject,
          audioId: "",
        };

        if (!wordObject.notes) {
          wordObject.notes = "";
        }

        if (wordObject["part of speech"]) {
          wordObject.partOfSpeech = wordObject["part of speech"];
          delete wordObject["part of speech"];
        }

        return wordObject;
      });
    } catch (error) {
      console.error("Error parsing CSV: ", error.message);
      throw error;
    }
  };

  const getWords = async (csv) => {
    try {
      const wordsArray = await parseCSV(csv);
      return wordsArray;
    } catch (error) {
      console.error("Error getting words from CSV: ", error.message);
      throw error;
    }
  };

  return {
    getWords,
  };
};

export default useCSV;
