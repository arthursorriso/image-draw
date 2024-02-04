import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { View, Pressable, StyleSheet } from "react-native";

export default function FloatingMenuButton({ onPress, buttonIcon, isActive }) {
  const iconColor = isActive ? "#FFF" : "#25292e";
  return (
    <View style={styles.container}>
      <Pressable
        style={[
          styles.circleButton,
          isActive ? { backgroundColor: "#000" } : { backgroundColor: "#FFF" },
        ]}
        onPress={onPress}
      >
        <MaterialIcons name={buttonIcon} size={20} color={iconColor} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 40,
    height: 40,
    padding: 5,
  },
  circleButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 42,
    backgroundColor: "#fff",
  },
  buttonSelected: {
    backgroundColor: "#000",
    color: "#FFF",
  },
  buttonUnSelected: {
    backgroundColor: "#FFF",
    color: "#25292e",
  },
});
