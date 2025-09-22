import "./global.css"
import 'react-native-gesture-handler';
import { Stack } from 'expo-router';
import { SplashScreen } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {useFonts} from 'expo-font'
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';


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
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        {/* <Stack screenOptions={{ headerShown: false }} /> */}
        <Stack>
           <Stack.Screen name="index" options={{headerShown: false}}/>
           <Stack.Screen name="(auth)" options={{headerShown: false}}/>
           <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
         </Stack>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}

export default RootLayout

