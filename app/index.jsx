
import "./global.css"
import { Link } from "expo-router"
import { View, Text } from "react-native"

export default function App() {
    return (
        // <View style={{flex:1, backgroundColor:'black', justifyContent:'center', alignItems:'center'}}>
        //     <Text style={{fontSize:24, color:'white', fontFamily:'Poppins-SemiBold'}}>BIENVENIDOS A GOLMANIA</Text>
        //     <Link href="/home" style={{color: 'blue'}}>Go to Home</Link>
        // </View>
        <View className="flex-1 items-center justify-center bg-red-500">
            <Text className="text-xl font-bold text-blue-500">
                Welcome to Nativewind!
            </Text>
        </View>
    )
}