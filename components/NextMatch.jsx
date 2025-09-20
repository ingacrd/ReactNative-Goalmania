import { View, Text, Image} from 'react-native'
import React from 'react'
import { LinearGradient } from 'expo-linear-gradient';

const NextMatch = ({match}) => {

  const { city, date, teams, time } = match;
  const { home, away } = teams;

  return (
    <View style={{marginHorizontal:'auto', marginBottom:12, width:'90%', height:96, backgroundColor:'#414158', flexDirection:'row', justifyContent:'space-around', alignItems:'center', borderRadius:24, padding:16}}>

      <View style={{flexDirection:'row', alignItems:'center'}}>
        <Text style={{fontSize:12, color:'white', textAlign:'center'}}>{home.name}</Text>
        <Image source={{uri: home.logo}}
              style={{width:36, height:36}}
              resizeMode='contain'
              />
      </View>
      <View>
        <Text style={{fontSize:12, color:'white', textAlign:'center'}}>{date}</Text>
        <Text style={{fontSize:12, color:'white', textAlign:'center'}}>{time}</Text>
      </View>
      <View style={{flexDirection:'row', alignItems:'center'}}>
        <Image source={{uri: away.logo}}
              style={{width:36, height:36}}
              resizeMode='contain'
              />
        <Text style={{fontSize:12, color:'white', textAlign:'center'}}>{away.name}</Text>
      </View>

    </View>

  )
}

export default NextMatch