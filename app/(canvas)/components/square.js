import { useEffect, useState } from "react";
import rough from "roughjs/bundled/rough.esm";

const generator = rough.generator();

function createSquare(x1, y1, x2, y2) {
  const width = x2 - x1;
  const height = y2 - y1;

  const roughElement = generator.rectangle(x1, y1, width, height, {
    fill: "black",
    fillStyle: "none",
    fillWeight: 1,
    hachureGap: 5,
    roughness: 2,
    fillAngle: 45,
  });

  return { x1, y1, x2, y2, roughElement };
}

export default function Square() {
  const [drawing, setDrawing] = useState(false);
  const [elements, setElements] = useState([]);

  useEffect(() => {
    const canvas = document.getElementById("canvas");
    canvas.width = 800;
    canvas.height = 600;

    const roughCanvas = rough.canvas(canvas);

    elements.forEach((element) => {
      roughCanvas.draw(element.roughElement);
    });
  }, [elements]);

  const handleMouseDown = (event) => {
    event.preventDefault();
    setDrawing(true);

    const x = event.clientX;
    const y = event.clientY;

    const element = createSquare(x, y, x, y);
    setElements((prevArray) => [...prevArray, element]);
  };

  const handleMouseMove = (event) => {
    if (!drawing) return;
    event.preventDefault();

    const x = event.clientX;
    const y = event.clientY;

    const index = elements.length - 1;
    const { x1, y1 } = elements[index];
    const updatedElement = createSquare(x1, y1, x, y);

    const elementsCopy = [...elements];
    elementsCopy[index] = updatedElement;
    setElements(elementsCopy);
  };

  const handleMouseUp = (event) => {
    event.preventDefault();
    setDrawing(false);
  };

  return (
    <canvas
      id="canvas"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      style={{ border: "1px solid black" }}
    ></canvas>
  );
}
