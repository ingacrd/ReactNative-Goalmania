import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text } from "react-native";

export default function Profile() {
  return (
    <SafeAreaView className="flex-1 bg-primary">
      <View className="p-4">
        <Text className="text-white font-psemibold text-xl">Perfil</Text>
        <Text className="text-gray-300 mt-2">Pronto más detalles…</Text>
      </View>
    </SafeAreaView>
  );
}