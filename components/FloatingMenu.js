import { useContext } from "react";
import { StyleSheet, View } from "react-native";

import FloatingMenuButton from "./FloatingMenuButton";
import { PolygonContext } from "../contexts/PolygonContext";

export const FloatingMenu = () => {
  const {
    isDeleteOpen,
    isEditOpen,
    onDeleteHandle,
    onEditHandle,
    clearItemFromPolygon,
  } = useContext(PolygonContext);
  return (
    <View style={styles.container}>
      <FloatingMenuButton
        onPress={() => clearItemFromPolygon()}
        buttonIcon="refresh"
      />
      <FloatingMenuButton
        onPress={() => onEditHandle()}
        buttonIcon="add"
        isActive={isEditOpen}
      />
      <FloatingMenuButton
        onPress={() => onDeleteHandle()}
        buttonIcon="delete"
        isActive={isDeleteOpen}
      />
      <FloatingMenuButton onPress={() => {}} buttonIcon="save" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
  },
  circleButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 42,
    backgroundColor: "#fff",
  },
});
