import { useMemo } from "react";
import images from "./images.json";
import { shuffleArray } from "./utils";
import { Header } from "./components/Header";
import { Gallery } from "./components/Gallery";

interface ImageData {
  src: string;
  width: number;
  height: number;
}

function App() {
  const shuffledImages = useMemo(() => shuffleArray(images as ImageData[]), []);

  return (
    <div className="container">
      <Header />
      <Gallery photos={shuffledImages} />
    </div>
  );
}

export default App;
