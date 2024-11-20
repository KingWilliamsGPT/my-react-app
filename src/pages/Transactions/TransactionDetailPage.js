import React from "react";
import { ScrollView, Text, TouchableOpacity, View, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomHeader from "../../components/CustomHeader";
import { useRoute } from "@react-navigation/native";
import Preloader from "../../components/Preloader";
import { useUserContext } from "../../context/userContext";
import { AntDesign } from '@expo/vector-icons';

function TransactionDetailPage({ navigation }) {
  const { isLoading, i18n } = useUserContext();

  const route = useRoute();
  const { churchName, amount, date, id, type, projectName, image } = route.params;

  React.useEffect(() => {
  }, [navigation])

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <CustomHeader title={i18n.t('Transaction')} navigation={navigation} />
      <View style={{ position: 'relative' }}>
        <View style={{ flexDirection: "row", height: 50, justifyContent: "space-between", alignItems: 'center', paddingHorizontal: 15, position: 'absolute', zIndex: 10, width: "100%" }}>
          <View style={{ flex: 1, justifyContent: "center" }}>
            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => navigation.navigate('Transactions')}>
              <AntDesign name="left" size={20} color="white" style={{textShadowColor: '#171717', textShadowOffset: { width: -1, height: 1 }, textShadowRadius: 10}} /><Text style={{ fontSize: 17, color: 'white', fontWeight: '700', marginLeft: 10, textShadowColor: '#171717', textShadowOffset: { width: -1, height: 1 }, textShadowRadius: 10 }}>{i18n.t('Back')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <ScrollView>
        <Image source={{uri:image}} style={{ height: 290 }} />
        <View style={{ paddingHorizontal: 55, paddingVertical: 30 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ fontSize: 16, fontWeight: '500', color: 'black', marginBottom: 20, width: 200 }} numberOfLines={1}>{i18n.t('TransactionID')}: {id}</Text>
            <View style={{ backgroundColor: '#FE7940', height: 20, paddingHorizontal: 10, borderRadius: 5 }}><Text style={{ color: 'white' }}>{type}</Text></View>
          </View>
          <Text style={{ fontSize: 16, fontWeight: '500', color: 'black', marginBottom: 20 }}><Text style={{ fontWeight: 'bold', color: '#A8A7A7', fontSize: 12 }}>{i18n.t('Church Name')}: </Text> {churchName}</Text>
          {
            type != "Offer" && type != "Tithe" ? (
              <Text style={{ fontSize: 16, fontWeight: '500', color: 'black', marginBottom: 20 }}><Text style={{ fontWeight: 'bold', color: '#A8A7A7', fontSize: 12 }}>{i18n.t('Project Name')}: </Text> {projectName}</Text>
            ) : (<View></View>)
          }
          <Text style={{ fontSize: 16, fontWeight: '500', color: 'black', marginBottom: 20 }}><Text style={{ fontWeight: 'bold', color: '#A8A7A7', fontSize: 12 }}>{i18n.t('Donate Amount')}: </Text>{amount}  F CFA</Text>
          <Text style={{ fontSize: 16, fontWeight: '500', color: 'black', marginBottom: 20 }}><Text style={{ fontWeight: 'bold', color: '#A8A7A7', fontSize: 12 }}>{i18n.t('Donate Date and Time')}: </Text>{date}</Text>
        </View>
      </ScrollView>
      {isLoading && <Preloader />}
    </SafeAreaView>
  );
}

export default TransactionDetailPage;
