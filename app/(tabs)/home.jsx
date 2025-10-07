import { View, Text, FlatList, Image, ActivityIndicator, Platform } from 'react-native'
import { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import {images} from '../../constants'
import FinishedMatches from '../../components/FinishedMatches'
import NextMatch from '../../components/NextMatch'
//import { LinearGradient } from 'expo-linear-gradient';
import Constants from 'expo-constants';
  
import fixturesMock from "../../fixtures/fixtures.json";

// ==== 1) Resolver host correcto para RN ====
const resolveHost = () => {

    // 1) Prefer Expo dev server host (works for physical devices on LAN)
  try {
    const hostUri =
      Constants?.expoConfig?.hostUri ||
      Constants?.manifest2?.extra?.expoClient?.hostUri ||
      Constants?.manifest?.debuggerHost || // "192.168.x.x:19000"
      '';
    const ip = String(hostUri).split(':')[0];
    if (ip) return ip;             // <-- use 192.168.x.x
  } catch {}


  // Android Emulator (AVD): localhost del host = 10.0.2.2
  try{
    if (Platform.OS === 'android') return '10.0.2.2';
    // iOS Simulator: sí usa localhost al host
    if (Platform.OS === 'ios') return 'localhost';
  }catch{}


  return 'localhost';
};
const API_URL = `http://${resolveHost()}:8080/api/fixtures`;


/** Safe numeric converter (NaN or non-finite -> null) */
const toNullableInt = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

/** Turn ApiFootballDto item into the UI shape your components expect */
const mapItemToUi = (item) => {
  const fixture = item?.fixture ?? {};
  const venue = fixture?.venue ?? {};
  const teams = item?.teams ?? {};
  const home = teams?.home ?? {};
  const away = teams?.away ?? {};
  const goals = item?.goals ?? {};

  // Prefer team-embedded goals if present; otherwise use root goals.{home,away}
  const homeGoals = home?.goals ?? goals?.home ?? null;
  const awayGoals = away?.goals ?? goals?.away ?? null;

  // Derive date/time strings from ISO datetime
  let dateStr = '';
  let timeStr = '';
  if (fixture?.date) {
    const dt = new Date(fixture.date);
    // Keep formatting simple and stable for now
    dateStr = dt.toISOString().slice(0, 10); // YYYY-MM-DD
    timeStr = dt.toISOString().slice(11, 16); // HH:mm (UTC-based)
  }

  return {
    id: String(fixture?.id ?? ''), // keyExtractor wants string
    date: dateStr,
    time: timeStr,
    place: venue?.name ?? '',
    city: venue?.city ?? '',
    teams: {
      home: {
        name: home?.name ?? '',
        logo: home?.logo ?? '',
        goals: toNullableInt(homeGoals),
      },
      away: {
        name: away?.name ?? '',
        logo: away?.logo ?? '',
        goals: toNullableInt(awayGoals),
      },
    },
  };
};

/** Normalize either: [{...}, ...] or { response: [{...}, ...] } */
const extractItems = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (payload && Array.isArray(payload.response)) return payload.response;
  return [];
};

const Home = () => {

   const [futureMatches, setFutureMatches] = useState([]);
   const [finishedMatches, setFinishedMatches] = useState([]);

   useEffect(() => {
    // Function to fetch fixtures from the API
    const fetchMatches = async () => {
      try {
        console.log('📡 Fetching from:', API_URL);
        // const response = await fetch('https://golmania.onrender.com/api/fixtures');
        // const data = await response.json();
         //const response = await fetch('https://golmania.onrender.com/api/fixtures');
         const res = await fetch(API_URL, { headers: { Accept: 'application/json' } });
         console.log('✅ Response status:', res.status);

         if (!res.ok) throw new Error(`HTTP ${res.status}`);
        
         //const data = await response.json();
        const raw = await res.text();
        console.log('🧾 Raw payload:', raw.slice(0, 500)); // limit length

        let data;
        try {
          data = JSON.parse(raw);
        } catch {
          console.error('❌ JSON parse error:', err.message);
          throw new Error('Payload no-JSON');
        }

        
        const items = extractItems(data);
        const transformed = items.map(mapItemToUi);

        const finished = transformed.filter(f => f.teams?.home?.goals !== null && f.teams?.away?.goals !== null);
        const upcoming = transformed.filter(f => f.teams?.home?.goals === null || f.teams?.away?.goals === null);
                 

        setFinishedMatches(finished);
        setFutureMatches(upcoming);


      } catch (error) {
        // console.error('Error fetching fixtures:', error);
        console.warn('API caída o payload no-JSON. Usando fixtures locales:', error?.message || error);
         const transformedMatches = fixturesMock.map(fixture => ({
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
         const matchesWithGoals = transformedMatches.filter(f => f.teams.home.goals !== null);
         const matchesWithNoGoals = transformedMatches.filter(f => f.teams.home.goals == null);
         setFinishedMatches(matchesWithGoals);
         setFutureMatches(matchesWithNoGoals);
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