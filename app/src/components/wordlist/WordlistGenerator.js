import { useState } from "react";

const WordlistGenerator = () => {
  const [size, setSize] = useState(0);

  return (
    <div>
      <input
        type="number"
        name="size"
        onChange={(e) => setSize(e.target.value)}
        value={size}
      />
      <a href={`http://localhost:8080/api/tool/generate-wordlist/${size}`}>
        Generate
      </a>
    </div>
  );
};

export default WordlistGenerator;
