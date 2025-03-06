import { Box, Button, ButtonGroup } from "@mui/material";
import { visuallyHidden } from "@mui/utils";
import {
  ArrowArcLeft,
  ArrowArcRight,
  BoundingBox,
  Cursor,
} from "@phosphor-icons/react";
import { LineSegment } from "@phosphor-icons/react/dist/ssr";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import rough from "roughjs/bundled/rough.esm";
import { useEffect } from "react";

//rough.js tool for generating shapes
const generator = rough.generator();

//function for creating squares or lines
function createElement(id, x1, y1, x2, y2, type) {
  const roughElement =
    type === "line"
      ? generator.line(x1, y1, x2, y2)
      : generator.rectangle(x1, y1, x2 - x1, y2 - y1);
  return { id, x1, y1, x2, y2, type, roughElement };
}

// Function to check if a point is near another point. We use it for resizing elements
//check the x/y position of the mouse and compares it to the x1 position of the element. Name is the part of the element - ie tr, br, bl, tl
//checks if the x and y positions are within 5 pixels and if they are it returns the name
const nearPoint = (x, y, x1, y1, name) => {
  return Math.abs(x - x1) < 5 && Math.abs(y - y1) < 5 ? name : null;
};

//Function to determine the position of the mouse in relation to an element
//first checks if the mouse is near any of the points of the rectangle and calls the nearpoint function
//it also check if the mouse is inside the element

//the else statement does the same but for a line - but checks if the mouse is at the start, end or anywhere along the line
const positionWithinElement = (x, y, element) => {
  const { type, x1, x2, y1, y2 } = element;
  if (type === "rectangle") {
    const topLeft = nearPoint(x, y, x1, y1, "tl");
    const topRight = nearPoint(x, y, x2, y1, "tr");
    const bottomLeft = nearPoint(x, y, x1, y2, "bl");
    const bottomRight = nearPoint(x, y, x2, y2, "br");
    const inside = x >= x1 && x <= x2 && y >= y1 && y <= y2 ? "inside" : null;
    return topLeft || topRight || bottomLeft || bottomRight || inside;
  } else {
    const a = { x: x1, y: y1 };
    const b = { x: x2, y: y2 };
    const c = { x, y };
    const offset = distance(a, b) - (distance(a, c) + distance(b, c));
    const start = nearPoint(x, y, x1, y1, "start");
    const end = nearPoint(x, y, x2, y2, "end");
    const inside = Math.abs(offset) < 1 ? "inside" : null;
    return start || end || inside;
  }
};

// Function to calculate the distance between two points for calculating if the cursor is on the line or not. A line is made up
//of points a and b and a distance between them. If you introduce a third point and meaasure the distance between all three
//the measurement will stay the same if it is on the line, but increase if the mouse(point c) if off the line
const distance = (a, b) =>
  Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));

//this is to determin what element is at a specific loction on the canvas
//it maps though each element and for each element it calls the positionWithinElement function to determin if the x, y coordinates of the mouse
//are in or near the element. It returns either inside, or tl, tr, br, bl for the corners - nor null if the mouse is not inside or near an element
//the find method then looks though the returned elemetns for the first one that is not null

const getElementAtPosition = (x, y, elements) => {
  return elements
    .map((element) => ({
      ...element,
      position: positionWithinElement(x, y, element),
    }))
    .find((element) => element.position !== null);
};

//this ensures the coordinates of the drawn elements are consistant regardless of what direction they were drawn in = for example if the user
//draws a square from top left to bottom right x1, y1 would be in the top left, and x2, y2 would be in the bottom right. If the user draws
//a square from the bottom up - for instance the bottom right, then this would be x1, y1. This needs to be normalised
//so our shape coordinate data is consistant.
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
      return { x1, x2, y1, y2 };
    } else {
      return { x1: x2, y1: y2, x2: x1, y2: y1 };
    }
  }
};

