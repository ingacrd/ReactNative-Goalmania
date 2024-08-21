import { View, Text, FlatList, TouchableOpacity, ImageBackground, Image, Alert } from 'react-native'
import React, { useState } from 'react'
import * as Animatable from 'react-native-animatable'
import { icons } from '../constants';
import { SafeAreaView } from 'react-native-safe-area-context';





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

const MatchItem = ({ activeItem, item}) => {

  const isActve = activeItem === item.id;
  const backGroundColor = isActve ? 'bg-indigo-600' : 'bg-secondary'

  return (
   
    <Animatable.View
      className="mr-1"
      animation={isActve ? zoomIn : zoomOut}
      duration={500}
    >

      <View className={`w-72 h-44 ${backGroundColor} flex justify-center items-center overflow-hidden rounded-3xl p-4`}>
          <Text className="text-xs text-white mb-3">{item.date}</Text>
          
          <View className="flex flex-row mt-2">
            <View className="items-center">
              <Image source={{uri: item.teams.home.logo}}
              className="w-12 h-12"
              resizeMode='contain'
              />
              <Text className="text-xs text-white mb-1 text-center">{item.teams.home.name}</Text>
            </View>

            <View>
              <Text className="text-3xl font-psemibold text-center text-white mx-7">{item.teams.home.goals} - {item.teams.away.goals}</Text>
            </View>

            <View className="items-center">
              <Image source={{uri: item.teams.away.logo}}
              className="w-12 h-12"
              resizeMode='contain'
              />
              <Text className="text-xs text-white mb-1 text-center">{item.teams.away.name}</Text>
            </View>
              
          </View>
          <Text className="text-xs text-white mb-4">{item.city}</Text>
      </View>

   </Animatable.View> 
  )
}


const FinishedMatches = ({posts}) => {
  const [activeItem, setActiveItem] = useState(posts[0])
  const viewableItemsChanged = ({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setActiveItem(viewableItems[0].key);
    }
  };
  console.log(posts)
  return (
     <FlatList
        data={posts}
        
        keyExtractor={(item) => item.id}
        renderItem={({item}) => (
            // <Text className="text-3xl text-white">{item.id}</Text>
            <MatchItem activeItem={activeItem} item={item}/>
        )}
        onViewableItemsChanged={viewableItemsChanged}
        viewabilityConfig={{
        itemVisiblePercentThreshold: 70,
        }}
        contentOffset={{ x: 170 }}
        horizontal
    />
  )
}

export default FinishedMatches