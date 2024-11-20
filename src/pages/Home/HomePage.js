import React from "react";
import { View, Text, Image, ScrollView, TouchableOpacity, ImageBackground, BackHandler, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomHeader from "../../components/CustomHeader";
import { useUserContext } from "../../context/userContext";
import Preloader from "../../components/Preloader";
import axios from 'axios';
import Toast from "react-native-toast-message";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Octicons } from '@expo/vector-icons';
import { envVar } from "../../constants/env_vars";

function HomePage({ navigation }) {
  const { user, isLoading, i18n } = useUserContext();
  const [churchData, setChurchData] = React.useState(null);
  const [dailyScript, setDailyScript] = React.useState('');
  const [bookName, setBookName] = React.useState('');
  const [chapter, setChapter] = React.useState('');
  const [verse, setVerse] = React.useState('');

  const getChurch = async (id) => {
    const token = await AsyncStorage.getItem('token');
    const headers = {
      authorization: `${token}`
    }
    await axios.get(`${envVar['BACKEND_LINK']}/church/get_church_detail/${id}`, { headers })
      .then(function (response) {
        setChurchData(response.data.church);
      })
      .catch(function (error) {
        Toast.show({
          type: 'error',
          text1: i18n.t("Failed"),
          text2: i18n.t(error.message),
        });
        console.log('----HomePage Error------', error);
      });
  }

  // React.useEffect(() => {
  //   getDailyScript();
  // }, []);

  const getDailyScript = async () => {

    await axios.get(`https://labs.bible.org/api/?passage=random&type=json`)
      .then(function (response) {
        setDailyScript(response.data[0].text)
        setBookName(response.data[0].bookname)
        setChapter(response.data[0].chapter)
        setVerse(response.data[0].verse)
      })
      .catch(function (error) {
        console.log(error.response)
      });
  }

  React.useEffect(() => {
    getChurch(user?.church);
    const backAction = () => {
      Alert.alert("Exit App", "Exiting the application?", [
        {
          text: "Cancel",
          onPress: () => null,
          style: "cancel"
        },
        { text: "YES", onPress: () => BackHandler.exitApp() }
      ]);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [navigation]);


  return (
    <SafeAreaView style={{ flex: 1 }}>
      <CustomHeader title={i18n.t('Home')} isHome={true} navigation={navigation} />
      <ScrollView style={{ marginTop: 10 }}>
        <View style={{ paddingHorizontal: 20 }}>
          <View style={{ position: 'relative' }}>
            <Text style={{ position: 'absolute', top: 10, zIndex: 30, color: 'white', left: 10, fontSize: 20, fontWeight: 'bold', textShadowColor: '#171717', textShadowOffset: { width: -1, height: 1 }, textShadowRadius: 10 }}>{churchData?.churchName}</Text>
            {churchData != null ? <Image source={{ uri: churchData.photoUrl }} style={{ height: 220, width: "100%", borderRadius: 15 }} /> : <></>}
            <TouchableOpacity mode="contained" textColor='white' style={{ backgroundColor: '#FE7940', position: 'absolute', bottom: 10, right: 10, paddingHorizontal: 10, borderRadius: 5, flex: 1, flexDirection: 'row', alignItems: 'center' }} onPress={() => navigation.navigate("Church")}><Octicons name="search" size={15} color="white" style={{ marginRight: 5 }} /><Text style={{ color: 'white' }}>{i18n.t('Search')}</Text></TouchableOpacity>
          </View>
          <View style={{ backgroundColor: "#DBDBDB", height: 5, width: "100%", marginVertical: 30 }}></View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 }}>
            <TouchableOpacity onPress={() => navigation.navigate("OfferPage", user.church)}>
              <View style={{ width: 110, height: 198 }}>
                <Image source={require('../../../assets/images/banner/offer.jpg')} style={{ width: 110, height: 170, borderRadius: 10, marginBottom: 10, shadowColor: '#171717', shadowOffset: { width: -2, height: 4 }, shadowOpacity: 0.2, shadowRadius: 3, }} />
                <Text style={{ fontSize: 14, color: '#FE7940', textAlign: 'center', fontWeight: 'bold' }}>{i18n.t('Offering')}</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("TithePage", user.church)}>
              <View style={{ width: 110, height: 198 }}>
                <Image source={require('../../../assets/images/banner/tithe.jpg')} style={{ width: 110, height: 170, borderRadius: 10, marginBottom: 10, shadowColor: '#171717', shadowOffset: { width: -2, height: 4 }, shadowOpacity: 0.2, shadowRadius: 3, }} />
                <Text style={{ fontSize: 14, color: '#FE7940', textAlign: 'center', fontWeight: 'bold' }}>{i18n.t('Tithe')}</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("Project", user.church)}>
              <View style={{ width: 110, height: 198 }}>
                <Image source={require('../../../assets/images/banner/project.jpg')} style={{ width: 110, height: 170, borderRadius: 10, marginBottom: 10, shadowColor: '#171717', shadowOffset: { width: -2, height: 4 }, shadowOpacity: 0.2, shadowRadius: 3, }} />
                <Text style={{ fontSize: 14, color: '#FE7940', textAlign: 'center', fontWeight: 'bold' }}>{i18n.t('Project')}</Text>
              </View>
            </TouchableOpacity>

          </View>
          {/* <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 20, marginTop: 20 }}>{i18n.t('Daily Script')}</Text>
          <ImageBackground source={require('../../../assets/images/scription_bg.jpg')} resizeMode="cover" style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 10, paddingVertical: 20, marginBottom: 30, borderRadius: 5 }}>
            <Text style={{ fontSize: 14, fontWeight: '500' }}>{dailyScript}</Text>
            <Text style={{ fontSize: 9, textAlign: 'right', color: '#484848', marginTop: 5 }}>{bookName} {chapter} : {verse}</Text>
          </ImageBackground> */}
        </View>
      </ScrollView>
      {isLoading && <Preloader />}
    </SafeAreaView>
  );
}

export default HomePage;
