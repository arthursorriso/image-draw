import { useContext } from "react";
import { StyleSheet, View, Dimensions } from "react-native";
import { GestureDetector, Gesture } from "react-native-gesture-handler";

import { CanvaDraw } from "./CanvaDraw";
import { PolygonContext } from "../contexts/PolygonContext";

export const PolygonShapeDraw = () => {
  const { addItemToPolygon, removeItemFromPolygon, selectItemFromPolygon, setInitilDrag, editItemFromPolygon, isDeleteOpen, isEditOpen, isEditVertexOpen, isSelectEdit } =
    useContext(PolygonContext);

  const gestureEditDelete = Gesture.Tap()
    .runOnJS(true)
    .onEnd((e) => {
      const newCoordinate = { x: e.x, y: e.y };
      if (isEditOpen) {
        addItemToPolygon(newCoordinate);
      }

      if (isDeleteOpen) {
        removeItemFromPolygon(newCoordinate);
      }

      if (isEditVertexOpen) {
        selectItemFromPolygon(newCoordinate)
      }
    });
  
  const gestureDrag = Gesture.Pan().runOnJS(true)
    .onStart((e) => {
      const coordinate = {x: e.x, y: e.y}
      setInitilDrag(coordinate)
    })
    .onUpdate((e) => {
      const coordinate = {x: e.x, y: e.y}
      editItemFromPolygon(coordinate)
    })

  return (
    <View style={styles.container}>
      {isEditOpen || isDeleteOpen || isEditVertexOpen ? (
        <GestureDetector gesture={isSelectEdit? gestureDrag :gestureEditDelete}>
          <CanvaDraw />
        </GestureDetector>
      ) : (
        <CanvaDraw />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    position: "absolute",
  },
});
