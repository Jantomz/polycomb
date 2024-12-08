import { useState } from "react";

const WordlistGenerator = () => {
  const [size, setSize] = useState(0);

  return (
    <div className="flex flex-col items-center justify-center w-max">
      <div className="border-2 border-yellow-300 p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-yellow-700">
          Wordlist Generator
        </h1>
        <label className="block mb-2 text-yellow-700">Number of Words</label>
        <input
          className="border-2 border-yellow-300 p-2 rounded-lg mb-4 w-full"
          type="number"
          name="size"
          onChange={(e) => setSize(e.target.value)}
          value={size}
        />
        <a
          href={`http://localhost:8080/api/tool/generate-wordlist/${size}`}
          className="bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600 transition duration-300"
        >
          Generate
        </a>
      </div>
    </div>
  );
};

export default WordlistGenerator;
