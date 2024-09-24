import { View, Text, Image } from 'react-native'
import React from 'react'
import { Tabs, Redirect } from 'expo-router'
import {icons} from '../../constants'

const TabIcon = ({icon, color, name, focused}) => {
  return(
    <View className="items-center justify-center gap-2">
      <Image
        source={icon}
        resizeMode="contain"
        tintColor={color}
        className="w-6 h-6"
      />
      <Text className={`${focused? 'font-psemibold' : 'font-pregular'} text-xs`} style={{color: color}}>
        {name}
      </Text>
    </View>
  )
}


const TabsLayout = () => {
  return (
    <>
      <Tabs
        screenOptions={{
        tabBarShowLabel: false,
        tabBarActiveTintColor: '#DADADA',
        tabBarInactiveTintColor: '#797979',
        tabBarStyle: {
          backgroundColor: '#222232',
          borderTopWidth: 1,
          borderTopColor: '#222232',
          height:84,
        }
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

      </Tabs>
    </>
  )
}

export default TabsLayout