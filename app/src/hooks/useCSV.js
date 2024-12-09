const useCSV = () => {
  const parseCSV = async (csv) => {
    if (!csv || !csv.name.endsWith(".csv")) {
      throw new Error("Provided file is not a CSV");
    }
    try {
      const text = await csv.text(); // Read the CSV file as text
      const lines = String(text).split("\n"); // Split the text into lines
      if (lines.length === 0) throw new Error("CSV file is empty"); // Check if the file is empty

      const headers = lines[0]
        .split(",")
        .map((header) => header.trim().toLowerCase()); // Extract and normalize headers
      const requiredHeaders = [
        "Word",
        "Pronunciation",
        "Part of Speech",
        "Definition",
        "Etymology",
        "Sentence",
      ].map((header) => header.trim().toLowerCase()); // Define required headers

      if (!requiredHeaders.every((header) => headers.includes(header))) {
        throw new Error("CSV file is missing required headers"); // Ensure all required headers are present
      }

      return lines.slice(1).map((line) => {
        const values = [];
        let current = "";
        let inQuotes = false;
        for (let char of line) {
          if (char === '"' && inQuotes) {
            inQuotes = false; // End of quoted section
          } else if (char === '"' && !inQuotes) {
            inQuotes = true; // Start of quoted section
          } else if (char === "," && !inQuotes) {
            values.push(current.trim()); // Add value to array if not in quotes
            current = "";
          } else {
            current += char; // Append character to current value
          }
        }
        values.push(current.trim()); // Push the last value

        let wordObject = {};
        headers.forEach((header, index) => {
          if (requiredHeaders.includes(header)) {
            wordObject[header] = values[index] ? values[index].trim() : ""; // Map values to headers
          }
        });

        wordObject = {
          ...wordObject,
          audioId: "", // Add an empty audioId field
        };

        if (!wordObject.notes) {
          wordObject.notes = ""; // Ensure notes field is present
        }

        if (wordObject["part of speech"]) {
          wordObject.partOfSpeech = wordObject["part of speech"]; // Normalize part of speech field
          delete wordObject["part of speech"];
        }

        return wordObject; // Return the constructed word object
      });
    } catch (error) {
      console.error("Error parsing CSV: ", error.message); // Log parsing errors
      throw error; // Rethrow the error
    }
  };

  const getWords = async (csv) => {
    try {
      const wordsArray = await parseCSV(csv); // Parse the CSV to get words array
      return wordsArray; // Return the array of words
    } catch (error) {
      console.error("Error getting words from CSV: ", error.message); // Log errors in getting words
      throw error; // Rethrow the error
    }
  };

  return {
    getWords, // Expose the getWords function
  };
};

export default useCSV; // Export the hook
