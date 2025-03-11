import { useLayoutEffect } from "react";
import rough from "./test/rough";
export default function Panel({ panelData }) {
  const generator = rough.generator();
  useLayoutEffect(() => {
    const canvas = document.getElementById("canvas");
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);

    const roughCanvas = rough.canvas(canvas);
    console.log(canvas);
    // panelData.forEach(({ roughElement }) => roughCanvas.draw(roughElement));
  }, [panelData]);
  return <canvas id="canvas"></canvas>;
}
