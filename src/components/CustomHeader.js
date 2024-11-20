import React, { useState } from "react";
import { Text, View, Image, TouchableOpacity } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { Badge } from "react-native-paper";
import { useUserContext } from "../context/userContext";
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { envVar } from "../constants/env_vars";

export default function CustomHeader({ title, isHome, navigation }) {

  const { user, notificationFlag, setNotification, i18n } = useUserContext();
  const [notificationData, setNotificationData] = React.useState([]);
  const [readNotificationData, setReadNotificationData] = useState([]);
  const getNotification = async () => {
    const token = await AsyncStorage.getItem('token');
    const headers = {
      authorization: `${token}`
    }
    // await axios.get(`${envVar['BACKEND_LINK']}/notifications/get_user/${user?.id}`, { headers })
    await axios.get(`${envVar['BACKEND_LINK']}/notifications/get_user_notifications/${user?.id}/${user.church}`, { headers })
      .then(function (response) {
        setNotificationData(response.data.notification);
      })
      .catch(function (error) {
      });
  }

  const getUser = async () => {
    const token = await AsyncStorage.getItem('token');
    const headers = {
      authorization: `${token}`
    }

    await axios.get(`${envVar['BACKEND_LINK']}/accounts/get_user/${user?.id}`, { headers })
      .then(function (response) {
        setReadNotificationData(response.data.user.notifications);
      })
      .catch(function (error) {
        Toast.show({
          type: 'error',
          text1: i18n.t("Failed"),
          text2: i18n.t(error.message),
        });
      });
  }

  const checkRead = (arr1, arr2) => {
    if (arr1.length !== arr2.length) {
      console.log("length",arr1.length , arr2.length  )
      return true;
    }
  
    // for (let i = 0; i < arr1.length; i++) {
    //   if (arr1[i]._id !== arr2[i]._id) {
    //     console.log("id-----------")
    //     console.log(arr1[i]._id, arr2[i]._id)
    //     console.log("id-----------")
    //     return true;
    //   }
    // }

    return false
  }

  React.useEffect(() => {
    const mark = checkRead(readNotificationData, notificationData);
    setNotification(mark);
  }, [notificationData, readNotificationData]);

  React.useEffect(() => {
    const getData = navigation.addListener('focus', () => {
      getUser();
      getNotification();
    });
    return getData;
  }, [navigation]);

  return (
    <View style={{ flexDirection: "row", height: 50, justifyContent: "space-between", alignItems: 'center', paddingHorizontal: 15 }}>
      <View style={{ flex: 1, justifyContent: "center" }}>
        <TouchableOpacity style={{ flex: 1, justifyContent: "center" }} onPress={() => navigation.openDrawer()}>
          <Ionicons name="menu" size={35} color="#FE7940" />
        </TouchableOpacity>
      </View>
      <View style={{ flex: 1, justifyContent: "center" }}>
        <Text style={{ textAlign: "center", fontSize: 18, fontWeight: 'bold' }}>{title}</Text>
      </View>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "flex-end" }}>
        <TouchableOpacity style={{ flex: 1, justifyContent: "center", position: 'relative' }} onPress={() => navigation.navigate("Notifications")}>
          {notificationFlag == false ? <Ionicons name="notifications-outline" size={30} color="#FE7940" /> : <View><Ionicons name="notifications-outline" size={30} color="#FE7940"/><Badge style={{position:'absolute', top:5, right:5, backgroundColor:"#FE7940"}} size={10}/></View>}
        </TouchableOpacity>
      </View>
    </View>
  );
}

export const SubHeader = ({ navigation, isWhite }) => {
  const { i18n } = useUserContext();
  return (
    <View style={{ flexDirection: "row", height: 50, justifyContent: "space-between", alignItems: 'center', paddingHorizontal: 15 }}>
      <View style={{ flex: 1, justifyContent: "center" }}>
        {isWhite ? (
          <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => navigation.goBack()}>
            <AntDesign name="left" size={20} color="white" style={{textShadowColor: '#171717', textShadowOffset: { width: -1, height: 1 }, textShadowRadius: 10}} /><Text style={{ fontSize: 17, color: 'white', fontWeight: '700', marginLeft: 10, textShadowColor: '#171717', textShadowOffset: { width: -1, height: 1 }, textShadowRadius: 10 }}>{i18n.t('Back')}</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => navigation.goBack()}>
            <AntDesign name="left" size={20} color="#474747" /><Text style={{ fontSize: 17, color: '#474747', fontWeight: '700', marginLeft: 10 }}>{i18n.t('Back')}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  )
}
