import { View, Text, FlatList, Image } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import {images} from '../../constants'
import FinishedMatches from '../../components/FinishedMatches'
import NextMatch from '../../components/NextMatch'

const lastmatches = [
  {id: 1, date:'2023-09-08', place: 'Estadio Centenario', city: 'Montevideo', 
    teams: {
      home:{
        name: 'Uruguay',
        logo:  'https://media.api-sports.io/football/teams/7.png',
        goals: 3
      },
      away: {
        name: 'Chile',
        logo:  "https://media.api-sports.io/football/teams/2383.png",
        goals: 1
      }
    }
  },
  {id: 2, date:'2023-09-08', place: 'Estadio Centenario', city: 'Montevideo', 
    teams: {
      home:{
        name: 'Uruguay',
        logo:  "https://media.api-sports.io/football/teams/7.png",
        goals: 3
      },
      away: {
        name: 'Chile',
        logo:  "https://media.api-sports.io/football/teams/2383.png",
        goals: 1
      }
    }},
  {id: 3, date:'2023-09-08', place: 'Estadio Centenario', city: 'Montevideo', 
    teams: {
      home:{
        name: 'Uruguay',
        logo:  "https://media.api-sports.io/football/teams/7.png",
        goals: 3
      },
      away: {
        name: 'Chile',
        logo:  "https://media.api-sports.io/football/teams/2383.png",
        goals: 1
      }
    }},
  {id: 4, date:'2023-09-08', place: 'Estadio Centenario', city: 'Montevideo', 
    teams: {
      home:{
        name: 'Uruguay',
        logo:  'https://media.api-sports.io/football/teams/7.png',
        goals: 3
      },
      away: {
        name: 'Chile',
        logo:  "https://media.api-sports.io/football/teams/2383.png",
        goals: 1
      }
    }},
];

const Home = () => {
  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={[{id: 1, title:'uno'},{id: 2, title:'dos'},{id: 3, title:'tres'},{id: 4, title:'cuatro'},]}
        keyExtractor={(item) => item.id}
        renderItem={({item}) => (
            // <Text className="text-3xl text-white">{item.title}</Text>
            <NextMatch />
        )}
        ListHeaderComponent={()=>(
          <View className="my-6 px-4 space-y-6">
            <View className="justify-between items-start flex-row mb-6">
              <View>
                <Text className="font-pmedium text-sm text-gray-100">Wecome Back,</Text>
                <Text className="text-2xl font-psemibold text-white">User</Text>
              </View>
              <View className="mt-1.5">
                <Image
                  source={images.logoSmall}
                  className="w-9 h-10"
                  resizeMode='contain'
                />
              </View>
            </View>

            <View className="w-full flex-1 pt-5 pb-8">
              <Text className="text-gray-100 text-lg font-pregular mb-3">
                Ultimos Partidos
              </Text>

              <FinishedMatches posts = {lastmatches ?? []} />


            </View>

          </View>
        )}
      ></FlatList>
    </SafeAreaView>
  )
}

export default Home