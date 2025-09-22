
// import "./global.css"
import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar, Platform } from "react-native";
import { Link } from "expo-router"
import { View, Text } from "react-native"

export default function App() {
    return (

        <SafeAreaView style={{ flex: 1 }}>
        {Platform.OS === "android" && (
            <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
        )}
            <View className="flex-1 items-center justify-center bg-black">
                <Text className="text-3xl font-pregular text-white">BIENVENIDOS A GOLMANIA</Text>
                <Link href="/home" style={{color: 'blue'}}>Go to Home</Link>
            </View>
        </SafeAreaView>
    )
}