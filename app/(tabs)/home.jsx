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

    <SafeAreaView style={{flex:1, backgroundColor:'#181928'}}>
      <View style={{padding:16}}>
        <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom:24}}>
          <View>
            <Text style={{fontSize:14, color:'#D2B5FF'}}>Bienvenido,</Text>
            <Text style={{fontSize:24, color:'white', fontFamily:'Poppins-SemiBold'}}>Ingaru</Text>
          </View>
          <Image
            source={images.logoSmall}
            style={{width:64, height:64}}
            resizeMode='contain'
          />
        </View>

        <View>
          <Text style={{fontSize:18, color:'#D2B5FF', marginBottom:12}}>Últimas Eliminatorias</Text>
          <FinishedMatches posts={finishedMatches} />
          <Text style={{fontSize:18, color:'#D2B5FF', marginTop:16}}>Próximas Eliminatorias</Text>
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