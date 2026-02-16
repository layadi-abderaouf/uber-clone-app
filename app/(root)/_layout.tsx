import { Stack, Redirect } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";

export default function ProtectedLayout() {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) return null;

  if (!isSignedIn) {
    return <Redirect href="/(auth)/welcome" />;
  }

  return <Stack >
    <Stack.Screen name="(tabs)" options={{headerShown:false}} />
    <Stack.Screen name="find-ride" options={{headerShown:false}} />
    <Stack.Screen name="confirm-ride" options={{headerShown:false}} />
    <Stack.Screen name="book-ride" options={{headerShown:false}} />
  </Stack>;
}
