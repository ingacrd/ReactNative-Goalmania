import { View, Text, Image} from 'react-native'
import React from 'react'
import { LinearGradient } from 'expo-linear-gradient';

const NextMatch = ({match}) => {

  const { city, date, teams, time } = match;
  const { home, away } = teams;

  return (
    <View className="m-auto mb-3 w-11/12 h-24 bg-secondary flex flex-row justify-around items-center overflow-hidden rounded-3xl p-4">
      
      <View className="flex flex-row items-center gap-3">
        <Text className="text-xs text-white mb-1 text-center">{home.name}</Text>
        <Image source={{uri: home.logo}}
              className="w-9 h-9"
              resizeMode='contain'
              />
      </View>
      <View>
        <Text className="text-xs text-white mb-1 text-center">{date}</Text>
        <Text className="text-xs text-white mb-1 text-center">{time}</Text>
      </View>
      <View className="flex flex-row items-center gap-3">
        <Image source={{uri: away.logo}}
              className="w-9 h-9"
              resizeMode='contain'
              />
        <Text className="text-xs text-white mb-1 text-center">{away.name}</Text>
      </View>
      <View></View>

    </View>

  )
}

export default NextMatch