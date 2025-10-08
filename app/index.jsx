
import { Link } from "expo-router"
import { View, Text, Pressable } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { StatusBar } from "expo-status-bar";

export default function App() {
    return (
    <SafeAreaView className="flex-1 bg-black">
      <StatusBar style="light" translucent />
      <View className="flex-1 items-center justify-center">
        <Text className="text-3xl font-pregular text-white mb-4">
          BIENVENIDOS A GOLMANIA
        </Text>

        <Link href="/home" style={{ color: "#60a5fa", fontSize: 16 }}>
          Ir a Home
        </Link>
      </View>
    </SafeAreaView>

        // <SafeAreaView className="flex-1">
        //     <View className="flex-1 items-center justify-center bg-black">
        //         <Text className="text-3xl font-pregular text-white">BIENVENIDOS A GOLMANIA</Text>
        //         <Link href="/home" style={{color: 'blue'}}>Go to Home</Link>
        //     </View>
        // </SafeAreaView>
    )
}