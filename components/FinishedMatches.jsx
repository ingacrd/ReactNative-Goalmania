import { View, Text, FlatList, Image, Animated, Dimensions, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import React, { useMemo, useRef, useState, useCallback, useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';


const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = Math.min(300, Math.round(SCREEN_WIDTH * 0.65));
const CARD_HEIGHT = 176;           
const ITEM_SPACING = 5;          
const SNAP_INTERVAL = CARD_WIDTH + ITEM_SPACING;
const SIDE_PADDING = Math.round((SCREEN_WIDTH - CARD_WIDTH) / 2);

const Team = ({ name, logo }) => (
  <View className="items-center" style={{ maxWidth: CARD_WIDTH * 0.38 }}>
    <Image source={{ uri: logo }} className="w-12 h-12" resizeMode="contain" />
    <Text numberOfLines={1} className="text-white text-[12px] mt-1 text-center">
      {name}
    </Text>
  </View>
);

const ResultCard = ({ item, index, scrollX}) => {

   const inputRange = [
    (index - 1) * SNAP_INTERVAL,
    index * SNAP_INTERVAL,
    (index + 1) * SNAP_INTERVAL,
  ];

  const centerProgress = scrollX.interpolate({
    inputRange,
    outputRange: [0, 1, 0],
    extrapolate: 'clamp',
  });

  const scale = scrollX.interpolate({
    inputRange,
    outputRange: [0.70, 1, 0.70],
    extrapolate: 'clamp',
  });

  const opacity = scrollX.interpolate({
    inputRange,
    outputRange: [0.7, 1, 0.7],
    extrapolate: 'clamp',
  });

  const activeGradientOpacity = centerProgress;         
  const inactiveGradientOpacity = Animated.subtract(1, centerProgress);

  const scoreHome =
    item?.teams?.home?.goals ?? '—';
  const scoreAway =
    item?.teams?.away?.goals ?? '—';

  return (
    <Animated.View
      style={{
        width: SNAP_INTERVAL,       
        alignItems: 'center',
        opacity,
        transform: [{ scale }],
        
      }}
    >

      <View
        style={{
          width: CARD_WIDTH,
          height: CARD_HEIGHT,
          borderRadius: 24,
          overflow: 'hidden', 
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Animated.View
          pointerEvents="none"
          style={[StyleSheet.absoluteFillObject, { opacity: inactiveGradientOpacity }]}
        >
          <LinearGradient
            colors={['#414158', '#414158']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>

        <Animated.View
          pointerEvents="none"
          style={[StyleSheet.absoluteFillObject, { opacity: activeGradientOpacity }]}
        >
          <LinearGradient
            colors={['#5B7FFF', '#B55DFF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>

        <Text className="text-white text-[12px] mb-2">{item.date}</Text>
        <View className="flex-row mt-2 justify-between w-full px-4">
          <Team name={item.teams.home.name} logo={item.teams.home.logo} />
          <View className="items-center justify-center px-2">
            <Text className="text-white text-[34px] font-psemibold tracking-wide">
              {scoreHome} - {scoreAway}
            </Text>
          </View>
          <Team name={item.teams.away.name} logo={item.teams.away.logo} />
        </View>

        {item.city ? (
          <Text className="text-white/85 text-[12px] mt-3" numberOfLines={1}>
            {item.city}
          </Text>
        ) : null}
      </View>
    </Animated.View>
  );
};

const FinishedMatches = ({ posts = [] }) => {
  const router = useRouter();
  const scrollX = useRef(new Animated.Value(0)).current;
  const data = useMemo(() => posts ?? [], [posts]);
  const keyExtractor = useCallback((item, i) => item?.id?.toString() ?? `k-${i}`, []);

  if (!data?.length) {
    return (
      <View className="px-4 py-3">
        <Text className="text-gray-300 text-[13px]">No hay resultados recientes.</Text>
      </View>
    );
  }
  
  return (
     <Animated.FlatList
      data={data}
      keyExtractor={keyExtractor}
      horizontal
      showsHorizontalScrollIndicator={false}
      bounces={false}
      decelerationRate="fast"
      snapToInterval={SNAP_INTERVAL}
      contentContainerStyle={{ paddingHorizontal: SIDE_PADDING }}
      onScroll={Animated.event(
        [{ nativeEvent: { contentOffset: { x: scrollX } } }],
        { useNativeDriver: true }
      )}
      scrollEventThrottle={16}
      getItemLayout={(_, index) => ({
        length: SNAP_INTERVAL,
        offset: SNAP_INTERVAL * index,
        index,
      })}
      initialNumToRender={3}
      renderItem={({ item, index }) => (
        <Pressable
          onPress={() => router.push({ pathname: '/fixture/[id]', params: { id: String(item.id) } })}
          accessibilityRole="button"
          accessibilityLabel={`Ver detalles de ${item?.teams?.home?.name} vs ${item?.teams?.away?.name}`}
        >
          <ResultCard
            item={item}
            index={index}
            scrollX={scrollX}
          />
        </Pressable>
      )}
    />
  );
};

export default FinishedMatches;