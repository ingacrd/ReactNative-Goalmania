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

/** Turn ApiFootballDto item into the UI shape expected */
const mapItemToUi = (item) => {
  const fixture = item?.fixture ?? {};
  const venue = fixture?.venue ?? {};
  const teams = item?.teams ?? {};
  const home = teams?.home ?? {};
  const away = teams?.away ?? {};
  const goals = item?.goals ?? {};
  const homeGoals = home?.goals ?? goals?.home ?? null;
  const awayGoals = away?.goals ?? goals?.away ?? null;

  // Derive date/time strings from ISO datetime
  let dateStr = '';
  let timeStr = '';
  let startTs = null;


  if (fixture?.date) {
  const dt = new Date(fixture.date); // ISO -> Date

  // Formato local (según el dispositivo)
  dateStr = dt.toLocaleDateString(undefined, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  timeStr = dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  startTs = dt.getTime();
}

  return {
    id: String(fixture?.id ?? ''), 
    date: dateStr,
    time: timeStr,
    place: venue?.name ?? '',
    city: venue?.city ?? '',
    startTs, 
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

        const res = await fetch(API_URL, { headers: { Accept: 'application/json' } });
        console.log('✅ Response status:', res.status);

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const raw = await res.text();
        console.log('🧾 Raw payload:', raw.slice(0, 500)); // limit length

        let data;
        try {
          data = JSON.parse(raw);
        } catch(err) {
          console.error('❌ JSON parse error:', err?.message);
          throw new Error('Payload no-JSON');
        }

        
        const items = extractItems(data);
        const transformed = items.map(mapItemToUi);

        const now = Date.now();
        const upcoming = transformed.filter(f => f.startTs && f.startTs > now);
        const finished = transformed.filter(f => f.startTs && f.startTs <= now);         
        setFinishedMatches(finished);
        setFutureMatches(upcoming);

      } catch (error) {

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
          <Text className="text-lg font-pregular text-gray-100 mb-3">Últimos Partidos</Text>
          <FinishedMatches posts={finishedMatches} />
          <Text className="text-lg font-pregular text-gray-100 mt-4">Próximos Partidos</Text>
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