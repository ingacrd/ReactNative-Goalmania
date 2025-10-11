import { View, Text, FlatList, Image, ActivityIndicator, RefreshControl, Platform } from 'react-native'
import { useEffect, useMemo, useRef, useState } from "react";
import { SafeAreaView } from 'react-native-safe-area-context'
import {images} from '../../constants'
import FinishedMatches from '../../components/FinishedMatches'
import NextMatch from '../../components/NextMatch'
//import { LinearGradient } from 'expo-linear-gradient';
import Constants from 'expo-constants';
  
//import fixturesMock from "../../fixtures/fixtures.json";
import fixturesMock from "../../assets/mock/fixtures.json";

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

    if (Platform.OS === 'android') return '10.0.2.2';
    // iOS Simulator: sí usa localhost al host
    if (Platform.OS === 'ios') return 'localhost';

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

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [matches, setMatches] = useState([]); // guardamos TODO y derivamos vistas por useMemo

  const abortRef = useRef(null);

  const fetchMatches = async ({ isRefresh = false } = {}) => {
    if (!isRefresh) setLoading(true);
    setError("");
    abortRef.current?.abort?.();
    const ctrl = new AbortController();
    abortRef.current = ctrl;

    try {
      if (__DEV__) console.log("📡 Fetching:", API_URL);
      const res = await fetch(API_URL, {
        headers: { Accept: "application/json" },
        signal: ctrl.signal,
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      // Evita crash si el backend devuelve texto/HTML por error
      const raw = await res.text();
      let data;
      try {
        data = JSON.parse(raw);
      } catch (e) {
        throw new Error("Payload no-JSON");
      }

      const items = extractItems(data);
      const mapped = items.map(mapItemToUi).filter((m) => m.id);
      setMatches(mapped);
    } catch (e) {
      console.warn("⚠️ API caída o payload no-JSON. Usando mock local:", e?.message);

      // ===== MOCK de respaldo =====
      // 1) Si tienes el archivo en assets/mock/fixtures.json, descomenta:
      const items = extractItems(fixturesMock);
      // 2) Si prefieres, pega aquí un require dinámico:
      // const items = extractItems(require("../../assets/mock/fixtures.json"));
      // 3) O como mínimo, mantenemos la lista vacía pero sin romper la UI:

      
      //const items = [];
      const mapped = items.map(mapItemToUi).filter((m) => m.id);
      setMatches(mapped);

      setError("Mostrando datos locales. Ver consola para detalles.");
    } finally {
      if (isRefresh) setRefreshing(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
    return () => abortRef.current?.abort?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

   const onRefresh = () => {
    setRefreshing(true);
    fetchMatches({ isRefresh: true });
  };

  const { futureMatches, finishedMatches } = useMemo(() => {
    const now = Date.now();
    const withTs = matches.filter((m) => typeof m.startTs === "number");

    const future = withTs
      .filter((m) => m.startTs > now)
      .sort((a, b) => a.startTs - b.startTs); // ascendente
    const finished = withTs
      .filter((m) => m.startTs <= now)
      .sort((a, b) => b.startTs - a.startTs); // descendente

    return { futureMatches: future, finishedMatches: finished };
  }, [matches]);


  return (

    
    <SafeAreaView className="bg-primary h-full">
    <FlatList
      data={futureMatches}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <NextMatch match={item} />}
      ListHeaderComponent={
        <View className="my-6 space-y-6">
          {/* Top bar */}
          <View className="px-4 flex-row justify-between items-center">
            <View>
              <Text className="font-pmedium text-sm text-gray-100">Bienvenido,</Text>
              <Text className="text-2xl font-psemibold text-white">Ingaru</Text>
            </View>
            <Image source={images.logoSmall} className="w-14 h-14" resizeMode="contain" />
          </View>

          {/* Finished */}
          <View className = "mt-3">
            <View className="px-4 flex-row items-center justify-between mb-2">
              <Text className="text-lg font-pregular text-gray-100">Últimos Partidos</Text>
              {loading && <ActivityIndicator size="small" />}
            </View>
            {error ? (
              <Text className="px-4 text-[11px] text-yellow-200 mt-1">{error}</Text>
            ) : null}
            <FinishedMatches posts={finishedMatches} />
          </View>

          {/* Upcoming header */}
          <View className="px-4 flex-row items-center justify-between mt-3">
            <Text className="text-lg font-pregular text-gray-100">Próximos Partidos</Text>
            <Text className="text-xs text-gray-300">({futureMatches.length})</Text>
          </View>
        </View>
      }
      ListEmptyComponent={
        !loading ? (
          <View className="px-4 pb-8">
            <Text className="text-gray-300 text-sm">No hay partidos próximos por ahora.</Text>
          </View>
        ) : null
      }
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      contentContainerStyle={{ paddingBottom: 28 }}
    />
  </SafeAreaView>
  );
}

export default Home