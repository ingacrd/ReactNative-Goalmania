import { useEffect, useMemo, useState } from 'react';
import { View, Text, Image, ScrollView, ActivityIndicator, Platform, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Constants from 'expo-constants';

/* -------------------------------------------------------------------------------------------------
   Utils: resolvemos host igual que en Home para no romper Android/iOS/emulador
---------------------------------------------------------------------------------------------------*/
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
  return 'localhost';
};
const apiBase = `http://${resolveHost()}:8080/api/fixtures`;

/* -------------------------------------------------------------------------------------------------
   Helpers UI
---------------------------------------------------------------------------------------------------*/
const SafeText = ({ children, className, numberOfLines }) => (
  <Text className={className} numberOfLines={numberOfLines}>
    {children ?? '—'}
  </Text>
);

const eventIcon = (type, detail) => {
  if (type === 'Goal') return '⚽';
  if (detail?.includes('Yellow')) return '🟨';
  if (detail?.includes('Red')) return '🟥';
  if (type === 'subst') return '🔄';
  if (type?.toLowerCase?.() === 'var') return '🖥️';
  return '•';
};

const toPctNumber = (v) => {
  // convierte "59%" -> 59 ; "7" -> 7 ; null -> 0
  if (v == null) return 0;
  if (typeof v === 'number') return v;
  const s = String(v).trim().replace('%', '');
  const n = Number(s);
  return Number.isFinite(n) ? n : 0;
};

