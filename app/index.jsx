

import { Link } from "expo-router"
import { View, Text } from "react-native"

export default function App() {
    return (
        <View style={{flex:1, backgroundColor:'black', justifyContent:'center', alignItems:'center'}}>
            <Text style={{fontSize:24, color:'white', fontFamily:'Poppins-SemiBold'}}>BIENVENIDOS A GOLMANIA</Text>
            <Link href="/home" style={{color: 'blue'}}>Go to Home</Link>
        </View>
    )
}