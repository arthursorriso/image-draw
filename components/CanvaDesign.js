import {
  Canvas,
  Path,
  Skia,
  useTouchHandler,
} from "@shopify/react-native-skia";
import { Children, useRef, useState } from "react";
import { StyleSheet } from "react-native";

export default function CanvaDesign() {
  const currentPah = useRef(null);
  const [paths, setPaths] = useState([]);
  const onTouch = useTouchHandler({
    onStart: ({ x, y }) => {
      currentPah.current = Skia.Path.Make();
      currentPah.current.moveTo(x, y);
    },
    onActive: ({ x, y }) => {
      currentPah.current.lineTo(x, y);
    },
    onEnd: () => {
      setPaths((values) => values.concat(currentPah.current));
      currentPah.current = null;
    },
  });

  return (
    <Canvas style={styles.container} onTouch={onTouch}>
      {Children.toArray(
        paths.map((path) => (
          <Path path={path} style="stroke" strokeWidth={4} color="#3EB489" />
        )),
      )}
    </Canvas>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    top: -350,
  },
});
