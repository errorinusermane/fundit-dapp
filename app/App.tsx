// app/App.tsx
import React from "react";
import { SafeAreaView, StatusBar } from "react-native";
import AppNavigator from "./navigation/AppNavigator";
import { WalletProvider } from "@shared/contexts/WalletContext"; // 이건 유지
import "@/styles/global"; // 공통 스타일

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" />
      <WalletProvider>
        <AppNavigator />
      </WalletProvider>
    </SafeAreaView>
  );
}
