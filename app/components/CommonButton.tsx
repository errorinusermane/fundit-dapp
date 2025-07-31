import React from "react";
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
} from "react-native";
import { colors, spacing, typography, radius, shadows } from "@/styles";

interface CommonButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
}

const CommonButton: React.FC<CommonButtonProps> = ({
  title,
  onPress,
  disabled = false,
  loading = false,
  fullWidth = true,
  style,
}) => {
  const backgroundColor = disabled ? colors.muted : colors.primary;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.button,
        { backgroundColor },
        fullWidth && { alignSelf: "stretch" },
        shadows.soft,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={styles.text}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 48,
    borderRadius: radius.lg,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
    marginVertical: spacing.sm,
  },
  text: {
    color: "#fff",
    fontSize: typography.subtitle,
    fontWeight: typography.fontWeight.bold,
  },
});

export default CommonButton;
