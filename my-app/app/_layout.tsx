import { Slot, Stack } from "expo-router";
import { useState } from "react";

export default function RootLayout() {
  const [isLoggedIn] = useState(false);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {isLoggedIn ? (
        <Stack.Screen name="(tabs)" />
      ) : (
        <Stack.Screen name="(auth)" />
      )}
    </Stack>
  );
}
