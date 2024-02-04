import { createContext, useReducer, useState } from "react";

export const createAction = (type, payload) => ({ type, payload });

export const PolygonContext = createContext({
  isEditOpen: false,
  isDeleteOpen: false,
  setIsEditOpen: () => {},
  setIsDeleteOpen: () => {},
  coordinates: [],
  edges: [],
  addItemToPolygon: () => {},
  removeItemFromPolygon: () => {},
  clearItemFromPolygon: () => {},
  onEditHandle: () => {},
  onDeleteHandle: () => {},
});

const POLYGON_ACTION_TYPES = {
  SET_POLYGON_ITEMS: "SET_POLYGON_ITEMS",
};

const INITIAL_STATE = {
  isEditOpen: false,
  isDeleteOpen: false,
  coordinates: [],
  edges: [],
};

const addPolygonItem = (coordinates, edges, itemToAdd) => {
  if (edges.length > 2) {
    edges.pop();
  }
  const newCoordinates = [...coordinates, itemToAdd];
  const lastEdge = edges.length > 0 ? edges.slice(-1)[0].p2 : itemToAdd;

  const newEdges =
    edges.length >= 2
      ? [
          ...edges,
          { p1: lastEdge, p2: itemToAdd },
          { p1: itemToAdd, p2: edges[0].p1 },
        ]
      : [...edges, { p1: lastEdge, p2: itemToAdd }];
  return { coordinates: newCoordinates, edges: newEdges };
};

const between = (value, min, max) => {
  return value >= min && value <= max;
};

const fillEdges = (coordinates) => {
  return coordinates.map((coordinate, index) => {
    return {
      p1: coordinate,
      p2: coordinates[index + 1] ? coordinates[index + 1] : coordinates[0],
    };
  });
};

const removePolygonItem = (coordinates, edges, itemToRemove) => {
  const threshold = 20;

  const existingCoordinate = coordinates.find((coordinate) => {
    return (
      between(
        itemToRemove.x,
        coordinate.x - threshold,
        coordinate.x + threshold,
      ) &&
      between(
        itemToRemove.y,
        coordinate.y - threshold,
        coordinate.y + threshold,
      )
    );
  });

  const newCoordinates = coordinates.filter(
    (coordinate) => coordinate !== existingCoordinate,
  );

  const newEdges = fillEdges(newCoordinates);

  return {
    coordinates: newCoordinates,
    edges: existingCoordinate ? newEdges : edges,
  };
};

const clearPolygonItem = () => {
  return { coordinates: [], edges: [] };
};

const polygonReducer = (state, action) => {
  const { type, payload } = action;

  switch (type) {
    case POLYGON_ACTION_TYPES.SET_POLYGON_ITEMS:
      return {
        ...state,
        ...payload,
      };
    default:
      throw new Error(`Unhandled type ${type} in polygonReducer`);
  }
};

export const PolygonProvider = ({ children }) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [{ coordinates, edges }, dispatch] = useReducer(
    polygonReducer,
    INITIAL_STATE,
  );

  const updatePolygonItemsReducer = (coordinates, edges) => {
    const payload = {
      coordinates,
      edges,
    };

    dispatch(createAction(POLYGON_ACTION_TYPES.SET_POLYGON_ITEMS, payload));
  };

  const addItemToPolygon = (itemToAdd) => {
    const newPolygonItems = addPolygonItem(coordinates, edges, itemToAdd);
    updatePolygonItemsReducer(
      newPolygonItems.coordinates,
      newPolygonItems.edges,
    );
  };

  const removeItemFromPolygon = (itemToRemove) => {
    const newPolygonItems = removePolygonItem(coordinates, edges, itemToRemove);
    updatePolygonItemsReducer(
      newPolygonItems.coordinates,
      newPolygonItems.edges,
    );
  };

  const clearItemFromPolygon = () => {
    const newPolygonItems = clearPolygonItem(coordinates, edges);
    updatePolygonItemsReducer(
      newPolygonItems.coordinates,
      newPolygonItems.edges,
    );
  };

  const onEditHandle = () => {
    if (isEditOpen) {
      setIsEditOpen(false);
    } else {
      setIsEditOpen(true);
      setIsDeleteOpen(false);
    }
  };

  const onDeleteHandle = () => {
    if (isDeleteOpen) {
      setIsDeleteOpen(false);
    } else {
      setIsEditOpen(false);
      setIsDeleteOpen(true);
    }
  };

  const value = {
    isEditOpen,
    setIsEditOpen,
    isDeleteOpen,
    setIsDeleteOpen,
    addItemToPolygon,
    removeItemFromPolygon,
    clearItemFromPolygon,
    onDeleteHandle,
    onEditHandle,
    coordinates,
    edges,
  };

  return (
    <PolygonContext.Provider value={value}>{children}</PolygonContext.Provider>
  );
};
