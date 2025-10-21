import { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, Image, ScrollView, ActivityIndicator, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Constants from 'expo-constants';

// ===== Host igual que Home.jsx (copiado para no tocar otros archivos) =====
const resolveHost = () => {
  try {
    const hostUri =
      Constants?.expoConfig?.hostUri ||
      Constants?.manifest2?.extra?.expoClient?.hostUri ||
      Constants?.manifest?.debuggerHost || '';
    const ip = String(hostUri).split(':')[0];
    if (ip) return ip;
  } catch {}
  if (Platform.OS === 'android') return '10.0.2.2';
  if (Platform.OS === 'ios') return 'localhost';
  return 'localhost';
};

const apiBase = `http://${resolveHost()}:8080/api/fixtures`;

const SafeText = ({ children, className }) => (
  <Text className={className}>{children ?? '—'}</Text>
);

export default function FixtureDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const [data, setData] = useState(null);

  const eventIcon = (type, detail) => {
    if (type === 'Goal') return '⚽';
    if (detail?.includes('Yellow')) return '🟨';
    if (detail?.includes('Red')) return '🟥';
    if (type === 'subst') return '🔄';
    return '⚪';
    };

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      setErr('');
      try {
        const res = await fetch(`${apiBase}/${id}`, { headers: { Accept: 'application/json' } });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const payload = await res.json();
        if (alive) setData(payload);
      } catch (e) {
        if (alive) setErr('No se pudo cargar el detalle del partido. Revisa el backend (/api/fixtures/{id}).');
        console.warn('Detalle fixture error:', e?.message);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [id]);

  // ====== Mapping mínimo a UI ======
  const ui = useMemo(() => {
    if (!data) return null;
    const fixture = data.fixture ?? {};
    const venue = fixture.venue ?? {};
    const teams = data.teams ?? {};
    const home = teams.home ?? {};
    const away = teams.away ?? {};
    const goals = data.goals ?? {};
    const score = data.score ?? {};

    const dt = fixture?.date ? new Date(fixture.date) : null;
    const dateStr = dt ? dt.toLocaleDateString(undefined, { year: 'numeric', month: '2-digit', day: '2-digit' }) : '';
    const timeStr = dt ? dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';

    const statistics = Array.isArray(data.statistics) ? data.statistics : [];
    const events = Array.isArray(data.events) ? data.events : [];
    const lineups = Array.isArray(data.lineups) ? data.lineups : [];

    const halftime = score?.halftime ?? {};
    const fulltime = score?.fulltime ?? {};

    return {
      id: fixture.id,
      dateStr,
      timeStr,
      city: venue.city,
      stadium: venue.name,
      referee: fixture.referee,
      home: { name: home.name, logo: home.logo, goals: goals.home },
      away: { name: away.name, logo: away.logo, goals: goals.away },
      halftime,
      fulltime,
      events,
      lineups,
      statistics,
      league: data.league?.name,
      round: data.league?.round,
    };
  }, [data]);

  // ====== Render ======
  return (
    <View className="flex-1 bg-primary">
      {/* Encabezado simple para navegación atrás */}
      <View className="flex-row items-center px-4 pt-4 pb-2">
        <Text onPress={() => router.back()} className="text-white text-base">◀ Atrás</Text>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator />
          <Text className="text-gray-300 mt-2">Cargando detalle…</Text>
        </View>
      ) : err ? (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-red-300 text-center">{err}</Text>
        </View>
      ) : !ui ? (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-gray-300">Sin datos.</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ paddingBottom: 28 }}>

        {/* ======= Header con gradiente y marcador ======= */}
        <View className="px-4">
        <View className="rounded-3xl overflow-hidden" style={{ height: 220 }}>
            <LinearGradient
            colors={['#7F5AF0', '#2CB67D']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 }}
            >
            <View className="flex-row justify-between items-center w-full px-8">
                <Image source={{ uri: ui.home.logo }} className="w-14 h-14" resizeMode="contain" />
                <Text className="text-white text-5xl font-extrabold">{ui.home.goals ?? 0} - {ui.away.goals ?? 0}</Text>
                <Image source={{ uri: ui.away.logo }} className="w-14 h-14" resizeMode="contain" />
            </View>
            <Text className="text-white text-lg font-semibold mt-3">{ui.home.name} vs {ui.away.name}</Text>
            <Text className="text-gray-200 text-xs mt-1">{ui.stadium} · {ui.city}</Text>
            <Text className="text-gray-300 text-xs mt-1">{ui.dateStr} · {ui.timeStr}</Text>
            <Text className="text-gray-400 text-[11px] mt-1">Árbitro: {ui.referee}</Text>
            </LinearGradient>
        </View>
        </View>


          {/* ======= Marcadores intermedios ======= */}
          <View className="px-4 mt-3">
            <View className="bg-[#414158] rounded-2xl px-4 py-3 flex-row justify-between">
              <SafeText className="text-white text-sm">Descanso: {ui.halftime?.home ?? '—'} - {ui.halftime?.away ?? '—'}</SafeText>
              <SafeText className="text-white text-sm">Final: {ui.fulltime?.home ?? '—'} - {ui.fulltime?.away ?? '—'}</SafeText>
            </View>
          </View>

          {/* ======= Eventos ======= */}
        <Section title="Eventos">
            {ui.events.length === 0 ? (
                <EmptyRow text="Sin eventos disponibles." />
            ) : (
                ui.events.map((e, idx) => (
                <View key={idx} className="bg-[#2B2B3B] rounded-2xl px-4 py-3 mb-2 flex-row items-center justify-between">
                    <Text className="text-white text-lg mr-2">{eventIcon(e?.type, e?.detail)}</Text>
                    <View className="flex-1">
                    <Text className="text-gray-100 text-[13px] font-medium">{e?.player?.name}</Text>
                    <Text className="text-gray-400 text-[11px]">{e?.team?.name}</Text>
                    </View>
                    <Text className="text-gray-300 text-[12px]">{e?.time?.elapsed}'</Text>
                </View>
                ))
            )}
        </Section>


          {/* ======= Alineaciones ======= */}
          <Section title="Alineaciones">
            {ui.lineups.length === 0 ? (
              <EmptyRow text="Sin alineaciones." />
            ) : (
              ui.lineups.map((lu, idx) => (
                <View key={idx} className="mb-3">
                  <SafeText className="text-white text-[13px] mb-1">
                    {lu.team?.name} · {lu.formation}
                  </SafeText>
                  <View className="bg-[#2B2B3B] rounded-xl p-3">
                    {(lu.startXI ?? []).map((p, i) => (
                      <SafeText key={i} className="text-gray-200 text-[12px]">
                        {p.player?.number ? `${p.player.number}. ` : ''}{p.player?.name}
                      </SafeText>
                    ))}
                  </View>
                </View>
              ))
            )}
          </Section>

          {/* ======= Estadísticas (pares clave:valor) ======= */}
          <Section title="Estadísticas">
            {ui.statistics.length === 0 ? (
                <EmptyRow text="Sin estadísticas." />
            ) : (
                ui.statistics.map((teamBlock, idx) => (
                <View key={idx} className="mb-4">
                    <Text className="text-white font-semibold mb-2">{teamBlock.team?.name}</Text>
                    {(teamBlock.statistics ?? []).map((s, i) => (
                    <View key={i} className="flex-row items-center justify-between py-1">
                        <Text className="text-gray-300 text-[12px] flex-1">{s.type}</Text>
                        <View className="flex-row items-center">
                        <View className="h-2 w-28 bg-[#3E3E4E] rounded-full overflow-hidden mx-2">
                            <View
                            style={{
                                width: `${Math.min(parseInt(s.value) || 0, 100)}%`,
                                backgroundColor: '#7F5AF0',
                                height: '100%',
                            }}
                            />
                        </View>
                        <Text className="text-gray-100 text-[12px] w-8 text-right">{s.value ?? '-'}</Text>
                        </View>
                    </View>
                    ))}
                </View>
                ))
            )}
        </Section>

        </ScrollView>
      )}
    </View>
  );
}

/* ========= UI helpers ========= */
const Section = ({ title, children }) => (
  <View className="px-4 mt-4">
    <Text className="text-gray-100 text-base mb-2">{title}</Text>
    {children}
  </View>
);

const Row = ({ left, middle, right }) => (
  <View className="bg-[#414158] rounded-2xl px-4 py-2 mb-2">
    <Text className="text-white text-[12px]">{left}  •  {middle}</Text>
    {right ? <Text className="text-white/80 text-[11px] mt-1">{right}</Text> : null}
  </View>
);

const EmptyRow = ({ text }) => (
  <View className="bg-[#2B2B3B] rounded-2xl px-4 py-3">
    <Text className="text-gray-300 text-[12px]">{text}</Text>
  </View>
);
