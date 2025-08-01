// app/pages/LoginPage.tsx
import React, { useState } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import CommonButton from "@/components/CommonButton";
import LoginModal from "@/components/LoginModal";
import { colors, spacing, typography } from "@/styles";
import { UserRole } from "@shared/types/user";

export function LoginPage() {
  const [role, setRole] = useState<UserRole | null>(null);
  const [isModalVisible, setModalVisible] = useState(false);

  const handleSelectRole = (selected: UserRole) => {
    setRole(selected);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      {/* (선택사항) 로고 이미지 */}
      {/* <Image source={require("@/assets/logo.png")} style={styles.logo} /> */}
      <Text style={styles.title}>Fundit에 오신 것을 환영합니다</Text>
      <Text style={styles.subtitle}>역할을 선택해 로그인하세요</Text>

      <CommonButton
        title="Log in as Individual"
        onPress={() => handleSelectRole("user")}
        role="user"
        style={styles.button}
      />

      <CommonButton
        title="Log in as Insurer"
        onPress={() => handleSelectRole("company")}
        role="company"
        style={styles.button}
      />

      {isModalVisible && role && (
        <LoginModal role={role} onClose={() => setModalVisible(false)} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.lg,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: typography.title,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.sm,
    textAlign: "center",
  },
  subtitle: {
    fontSize: typography.body,
    color: colors.muted,
    marginBottom: spacing.xl,
    textAlign: "center",
  },
  button: {
    marginTop: spacing.md,
    alignSelf: "stretch",
  },
});
