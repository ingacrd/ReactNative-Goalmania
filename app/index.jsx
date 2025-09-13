

import { Link } from "expo-router"
import { View, Text, Pressable } from "react-native"

export default function App() {
    return (
        <View className="flex-1 items-center justify-center bg-black">
            <Text className="text-3xl font-pregular text-white">BIENVENIDOS A GOLMANIA</Text>
            {/* <Link href="/home" style={{color: 'blue'}}>Go to Home</Link> */}

            <Pressable onPress={() => router.push('/(tabs)')} className="px-4 py-3 bg-sky-500 rounded-lg" >
            <Text className="text-white font-pmedium">Entrar</Text>
            </Pressable>
        </View>
       
    )
}