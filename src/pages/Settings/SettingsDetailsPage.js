import React from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomHeader from "../../components/CustomHeader";
import { useUserContext } from '../../context/userContext';

function SettingsDetailsPage({ navigation }) {
  const { i18n } = useUserContext();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <CustomHeader title="Settings Details" navigation={navigation} />
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>{i18n.t('Setting')}</Text>
      </View>
    </SafeAreaView>
  );
}

export default SettingsDetailsPage;
