import { View, Text, FlatList, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import {images} from '../../constants'
import FinishedMatches from '../../components/FinishedMatches'
import NextMatch from '../../components/NextMatch'
import { LinearGradient } from 'expo-linear-gradient';




const Home = () => {
   const [futureMatches, setFutureMatches] = useState([]);
   const [finishedMatches, setFinishedMatches] = useState([]);
   useEffect(() => {
    // Function to fetch fixtures from the API
    const fetchMatches = async () => {
      try {
        
        const response = await fetch('https://golmania.onrender.com/api/fixtures');
        const data = await response.json();
        const allFixtures = data.allFixtures;
        const transformedMatches = allFixtures.map(fixture => ({
          id: fixture.id,  
          date: fixture.date,
          time: fixture.time,
          place: fixture.place,
          city: fixture.city,
          teams: {
            home: {
              name: fixture.teams_home_name,
              logo: fixture.teams_home_logo,
              goals: fixture.teams_home_goals
            },
            away: {
              name: fixture.teams_away_name,
              logo: fixture.teams_away_logo,
              goals: fixture.teams_away_goals
            }
          }
        }));
        const matchesWithGoals = transformedMatches.filter(
          fixture => fixture.teams.home.goals !== null
          );
        const matchesWithNoGoals = transformedMatches.filter(
          fixture => fixture.teams.home.goals == null
          );
        setFinishedMatches(matchesWithGoals);
        setFutureMatches(matchesWithNoGoals);


      } catch (error) {
        console.error('Error fetching fixtures:', error);
      }
    };

    fetchMatches();
  }, []);

  return (

    <SafeAreaView className="bg-primary h-full">
      <View className="my-6 px-4 space-y-6">
        <View className="flex-row justify-between items-center mb-6">
          <View>
            <Text className="font-pmedium text-sm text-gray-100">Bienvenido,</Text>
            <Text className="text-2xl font-psemibold text-white">Ingaru</Text>
          </View>
          <Image
            source={images.logoSmall}
            className="w-16 h-16"
            resizeMode='contain'
          />
        </View>

        <View>
          <Text className="text-lg font-pregular text-gray-100 mb-3">Últimas Eliminatorias</Text>
          <FinishedMatches posts={finishedMatches} />
          <Text className="text-lg font-pregular text-gray-100 mt-4">Próximas Eliminatorias</Text>
        </View>
      </View>

      <FlatList
        data={futureMatches}
        keyExtractor={(item) => item.id}
        renderItem={({item}) => <NextMatch match={item} />}
      />
    </SafeAreaView>

  )
}

export default Home