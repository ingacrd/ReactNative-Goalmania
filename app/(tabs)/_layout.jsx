import { View, Text, Image } from 'react-native'
import { Tabs } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {icons} from '../../constants'

const TabIcon = ({icon, color, name, focused}) => {
  return(
    <View className="items-center justify-center"
      style={{ width: 80, paddingVertical: 4 }}
      accessibilityRole="button"
      accessibilityLabel={name}>
      <Image
        source={icon}
        resizeMode="contain"
        style={{ tintColor: color, width: 24, height: 24 }}
        // tintColor={color}
        // className="w-6 h-6"
      />
      <Text 
        numberOfLines={1}
        ellipsizeMode="clip"
        allowFontScaling={false}
        className={`${focused? 'font-psemibold' : 'font-pregular'} text-xs mt-1`} style={{color}}>
        {name}
      </Text>
    </View>
  )
}


const TabsLayout = () => {
  const insets = useSafeAreaInsets();
  const barHeight = 62 + Math.max(insets.bottom - 6, 0); 
  return (
    <>
      <Tabs
        initialRouteName="home"
        screenOptions={{
        tabBarShowLabel: false,
        tabBarActiveTintColor: '#FFFFFF',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          backgroundColor: '#222232',
          borderTopWidth: 0,
          height: barHeight,
          paddingTop: 15,
          paddingBottom: Math.max(insets.bottom - 2, 6),
          elevation: 12,
          shadowColor: '#000',
          shadowOpacity: 0.15,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: -2 },
          
        },
        tabBarItemStyle: {
          width: 100,
        },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: 'Inicio',
            headerShown: false,
            tabBarIcon: ({color, focused}) => (
              <TabIcon 
                icon={icons.home}
                color={color}
                name="Home"
                focused={focused}
              />
            )
          }}
        />
        <Tabs.Screen
          name="pool"
          options={{
            title: 'Apuesta',
            headerShown: false,
            tabBarIcon: ({color, focused}) => (
              <TabIcon 
                icon={icons.plus}
                color={color}
                name="Pool"
                focused={focused}
              />
            )
          }}
        />

        <Tabs.Screen
          name="profile"
          options={{
            title: 'Perfil',
            headerShown: false,
            tabBarIcon: ({color, focused}) => (
              <TabIcon 
                icon={icons.profile}
                color={color}
                name="Profile"
                focused={focused}
              />
            )
          }}
        />
        <Tabs.Screen
          name="fixture/[id]"
          options={{
            href: null,           
            headerShown: false,   
          }}
        />

      </Tabs>
    </>
  )
}

export default TabsLayout