//determins the style of curser that should be shown depending upon where on an object the user is pointing - ir blank canvas for drawing,
// middle of element for moving, or edge of element for resizing
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

//calculates the new coordinates when an element is resized. The cases determin where o the object the curser is, and
//therefore whihc coordinate should be updated.
const resizedCoordinates = (x, y, position, coordinates) => {
  const { x1, y1, x2, y2 } = coordinates;
  switch (position) {
    case "tl":
    case "start":
      return { x1: x, y1: y, x2, y2 };
    case "tr":
      return { x1, y1: y, x2: x, y2 };
    case "bl":
      return { x1: x, y1, x2, y2: y };
    case "br":
    case "end":
      return { x1, y1, x2: x, y2: y };
    default:
      return null;
  }
};

//main component of the app.
//STATES
//elements - hold the currently drawn elements in an array of objects with the coordinates
//action - used to determin if the user is drawing, resizing or moving
//tool - stores whihc tool is currently selected - line, rectangle
//selectedElement - used to store the currently selected element for moving or resizing

const useHistory = (initialState) => {
  const [index, setIndex] = useState(0);
  const [history, setHistory] = useState([initialState]);
  const setState = (action, overwrite = false) => {
    const newState =
      typeof action === "function" ? action(history[index]) : action;
    if (overwrite) {
      const historyCopy = [...history];
      historyCopy[index] = newState;
      setHistory(historyCopy);
    } else {
      const updatedState = [...history].slice(0, index + 1);
      setHistory([...updatedState, newState]);
      setIndex((prevState) => prevState + 1);
    }
  };

  const undo = () => {
    index > 0 && setIndex((prevState) => prevState - 1);
  };
  const redo = () => {
    index < history.length - 1 && setIndex((prevState) => prevState + 1);
  };

  return [history[index], setState, undo, redo]; //returns the current state and the set state function
};