/* -------------------------------------------------------------------------------------------------
   Componente principal
---------------------------------------------------------------------------------------------------*/
export default function FixtureDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState('events'); // 'events' | 'lineups' | 'stats'
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const [data, setData] = useState(null);

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
        console.warn('Detalle fixture error:', e?.message);
        if (alive) setErr('No se pudo cargar el detalle del partido. Revisa el backend (/api/fixtures/{id}).');
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [id]);

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

    return {
      id: fixture.id,
      league: data.league?.name,
      round: data.league?.round,
      dateStr: dt ? dt.toLocaleDateString(undefined, { year: 'numeric', month: '2-digit', day: '2-digit' }) : '',
      timeStr: dt ? dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
      stadium: venue.name,
      city: venue.city,
      referee: fixture.referee,
      home: { name: home.name, logo: home.logo, goals: goals.home },
      away: { name: away.name, logo: away.logo, goals: goals.away },
      halftime: score?.halftime ?? {},
      fulltime: score?.fulltime ?? {},
      events: Array.isArray(data.events) ? data.events : [],
      lineups: Array.isArray(data.lineups) ? data.lineups : [],
      statistics: Array.isArray(data.statistics) ? data.statistics : [],
    };
  }, [data]);

  /* ----------------------------------- Render ----------------------------------- */
  return (
    <SafeAreaView className="flex-1 bg-primary" style={{ paddingTop: StatusBar.currentHeight || 0 }}>
      <StatusBar barStyle="light-content" backgroundColor="#7F5AF0" />
      {/* Top bar */}
      <View className="flex-row items-center justify-between px-4 pt-2 pb-2">
        <Text onPress={() => router.back()} className="text-white text-base">◀ Atrás</Text>
        <SafeText className="text-white/80 text-xs">{ui?.league}</SafeText>
        <View style={{ width: 32 }} />
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
                <Text className="text-white text-lg font-semibold mt-3" numberOfLines={1}>
                  {ui.home.name} vs {ui.away.name}
                </Text>
                <Text className="text-white text-[13px] mt-2"
                    style={{ textShadowColor: 'rgba(0,0,0,0.4)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 2 }}
                    numberOfLines={1}>
                  {ui.stadium}{ui.city ? ` · ${ui.city}` : ''}
                </Text>
                <Text className="text-white text-[12px] mt-1"
                    style={{ textShadowColor: 'rgba(0,0,0,0.4)', 
                    textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 2 }}
                >
                    {ui.dateStr} · {ui.timeStr}
                </Text>
                <Text className="text-white/90 text-[12px] mt-1"
                    style={{ textShadowColor: 'rgba(0,0,0,0.4)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 2 }}
                >
                    Árbitro: {ui.referee}
                </Text>
              </LinearGradient>
            </View>
          </View>

          {/* ======= Sub-score row ======= */}
          <View className="px-4 mt-3">
            <View className="bg-[#414158] rounded-2xl px-4 py-3 flex-row justify-between">
              <SafeText className="text-white text-sm">Descanso: {ui.halftime?.home ?? '—'} - {ui.halftime?.away ?? '—'}</SafeText>
              <SafeText className="text-white text-sm">Final: {ui.fulltime?.home ?? '—'} - {ui.fulltime?.away ?? '—'}</SafeText>
            </View>
          </View>

          {/* ======= Segmented Control ======= */}
          <View className="px-4 mt-4">
            <View className="bg-[#2B2B3B] rounded-2xl p-1 flex-row">
              {[
                { key: 'events', label: 'Eventos' },
                { key: 'lineups', label: 'Alineaciones' },
                { key: 'stats', label: 'Estadísticas' },
              ].map(tab => {
                const active = activeTab === tab.key;
                return (
                  <TouchableOpacity
                    key={tab.key}
                    onPress={() => setActiveTab(tab.key)}
                    className={`flex-1 py-2 rounded-xl items-center ${active ? 'bg-[#4B4B61]' : ''}`}
                    accessibilityRole="button"
                    accessibilityLabel={`Ver ${tab.label}`}
                  >
                    <Text className={`text-sm ${active ? 'text-white' : 'text-gray-300'}`}>{tab.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* ======= Content per tab ======= */}
          {activeTab === 'events' && (
            <Section title="Eventos">
              {ui.events.length === 0 ? (
                <EmptyRow text="Sin eventos disponibles." />
              ) : (
                ui.events.map((e, idx) => (
                  <View
                    key={`${idx}-${e?.time?.elapsed}`}
                    className="bg-[#2B2B3B] rounded-2xl px-4 py-3 mb-2 flex-row items-center"
                  >
                    <Text className="text-white text-lg mr-3">{eventIcon(e?.type, e?.detail)}</Text>
                    <View className="flex-1">
                      <Text className="text-gray-100 text-[13px] font-medium" numberOfLines={1}>
                        {e?.player?.name ?? '—'}{e?.assist?.name ? ` ↗ ${e.assist.name}` : ''}
                      </Text>
                      <Text className="text-gray-400 text-[11px]" numberOfLines={1}>
                        {e?.team?.name ?? '—'} · {e?.type}{e?.detail ? ` (${e.detail})` : ''}
                      </Text>
                    </View>
                    <Text className="text-gray-300 text-[12px] ml-3">{e?.time?.elapsed}{e?.time?.extra ? `+${e.time.extra}` : ''}'</Text>
                  </View>
                ))
              )}
            </Section>
          )}

          {activeTab === 'lineups' && (
            <Section title="Alineaciones">
              {ui.lineups.length === 0 ? (
                <EmptyRow text="Sin alineaciones." />
              ) : (
                ui.lineups.map((lu, idx) => (
                  <View key={idx} className="mb-4">
                    <View className="flex-row items-center mb-1">
                      <Image source={{ uri: lu.team?.logo }} className="w-5 h-5 mr-2" resizeMode="contain" />
                      <Text className="text-white text-[13px] font-semibold" numberOfLines={1}>
                        {lu.team?.name} · {lu.formation}
                      </Text>
                    </View>
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
          )}

          {activeTab === 'stats' && (
            <Section title="Estadísticas">
              {ui.statistics.length === 0 ? (
                <EmptyRow text="Sin estadísticas." />
              ) : (
                // Mostramos una tarjeta por equipo con barras
                ui.statistics.map((teamBlock, idx) => (
                  <View key={idx} className="mb-4">
                    <View className="flex-row items-center mb-2">
                      <Image source={{ uri: teamBlock.team?.logo }} className="w-5 h-5 mr-2" resizeMode="contain" />
                      <Text className="text-white font-semibold">{teamBlock.team?.name}</Text>
                    </View>
                    <View className="bg-[#2B2B3B] rounded-2xl p-3">
                      {(teamBlock.statistics ?? []).map((s, i) => (
                        <View key={i} className="flex-row items-center justify-between py-1">
                          <Text className="text-gray-300 text-[12px] flex-1" numberOfLines={1}>{s.type}</Text>
                          <View className="flex-row items-center">
                            <View className="h-2 w-28 bg-[#3E3E4E] rounded-full overflow-hidden mx-2">
                              <View
                                style={{
                                  width: `${Math.min(toPctNumber(s.value), 100)}%`,
                                  backgroundColor: '#7F5AF0',
                                  height: '100%',
                                }}
                              />
                            </View>
                            <Text className="text-gray-100 text-[12px] w-8 text-right" numberOfLines={1}>
                              {s.value ?? '-'}
                            </Text>
                          </View>
                        </View>
                      ))}
                    </View>
                  </View>
                ))
              )}
            </Section>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

/* ----------------------------------- UI helpers ----------------------------------- */
const Section = ({ title, children }) => (
  <View className="px-4 mt-5">
    <Text className="text-gray-100 text-base mb-2">{title}</Text>
    {children}
  </View>
);

const EmptyRow = ({ text }) => (
  <View className="bg-[#2B2B3B] rounded-2xl px-4 py-3">
    <Text className="text-gray-300 text-[12px]">{text}</Text>
  </View>
);
