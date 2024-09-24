import { View, Text, FlatList, TouchableOpacity, ImageBackground, Image, Alert } from 'react-native'
import React, { useState } from 'react'
import * as Animatable from 'react-native-animatable'
import { icons } from '../constants';
import { SafeAreaView } from 'react-native-safe-area-context';
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
      className="mr-2"
      animation={isActive ? zoomIn : zoomOut}
      duration={500}
    >
      <LinearGradient
        colors={isActive ? ['#4568DC', '#B06AB3'] : ['#414158', '#414158']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="w-72 h-44 rounded-3xl flex justify-center items-center p-4"
      >
        <Text className="text-xs text-white mb-2">{item.date}</Text>

        <View className="flex-row mt-2 justify-between w-full">
          <View className="items-center">
            <Image source={{ uri: item.teams.home.logo }} className="w-12 h-12" resizeMode='contain' />
            <Text className="text-xs text-white text-center mt-1">{item.teams.home.name}</Text>
          </View>

          <Text className="text-3xl font-psemibold text-white">{item.teams.home.goals} - {item.teams.away.goals}</Text>

          <View className="items-center">
            <Image source={{ uri: item.teams.away.logo }} className="w-12 h-12" resizeMode='contain' />
            <Text className="text-xs text-white text-center mt-1">{item.teams.away.name}</Text>
          </View>
        </View>

        <Text className="text-xs text-white mt-4">{item.city}</Text>
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