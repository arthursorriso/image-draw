import { useContext } from "react";
import { StyleSheet, View, Dimensions, Modal, TouchableOpacity, Text } from "react-native";
import { GestureDetector, Gesture } from "react-native-gesture-handler";

import { CanvaDraw } from "./CanvaDraw";
import { PolygonContext } from "../contexts/PolygonContext";
import { calculateAreaPolygon } from "../utils/calculateaArea";

export const PolygonShapeDraw = () => {
  const { addItemToPolygon, removeItemFromPolygon, selectItemFromPolygon, setInitilDrag, editItemFromPolygon, onVisibleModal, isDeleteOpen, isEditOpen, isEditVertexOpen, isSelectEdit, isModalVisible, coordinates } =
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
  
    const gestureDragAndTap = Gesture.Race(gestureEditDelete, gestureDrag)

  return (
    <View style={styles.container}>
      {isEditOpen || isDeleteOpen || isEditVertexOpen ? (
        <GestureDetector gesture={isSelectEdit? gestureDragAndTap :gestureEditDelete}>
          <CanvaDraw />
        </GestureDetector>
      ) : (
        <CanvaDraw />
      )}
      {isModalVisible && <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
      >
        <View style={{justifyContent: 'center', alignItems:'center', flex:1}}>
          <View style={{backgroundColor:'white', width: 300, borderRadius: 8, padding:16, gap: 16}}>
            <Text style={{fontSize: 24}}>A área em pixels: {calculateAreaPolygon(coordinates)}</Text>
            <TouchableOpacity onPress={onVisibleModal} style={{backgroundColor: '#d00000', borderRadius: 4, paddingVertical:8, justifyContent: 'center', alignItems: 'center'}}>
              <Text style={{color: 'white', fontSize:16}}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View> 
      </Modal>}
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
