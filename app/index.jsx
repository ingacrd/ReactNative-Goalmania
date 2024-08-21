import { Link } from "expo-router"
import { View, Text } from "react-native"

export default function App() {
    return (
        <View className="flex-1 items-center justify-center bg-black">
            <Text className="text-3xl font-pregular text-white">BIENVENIDOS A GOLMANIA</Text>
            <Link href="/home" style={{color: 'blue'}}>Go to Home</Link>
        </View>
    )
}