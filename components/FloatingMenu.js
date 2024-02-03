import { StyleSheet, View } from "react-native";

import FloatingMenuButton from "./FloatingMenuButton";

export const FloatingMenu = () => {
  return (
    <View style={styles.container}>
      <FloatingMenuButton onPress={() => {}} buttonIcon="add" />
      <FloatingMenuButton onPress={() => {}} buttonIcon="delete" />
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
