import React, { useContext, useState } from "react";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomHeader, { SubHeader } from "../../components/CustomHeader";
import { NotificationCard } from "../../components/Cards";
import axios from 'axios';
import Toast from "react-native-toast-message";
import { useUserContext } from "../../context/userContext";
import Preloader from "../../components/Preloader";
import { TouchableOpacity } from "react-native-gesture-handler";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { envVar } from "../../constants/env_vars";


function NotificationsPage({ navigation }) {
  const [notificationData, setNotificationData] = useState([]);
  const [readNotificationData, setReadNotificationData] = useState([]);
  // let readNotificationData;
  const { user, isLoading, i18n} = useUserContext();

  const getNotification = async () => {
    const token = await AsyncStorage.getItem('token');
    const _userData = await AsyncStorage.getItem('userData');
    let userData = JSON.parse(_userData);
    const headers = {
      authorization: `${token}`
    }

    await axios.get(`${envVar['BACKEND_LINK']}/notifications/get_user_notifications/${userData?.id}/${userData.church}`, { headers })
      .then(function (response) {
        // console.log("notification", response.data)
        setNotificationData(response.data.notification);
      })
      .catch(function (error) {
        Toast.show({
          type: 'error',
          text1: i18n.t("Failed"),
          text2: i18n.t(error.message),
        });
      });
  }

  const getUser = async () => {
    const token = await AsyncStorage.getItem('token');
    const _userData = await AsyncStorage.getItem('userData');
    let userData = JSON.parse(_userData);
    const headers = {
      authorization: `${token}`
    }

    await axios.get(`${envVar['BACKEND_LINK']}/accounts/get_user/${userData?.id}`, { headers })
      .then(function (response) {
        console.log("readNotificationData", response.data.user.notifications)
        setReadNotificationData(response.data.user.notifications);
        // readNotificationData = response.data.user.notifications;
      })
      .catch(function (error) {
        Toast.show({
          type: 'error',
          text1: i18n.t("Failed"),
          text2: i18n.t(error.message),
        });
      });
  }

  const clickRead = async (notificationId, userId) => {
    const token = await AsyncStorage.getItem('token');
    const headers = {
      authorization: `${token}`
    }
    let data = {
      notificationId: notificationId,
      userId: userId,
    }

    await axios.post(`${envVar['BACKEND_LINK']}/notifications/read_notification`, data, { headers })
      .then(function (response) {
        console.log(response.data.notification)
      })
      .catch(function (error) {
        Toast.show({
          type: 'error',
          text1: i18n.t("Succeed"),
          // text2: i18n.t(error.message),
        });
      });
  }

  const searchItem = (id, arr) => {
    return arr.some(obj => obj._id == id);
  }

  React.useEffect(() => {
    const getData = navigation.addListener('focus', () => {
      getUser();
      getNotification();
    });
    return getData;
  }, [navigation, readNotificationData]);


  
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <CustomHeader title={i18n.t('Notifications')} navigation={navigation} />
      <SubHeader navigation={navigation} />
      <ScrollView style={{ paddingHorizontal: 15 }}>
        {
          notificationData.map((item, index) => (
            <TouchableOpacity key={index} onPress={() => {
              // if (searchItem(item.markOfRead, user?.id) == false) {
                clickRead(item._id, user?.id);
              // }
              navigation.navigate("NotificationDetail", {
                id: item._id,
                title: item.notificationTitle,
                type: item.notificationType,
                description:
                  item.description,
                date: item.createdDate
              })
            }}
            >
              {/* <NotificationCard type={item.notificationType} title={item.notificationTitle} description={item.description} datetime={item.createdDate} markOfRead={searchItem(item.markOfRead, user?.id) == false ? true : false} /> */}
              <NotificationCard type={item.notificationType} title={item.notificationTitle} description={item.description} datetime={item.createdDate} markOfRead={searchItem(item._id, readNotificationData) == false ? true : false} />
            </TouchableOpacity>
          ))
        }
      </ScrollView>
      {isLoading && <Preloader />}
    </SafeAreaView>
  );
}

export default NotificationsPage;
