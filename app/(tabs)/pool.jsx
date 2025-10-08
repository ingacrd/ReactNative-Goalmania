import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text } from "react-native";

export default function Pool() {
  return (
    <SafeAreaView className="flex-1 bg-primary">
      <View className="p-4">
        <Text className="text-white font-psemibold text-xl">Apuestas</Text>
        <Text className="text-gray-300 mt-2">Componente en construcción…</Text>
      </View>
    </SafeAreaView>
  );
}