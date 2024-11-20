import React from "react";
import { Text, View, ScrollView, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomHeader, { SubHeader } from "../../components/CustomHeader";
import { ChurchCard } from "../../components/Cards";
import { TextInput } from "react-native-paper";
import axios from 'axios';
import Toast from "react-native-toast-message";
import Preloader from "../../components/Preloader";
import { useUserContext } from "../../context/userContext";
import { CommonActions } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { envVar } from "../../constants/env_vars";

function ChurchPage({ navigation }) {
  const { user, signIn, i18n, isLoading, reRenderFlag, setRenderFlag } = useUserContext();

  const [churchData, setChurchData] = React.useState([]);
  const [keyword, setKeyword] = React.useState([]);
  const [sort, setSort] = React.useState(true);

  const updateProfile = async (id) => {
    // setLoding(true);
    const token = await AsyncStorage.getItem('token');
    const headers = {
      authorization: `${token}`
    }
    await axios.post(`${envVar['BACKEND_LINK']}/accounts/update_profile`,
      {
        username: user?.userName,
        useremail: user?.userEmail,
        phonenumber: user?.phoneNumber,
        birth: user?.birth,
        language: user?.language,
        address: user?.address,
        church: id,
        avatarurl: user?.avatarUrl,
        status: true
      },
      { headers })
      .then(function (response) {

        signIn({
          id: response.data.user._id,
          userName: response.data.user.userName,
          userEmail: response.data.user.userEmail,
          phoneNumber: response.data.user.phoneNumber,
          birth: response.data.user.birth,
          language: response.data.user.language,
          address: response.data.user.address,
          avatarUrl: response.data.user.avatarUrl,
          church: response.data.user.church
        })
        setRenderFlag(!reRenderFlag);
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [
              { name: 'HomePage' },
            ],
          })
        );

      })
      .catch(function (error) {
        // setLoding(false);
        Toast.show({
          type: 'error',
          text1: i18n.t("Failed"),
          text2: i18n.t(error.message),
        });
      });
  }

  const getAllChurch = async () => {
    const token = await AsyncStorage.getItem('token');
    const headers = {
      authorization: `${token}`
    }
    await axios.get(`${envVar['BACKEND_LINK']}/church/all_churches`, { headers })
      .then(function (response) {
        setChurchData(response.data.church);
      })
      .catch(function (error) {
        Toast.show({
          type: 'error',
          text1: i18n.t("Failed"),
          text2: i18n.t(error.message),
        });
      });
  }

  const getSearchResult = async () => {
    const token = await AsyncStorage.getItem('token');
    const headers = {
      authorization: `${token}`
    }
    await axios.post(`${envVar['BACKEND_LINK']}/church/search_church`, { keyword: keyword, sort : sort }, { headers })
      .then(function (response) {
        setChurchData(response.data.church);
      })
      .catch(function (error) {
        Toast.show({
          type: 'error',
          text1: i18n.t("Failed"),
          text2: i18n.t(error.message),
        });
      });
  }

  React.useEffect(() => {
    getSearchResult();
  }, [keyword, sort]);

  // React.useEffect(() => {
  //   getAllChurch();
  // }, []);


  return (
    <SafeAreaView style={{ flex: 1 }}>
      <CustomHeader title={i18n.t('Churches')} navigation={navigation} />
      <SubHeader navigation={navigation} />
      <View style={{ paddingHorizontal: 25, marginBottom: 30 }}>
        <TextInput
          left={<TextInput.Icon icon="magnify" color="#FE7940" />}
          style={{ borderWidth: 0, fontWeight:'bold',  borderRadius: 12, borderBottomWidth: 0, backgroundColor: 'white', shadowColor: '#171717', shadowOffset: { width: -2, height: 4 }, shadowOpacity: 0.2, shadowRadius: 3, }}
          label={i18n.t('Search')}
          textColor="black"
          value={keyword}
          onChangeText={text => setKeyword(text)}
          underlineColor="transparent"
          right={<TextInput.Icon onPress={ () => setSort(!sort)} icon="filter-variant" />}
        />
      </View>
      {churchData.length < 1 ? (
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <Image source={require('../../../assets/images/banner/error.png')} style={{ width: 110, height: 120, marginBottom: 20 }} />
          <Text style={{ textAlign: 'center', fontSize: 16 }}>{i18n.t('NoChurches')}</Text>
        </View>
      ) : (
        <ScrollView style={{ paddingHorizontal: 25 }}>
          {churchData.map((item, index) => (
            <TouchableOpacity key={index} onPress={() => updateProfile(item._id)}>
              <ChurchCard title={item.churchName} imagePath={item.photoUrl} churchAddress={item.churchAddress} />
            </TouchableOpacity>
          ))}
        </ScrollView>

      )}
      {isLoading && <Preloader />}
    </SafeAreaView>
  );
}

export default ChurchPage;