const Canvas = () => {
  const [elements, setElements, undo, redo] = useHistory([]); // Setting initial history state to an empty array
  const [action, setAction] = useState("none");
  const [tool, setTool] = useState("line");
  const [selectedElement, setSelectedElement] = useState(null);

  //used LayoutEffect is called after component is fully rendered to ensure the DOM is updated before performing drawing actions
  useLayoutEffect(() => {
    //havent really looked too much into this. I think its pretty much boilerplate stuff
    const canvas = document.getElementById("canvas");
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);

    //passes the HTML canvas element into rough.js
    const roughCanvas = rough.canvas(canvas);

    //iterates over the elements array and draws them on the canvas
    elements.forEach(({ roughElement }) => roughCanvas.draw(roughElement));
  }, [elements]);

  // Enables user to use keyboard shortcuts to undo and redo actions
  useEffect(() => {
    const undoRedoFunction = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "z") {
        if (event.shiftKey) {
          redo();
        } else {
          undo();
        }
      }
    };

    document.addEventListener("keydown", undoRedoFunction);
    return () => {
      document.removeEventListener("keydown", undoRedoFunction);
    };
  }, [undo, redo]);

  //used to update the elemetents coordinates when one is moved or resized and then sets it back into state
  //id is the identifer of the element
  // x1, y1, x2, y2 are the new coordinates
  //type - line or square
  const updateElement = (id, x1, y1, x2, y2, type) => {
    //calls the create element function with the new coordinates
    const updatedElement = createElement(id, x1, y1, x2, y2, type);
    const elementsCopy = [...elements];
    //updates the element which has been selected by its id
    elementsCopy[id] = updatedElement;
    //sets the state with updated element
    setElements(elementsCopy, true);
  };

  const handleMouseDown = (event) => {
    // const { clientX, clientY } = event;
    const rect = event.target.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    if (tool === "selection") {
      const element = getElementAtPosition(x, y, elements);
      if (element) {
        const offsetX = x - element.x1;
        const offsetY = y - element.y1;
        setSelectedElement({ ...element, offsetX, offsetY });
        setElements((prevState) => prevState);
        if (element.position === "inside") {
          setAction("moving");
        } else {
          setAction("resizing");
        }
      }
    } else {
      const id = elements.length;
      const element = createElement(id, x, y, x, y, tool);
      setElements((prevState) => [...prevState, element]);
      setSelectedElement(element);
      setAction("drawing");
    }
  };
  const handleMouseMove = (event) => {
    const rect = event.target.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    // const { clientX, clientY } = event;
    if (tool === "selection") {
      const element = getElementAtPosition(x, y, elements);
      event.target.style.cursor = element
        ? cursorForPosition(element.position)
        : "default";
    }
    if (action === "drawing") {
      const index = elements.length - 1;
      const { x1, y1 } = elements[index];
      updateElement(index, x1, y1, x, y, tool);
    } else if (action === "moving") {
      const { id, x1, x2, y1, y2, type, offsetX, offsetY } = selectedElement;
      const width = x2 - x1;
      const height = y2 - y1;
      const nexX1 = x - offsetX;
      const nexY1 = y - offsetY;
      updateElement(id, nexX1, nexY1, nexX1 + width, nexY1 + height, type);
    } else if (action === "resizing") {
      const { id, type, position, ...coordinates } = selectedElement;
      const { x1, y1, x2, y2 } = resizedCoordinates(
        x,
        y,
        position,
        coordinates
      );
      updateElement(id, x1, y1, x2, y2, type);
    }
  };
  const handleMouseUp = () => {
    if (selectedElement) {
      const index = selectedElement.id;
      const { id, type } = elements[index];
      if (action === "drawing" || action === "resizing") {
        const { x1, y1, x2, y2 } = adjustElementCoordinates(elements[index]);
        updateElement(id, x1, y1, x2, y2, type);
      }
    }
    setAction("none");
    setSelectedElement(null);
  };

  // set canvas size

  const refCanvasContainer = useRef(null);
  const [size, setSize] = useState(0);
  useEffect(() => {
    setSize(refCanvasContainer.current.clientHeight);
  }, [refCanvasContainer]);

  return (
    <>
      <ButtonGroup sx={{ mx: "auto", my: 2 }}>
        <Button variant="outlined" onClick={undo}>
          <ArrowArcLeft size={20} /> <Box sx={visuallyHidden}>Undo</Box>
        </Button>
        <Button variant="outlined" onClick={redo}>
          <ArrowArcRight size={20} /> <Box sx={visuallyHidden}>Redo</Box>
        </Button>
      </ButtonGroup>

      <Box
        ref={refCanvasContainer}
        sx={{
          bgcolor: "rgba(255,255,255,0.9)",
          border: "3px solid",
          borderColor: "primary.light",
          aspectRatio: "1/1",
          mx: "auto",
          height: "100%",
          borderRadius: 2,
        }}
      >
        <canvas
          id="canvas"
          height={size}
          width={size}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          Canvas
        </canvas>
      </Box>
      <ButtonGroup sx={{ mx: "auto", my: 2 }}>
        <Button
          variant={tool === "selection" ? "contained" : "outlined"}
          onClick={() => setTool("selection")}
        >
          <Cursor size={20} />{" "}
          <Box sx={visuallyHidden}>Move and Manipulate Object Tool</Box>
        </Button>
        <Button
          variant={tool === "line" ? "contained" : "outlined"}
          onClick={() => setTool("line")}
        >
          <LineSegment size={20} /> <Box sx={visuallyHidden}>Line Tool</Box>
        </Button>
        <Button
          variant={tool === "rectangle" ? "contained" : "outlined"}
          onClick={() => setTool("rectangle")}
        >
          <BoundingBox size={20} />{" "}
          <Box sx={visuallyHidden}>Rectangle Tool</Box>
        </Button>
      </ButtonGroup>
    </>
  );
};
export default Canvas;
