import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import rough from "roughjs/bundled/rough.esm";

const generator = rough.generator();

function createElement(id, x1, y1, x2, y2, drawMode) {
  if (drawMode === "line") {
    return {
      id,
      x1,
      y1,
      x2,
      y2,
      type: "line",
      roughElement: generator.line(x1, y1, x2, y2),
    };
  } else if (drawMode === "rectangle") {
    return {
      id,
      x1,
      y1,
      x2,
      y2,
      type: "rectangle",
      roughElement: generator.rectangle(x1, y1, x2 - x1, y2 - y1, {
        fill: "black",
        fillWeight: 1,
        hachureGap: 5,
        roughness: 1,
        fillAngle: 45,
      }),
    };
  }
}

const cursorForPosition = (position) => {
  switch (position) {
    case "tl":
    case "br":
    case "start":
    case "end":
      return "nwse-resize";
    case "tr":
    case "bl":
      return "nesw-resize";
    default:
      return "move";
  }
};

const nearPoint = (x, y, x1, y1, name) => {
  return Math.abs(x - x1) < 5 && Math.abs(y - y1) < 5 ? name : null;
};

//this code is for moving objects. I was following a tutorial.

//takes mouse position (x, y) and element to work out if a given point is within the boundary
//of a shape
function positionWithinElement(x, y, element) {
  const { type, x1, x2, y1, y2 } = element;
  if (element.type === "rectangle") {
    const topLeft = nearPoint(x, y, x1, y1, "tl");
    const topRight = nearPoint(x, y, x2, y1, "tr");
    const bottomLeft = nearPoint(x, y, x1, y2, "bl");
    const bottomRight = nearPoint(x, y, x2, y2, "br");

    const inside = x >= x1 && x <= x2 && y >= y1 && y <= y2 ? "inside" : null;
    return topLeft || topRight || bottomLeft || bottomRight || inside;

    //this works by checking is the distance between the two points that make up a line.
    //if a - b is the total length. If a, b, c is the same length as a -b then the pointer is
    //on the line. If a, b, c is longer than a, b then the pointer is off the line.
  } else if (element.type === "line") {
    const a = { x: x1, y: y1 };
    const b = { x: x2, y: y2 };
    const c = { x, y };
    const offset = distance(a, b) - (distance(a, c) + distance(b, c));
    const start = nearPoint(x, y, x1, y1, "start");
    const end = nearPoint(x, y, x2, y2, "end");
    const inside = Math.abs(offset) < 1 ? "inside" : null;
    return start || end || inside;
  }
}

const distance = (a, b) =>
  Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));

function getElementAtPosition(x, y, elements) {
  return elements
    .map((element) => ({
      ...element,
      position: positionWithinElement(x, y, element),
    }))
    .find((element) => element.position !== null);
}

//adjust coordinates depending on what way the object is drawn
const adjustElementCoordinates = (element) => {
  const { type, x1, y1, x2, y2 } = element;
  if (type === "rectangle") {
    const minX = Math.min(x1, x2);
    const maxX = Math.max(x1, x2);
    const minY = Math.min(y1, y2);
    const maxY = Math.max(y1, y2);
    return { x1: minX, y1: minY, x2: maxX, y2: maxY };
  } else {
    if (x1 < x2 || (x1 === x2 && y1 < y2)) {
      return { x1, y1, x2, y2 };
    } else {
      return { x1: x2, y1: y2, x2: x1, y2: y1 };
    }
  }
};
export default function MoveObjects() {
  const [action, setAction] = useState("none");
  const [elements, setElements] = useState([]);
  const [drawMode, setDrawMode] = useState("line");
  const [tool, setTool] = useState("drawing");
  const [selectedElement, setSelectedElement] = useState(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = document.getElementById("canvas");
    const roughCanvas = rough.canvas(canvas);
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    elements.forEach((element) => roughCanvas.draw(element.roughElement));
  }, [elements]);

  //update element coordinates in array when moved
  function updateElement(index, x1, y1, x2, y2, type) {
    const updatedElement = createElement(index, x1, y1, x2, y2, type);

    setElements((prevElements) => {
      return prevElements.map((element, i) => {
        if (i === index) {
          return updatedElement;
        }
        return element;
      });
    });
  }

  const handleMouseDown = (event) => {
    event.preventDefault();
    const canvas = document.getElementById("canvas");
    const rect = canvas.getBoundingClientRect();
    const x = event.clinetX - rect.left;
    const y = event.clinetY - rect.left;
    // const { x, y } = event;
    if (tool === "selection") {
      const element = getElementAtPosition(x, y, elements);
      if (element) {
        const offsetX = x - element.x1;
        const offsetY = y - element.y1;
        setSelectedElement({ ...element, offsetX, offsetY });
        if (element.position === "inside") {
          setAction("moving");
        } else {
          setAction("resize");
        }
      }
    } else {
      const id = elements.length;
      const element = createElement(id, x, y, x, y, tool);
      setElements((prevArray) => [...prevArray, element]);
      setAction("drawing");
    }
  };

  const handleMouseMove = (event) => {
    event.preventDefault();
    const canvas = document.getElementById("canvas");
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    if (tool === "selection") {
      const element = getElementAtPosition(x, y, elements);
      event.target.style.curser = element
        ? cursorForPosition(element.position)
        : "default";
    }

    if (action === "drawing") {
      const index = elements.length - 1;
      const { x1, y1 } = elements[index];
      updateElement(index, x1, y1, x, y, drawMode);
    } else if (action === "moving" && selectedElement) {
      const { id, x1, y1, x2, y2, type } = selectedElement;
      const width = x2 - x1;
      const height = y2 - y1;

      updateElement(
        id,
        x - offset.x,
        y - offset.y,
        x - offset.x + width,
        y - offset.y + height,
        type
      );
    }
  };

  const handleMouseUp = () => {
    const index = elements.length - 1;
    const { id, type } = elements[index];
    if (action === "drawing") {
      const { x1, y1, x2, y2 } = adjustElementCoordinates(elements[index]);
      updateElement(id, x1, y1, x2, y2, type);
    }
    setAction("none");
    setSelectedElement(null);
  };

  const handleToolChange = (newTool) => {
    setTool(newTool);
    if (newTool !== "selection") {
      setAction("none");
      setSelectedElement(null);
    }
  };

  return (
    <>
      <Button
        onClick={() => {
          setDrawMode("freehand");
          handleToolChange("drawing");
        }}
      >
        Freehand
      </Button>
      <Button
        onClick={() => {
          setDrawMode("rectangle");
          handleToolChange("drawing");
        }}
      >
        Rectangle
      </Button>
      <Button
        onClick={() => {
          setDrawMode("line");
          handleToolChange("drawing");
        }}
      >
        Line
      </Button>
      <Button
        onClick={() => {
          handleToolChange("selection");
        }}
      >
        Selection
      </Button>
      <canvas
        id="canvas"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{ border: "1px solid black" }}
        width={800}
        height={600}
      ></canvas>
    </>
  );
}
