import { useState } from "react"; // Importing useState hook from React

const WordlistGenerator = () => {
  const [size, setSize] = useState(0); // Declaring state variable 'size' with initial value 0

  return (
    <div className="flex flex-col items-center justify-center w-full sm:w-max">
      <div className="border-2 border-yellow-300 p-6 rounded-lg shadow-md w-full sm:w-auto">
        <h1 className="text-2xl font-bold mb-4 text-yellow-700">
          Wordlist Generator
        </h1>
        <label className="block mb-2 text-yellow-700">Number of Words</label>
        <input
          className="border-2 border-yellow-300 p-2 rounded-lg mb-4 w-full"
          type="number"
          min="1"
          name="size"
          onChange={(e) => setSize(e.target.value)} // Update 'size' state when input value changes
          value={size} // Bind input value to 'size' state
        />
        <a
          href={`http://localhost:8080/api/tool/generate-wordlist/${size}`} // Dynamic URL based on 'size' state
          className="bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600 transition duration-300 block text-center"
        >
          Generate
        </a>
      </div>
    </div>
  );
};

export default WordlistGenerator; // Exporting the component as default
