import { View, Text, FlatList, TouchableOpacity, ImageBackground, Image, Alert } from 'react-native'
import React, { useState } from 'react'
import * as Animatable from 'react-native-animatable'
import { icons } from '../constants';
import { LinearGradient } from 'expo-linear-gradient';






const zoomIn = {
  0: {
    scale: 0.7
  },
  1: {
    scale:1,
  }
}

const zoomOut = {
  0: {
    scale: 1
  },
  1: {
    scale:0.7,
  }
}
 
const MatchItem = ({ activeItem, item }) => {
  const isActive = activeItem === item.id;

  return (
    <Animatable.View
      style={{marginRight:8}}
      animation={isActive ? zoomIn : zoomOut}
      duration={500}
    >
      <LinearGradient
        colors={isActive ? ['#4568DC', '#B06AB3'] : ['#414158', '#414158']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{width:288, height:176, borderRadius:24, justifyContent:'center', alignItems:'center', padding:16}}
      >
        <Text style={{fontSize:12, color:'white', marginBottom:8}}>{item.date}</Text>

        <View style={{flexDirection:'row', marginTop:8, justifyContent:'space-between', width:'100%'}}>
          <View style={{alignItems:'center'}}>
            <Image source={{ uri: item.teams.home.logo }} style={{width:48, height:48}} resizeMode='contain' />
            <Text style={{fontSize:12, color:'white', textAlign:'center', marginTop:4}}>{item.teams.home.name}</Text>
          </View>

          <Text style={{fontSize:30, color:'white', fontFamily:'Poppins-SemiBold'}}>{item.teams.home.goals} - {item.teams.away.goals}</Text>

          <View style={{alignItems:'center'}}>
            <Image source={{ uri: item.teams.away.logo }} style={{width:48, height:48}} resizeMode='contain' />
            <Text style={{fontSize:12, color:'white', textAlign:'center', marginTop:4}}>{item.teams.away.name}</Text>
          </View>
        </View>

        <Text style={{fontSize:12, color:'white', marginTop:16}}>{item.city}</Text>
      </LinearGradient>
    </Animatable.View>
  );
}

const FinishedMatches = ({posts}) => {
  const [activeItem, setActiveItem] = useState(posts[0])
  const viewableItemsChanged = ({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setActiveItem(viewableItems[0].key);
    }
  };
  
  return (
     <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({item}) => (
            <MatchItem activeItem={activeItem} item={item}/>
        )}
        onViewableItemsChanged={viewableItemsChanged}
        viewabilityConfig={{
        itemVisiblePercentThreshold: 70,
        }}
        contentOffset={{ x: 170 }}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
    />

  )
}

export default FinishedMatches