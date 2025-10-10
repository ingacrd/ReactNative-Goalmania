import { View, Text, FlatList, Image } from 'react-native'
import React, { useMemo, useRef, useState, useCallback } from 'react';
import * as Animatable from 'react-native-animatable'
import { LinearGradient } from 'expo-linear-gradient';




const zoomIn = { 0: { scale: 0.7 }, 1: { scale: 1 } };
const zoomOut = { 0: { scale: 1 }, 1: { scale: 0.7 } };

const ResultCard = ({ item, isActive }) => {
  const scoreHome =
    item?.teams?.home?.goals ?? '—';
  const scoreAway =
    item?.teams?.away?.goals ?? '—';

  return (
    <Animatable.View
      animation={isActive ? zoomIn : zoomOut}
      duration={500}
      className="mr-2"
    >
      <LinearGradient
        colors={isActive ? ['#5B7FFF', '#B55DFF'] : ['#414158', '#414158']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{borderRadius:24}}
        className="w-72 h-44 rounded-3xl justify-center items-center px-4"
      >
        <Text className="text-white text-[12px] mb-2">{item.date}</Text>

        <View className="flex-row mt-2 justify-between w-full">
          <View className="items-center max-w-[38%]">
            <Image source={{ uri: item.teams.home.logo }} className="w-12 h-12" resizeMode="contain" />
            <Text numberOfLines={1} className="text-white text-[12px] mt-1 text-center">
              {item.teams.home.name}
            </Text>
          </View>

          <View className="items-center justify-center px-2">
            <Text className="text-white text-[34px] font-psemibold tracking-wide">
              {scoreHome} - {scoreAway}
            </Text>
          </View>

          <View className="items-center max-w-[38%]">
            <Image source={{ uri: item.teams.away.logo }} className="w-12 h-12" resizeMode="contain" />
            <Text numberOfLines={1} className="text-white text-[12px] mt-1 text-center">
              {item.teams.away.name}
            </Text>
          </View>
        </View>

        {item.city ? (
          <Text className="text-white/85 text-[12px] mt-3" numberOfLines={1}>
            {item.city}
          </Text>
        ) : null}
      </LinearGradient>
    </Animatable.View>
  );
};

const FinishedMatches = ({ posts = [] }) => {
  const [activeId, setActiveId] = useState(posts?.[0]?.id ?? null);
  const viewConfig = useRef({ itemVisiblePercentThreshold: 65 }).current;

  const onViewableItemsChanged = useCallback(({ viewableItems }) => {
    if (viewableItems?.length) {
      setActiveId(viewableItems[0].key);
    }
  }, []);

  const renderItem = useCallback(
    ({ item }) => <ResultCard item={item} isActive={activeId === item.id} />,
    [activeId]
  );

  if (!posts?.length) {
    return (
      <View className="px-4 py-3">
        <Text className="text-gray-300 text-[13px]">No hay resultados recientes.</Text>
      </View>
    );
  }
  
  return (
     <FlatList
      data={posts}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      onViewableItemsChanged={onViewableItemsChanged}
      viewabilityConfig={viewConfig}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 16 }}
      snapToAlignment="center"
      decelerationRate="fast"
      snapToInterval={304} // ~ card width + spacing for smooth paging
    />

  )
}

export default FinishedMatches