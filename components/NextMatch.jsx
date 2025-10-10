

import { View, Text, Image } from 'react-native';
import React, { memo } from 'react';

const Team = ({ side }) => (
  <View className="flex-1 flex-row items-center gap-2">
    {side === 'home' && (
      <>
        <Text
          numberOfLines={1}
          className="text-white text-[13px] font-pmedium flex-1 text-right"
        >
          {/* name on left side aligns right */}
        </Text>
      </>
    )}
  </View>
);

// Re-usable row for each team (mirrored)
const TeamRow = ({ name, logo, align = 'left' }) => (
  <View
    className={`flex-1 flex-row items-center ${align === 'left' ? 'justify-start' : 'justify-end'} gap-2`}
    accessibilityRole="text"
    accessibilityLabel={`${name}`}
  >
    {align === 'left' && (
      <>
        <Text
          numberOfLines={1}
          className="text-white text-[13px] font-pmedium max-w-[110px]"
        >
          {name}
        </Text>
        <Image source={{ uri: logo }} className="w-9 h-9" resizeMode="contain" />
      </>
    )}
    {align === 'right' && (
      <>
        <Image source={{ uri: logo }} className="w-9 h-9" resizeMode="contain" />
        <Text
          numberOfLines={1}
          className="text-white text-[13px] font-pmedium max-w-[110px] text-right"
        >
          {name}
        </Text>
      </>
    )}
  </View>
);

const Kickoff = ({ date, time, city }) => (
  <View className="px-3">
    <Text className="text-white/90 text-[12px] text-center">{date}</Text>
    <Text className="text-white text-[12px] font-psemibold text-center">{time}</Text>
    {city ? (
      <Text className="text-white/60 text-[11px] text-center mt-1" numberOfLines={1}>
        {city}
      </Text>
    ) : null}
  </View>
);

const NextMatch = ({ match }) => {
  const { city, date, time, teams } = match;
  const { home, away } = teams;

  return (
    <View
      className="mx-auto mb-3 w-[92%] h-24 bg-[#414158] rounded-3xl px-4 flex-row items-center"
      accessibilityRole="button"
      accessibilityLabel={`Próximo partido: ${home?.name} vs ${away?.name} el ${date} a las ${time}`}
    >
      <TeamRow name={home?.name} logo={home?.logo} align="left" />
      <Kickoff date={date} time={time} city={city} />
      <TeamRow name={away?.name} logo={away?.logo} align="right" />
    </View>
  );
};

export default memo(NextMatch);
