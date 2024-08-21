
import { Stack } from 'expo-router';
import { SplashScreen } from 'expo-router';
import {useFonts} from 'expo-font'
import { useEffect } from 'react';


SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
    const[fontsLoaded, error] = useFonts({
    "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
  });

    useEffect(() => {
    if(error) throw error;
    if(fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded, error])

  if(!fontsLoaded) return null;

  return (
    <Stack>
        <Stack.Screen name="index" options={{headerShown: false}}/>
        <Stack.Screen name="(auth)" options={{headerShown: false}}/>
        <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
      </Stack>
  );
}

export default RootLayout

