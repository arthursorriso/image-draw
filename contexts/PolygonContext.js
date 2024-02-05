import { createContext, useReducer, useState } from "react";

export const createAction = (type, payload) => ({ type, payload });

export const PolygonContext = createContext({
  isEditOpen: false,
  isDeleteOpen: false,
  isEditVertexOpen: false,
  isSelectEdit: false,
  setIsEditOpen: () => {},
  setIsDeleteOpen: () => {},
  onEditVertexHandle: () => {},
  coordinates: [],
  edges: [],
  addItemToPolygon: () => {},
  removeItemFromPolygon: () => {},
  clearItemFromPolygon: () => {},
  selectItemFromPolygon: () => {},
  editItemFromPolygon: () => {},
  setInitilDrag: () => {},
  onEditHandle: () => {},
  onDeleteHandle: () => {},
});

const POLYGON_ACTION_TYPES = {
  SET_POLYGON_ITEMS: "SET_POLYGON_ITEMS",
};

const INITIAL_STATE = {
  isEditOpen: false,
  isDeleteOpen: false,
  isEditVertexOpen: false,
  isSelectEdit: false,
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

const selectPolygonItem = (coordinates, itemToSelect) => {
  const threshold = 20;

  const existingCoordinate = coordinates.find((coordinate) => {
    return (
      between(
        itemToSelect.x,
        coordinate.x - threshold,
        coordinate.x + threshold,
      ) &&
      between(
        itemToSelect.y,
        coordinate.y - threshold,
        coordinate.y + threshold,
      )
    );
  });

  return existingCoordinate
}

const editPolygonItem = (coordinates, itemToEdit, initalDrag, isSelectEdit, currentEdit) => {
  const itemInital = isSelectEdit

  const difference = differenceCoordinates(initalDrag, itemToEdit)
  
  const newCoordinate = {x: itemInital.x - difference.x, y: itemInital.y - difference.y}

  const oldCoordinate = coordinates.find((coordinate) => coordinate == currentEdit)

  const index = coordinates.indexOf(oldCoordinate)
  coordinates[index] = newCoordinate

  const newEdges = fillEdges(coordinates);

  return {
    coordinates: coordinates,
    edges: newEdges,
    newSelect: coordinates[index]
  }
}

const differenceCoordinates = (initalDrag, itemToEdit) => {
  const x = initalDrag.x - itemToEdit.x
  const y = initalDrag.y - itemToEdit.y

  return {
    x: x,
    y: y
  }
}

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
  const [isEditVertexOpen, setIsEditVertexOpen] = useState(false)
  const [isSelectEdit, setIsSelectEdit] = useState(false)
  const [initalDrag, setInitilDrag] = useState({})
  const [currentEdit, setCurrentEdit] = useState({})

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

  const selectItemFromPolygon = (itemToSelect) => {
    const existingCoordinate = selectPolygonItem(coordinates, itemToSelect);
    if (existingCoordinate){
      setIsSelectEdit(existingCoordinate)
      setCurrentEdit(existingCoordinate)
    }
  }
  const editItemFromPolygon = (itemToEdit) => {
    const itemsAndNewCoordinate = editPolygonItem(coordinates, itemToEdit, initalDrag, isSelectEdit, currentEdit);
    const newPolygonItems = {coordinates:itemsAndNewCoordinate.coordinates, edges: itemsAndNewCoordinate.edges}
    updatePolygonItemsReducer(
      newPolygonItems.coordinates,
      newPolygonItems.edges,
    );
    setCurrentEdit(itemsAndNewCoordinate.newSelect)
  }

  const onEditHandle = () => {
    if (isEditOpen) {
      setIsEditOpen(false);
    } else {
      setIsEditOpen(true);
      setIsDeleteOpen(false);
      setIsEditVertexOpen(false)
      setIsSelectEdit(false)
    }
  };

  const onDeleteHandle = () => {
    if (isDeleteOpen) {
      setIsDeleteOpen(false);
    } else {
      setIsEditOpen(false);
      setIsDeleteOpen(true);
      setIsEditVertexOpen(false)
      setIsSelectEdit(false)
    }
  };

  const onEditVertexHandle = () => {
    if (isEditVertexOpen){
      setIsEditVertexOpen(false)
      setIsSelectEdit(false)
    } else {
      setIsEditVertexOpen(true)
      setIsDeleteOpen(false)
      setIsEditOpen(false)
      setIsSelectEdit(false)
    }
  } 

  const value = {
    isEditOpen,
    setIsEditOpen,
    isDeleteOpen,
    isEditVertexOpen,
    isSelectEdit,
    setIsDeleteOpen,
    addItemToPolygon,
    removeItemFromPolygon,
    clearItemFromPolygon,
    selectItemFromPolygon,
    editItemFromPolygon,
    setInitilDrag,
    onDeleteHandle,
    onEditHandle,
    onEditVertexHandle,
    coordinates,
    edges,
  };

  return (
    <PolygonContext.Provider value={value}>{children}</PolygonContext.Provider>
  );
};
