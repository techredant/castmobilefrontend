import { useLevel } from "@/context/LevelContext";
import { useTheme } from "../../context/ThemeContext";
import { Text } from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";

export function LevelHeader() {
  const { theme } = useTheme();
  const { currentLevel } = useLevel();

  const rawLevelValue =
    typeof currentLevel === "object"
      ? currentLevel?.value
      : currentLevel ?? "home";

  const levelType =
    typeof currentLevel === "object"
      ? currentLevel?.type
      : null;

  // 🔥 Convert "home" → "national"
  const displayValue =
    rawLevelValue?.toLowerCase() === "home"
      ? "national"
      : rawLevelValue ?? "national";

  const formattedLevel =
    displayValue.charAt(0).toUpperCase() + displayValue.slice(1);

  return (
    <Animated.View
      entering={FadeInUp.delay(200).duration(300)}
      className="px-4 py-3 justify-center items-center mt-8"
      style={{ backgroundColor: theme.card }}
    >
      <Text className="font-bold" style={{ color: theme.text , fontSize: 18, marginTop: 20}}>
        {formattedLevel}
        {levelType && levelType !== "home" ? ` ${levelType}` : ""}
      </Text>
    </Animated.View>
  );
}
