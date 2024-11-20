import React from "react";
import { Text, TouchableOpacity, ScrollView, View, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { createDrawerNavigator } from "@react-navigation/drawer";
import NotificationsPage from "../pages/Notifications/NotificationsPage";
import { Avatar } from 'react-native-paper';
import { IMAGE, LANGUAGE } from "../constants/Images";
import { AntDesign } from '@expo/vector-icons';
import { SimpleLineIcons } from '@expo/vector-icons';
import { EvilIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import HomePage from "../pages/Home/HomePage";
import ProfilePage from "../pages/Profile/Profile";
import TransactionsPage from "../pages/Transactions/TransactionsPage";
import HomeStackNavigator from "./HomeStackNavigator";
import TransactionDetailPage from "../pages/Transactions/TransactionDetailPage";
import { useUserContext } from "../context/userContext";
import OfferPage from "../pages/Churches/OfferPage";
import TithePage from "../pages/Churches/TithePage";
import NotificationDetailPage from "../pages/Notifications/NotificationDetailPage";


const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {
  const { user, signOut, i18n } = useUserContext();

  const signOutButton = () => {
    props.navigation.navigate("Login");
    signOut();
  }

  return (
    <SafeAreaView style={{ flex: 1, alignItems: 'center' }}>
      <ScrollView style={{ marginLeft: 5 }}>
        {
          user != null ? (
            <Image source={{ uri: `${user?.avatarUrl}` }} style={{ marginLeft: 'auto', marginRight: 'auto', marginTop: 80, width: 100, height: 100, borderRadius: 50, }} resizeMode="cover" />
          ) : (
            <Image source={require('../../assets/images/default_user.png')} style={{ marginLeft: 'auto', marginRight: 'auto', marginTop: 80, width: 100, height: 100, borderRadius: 50, }} resizeMode="cover" />
          )
        }
        <Text style={{ fontSize: 16, fontWeight: '700', marginTop: 10, textAlign: 'center' }}>{user?.userEmail}</Text>
        <TouchableOpacity style={{ marginTop: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }} onPress={() => props.navigation.navigate("HomePage")}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <SimpleLineIcons name="home" size={20} color="black" style={{ marginRight: 10, marginLeft: 5 }} /><Text style={{ marginRight: 70 }} >{i18n.t('Home')}</Text>
          </View>
          <AntDesign name="right" size={20} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={{ marginTop: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }} onPress={() => props.navigation.navigate("Profile")}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <EvilIcons name="user" size={30} color="black" style={{ marginRight: 5 }} /><Text style={{ marginRight: 70 }} >{i18n.t('Setting')}</Text>
          </View>
          <AntDesign name="right" size={20} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={{ marginTop: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }} onPress={() => props.navigation.navigate("Transactions")}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {/* <Feather name="dollar-sign" size={24} color="black" style={{ marginRight: 10 }} /><Text style={{ marginRight: 70 }} >{i18n.t('Transactions')}</Text> */}
            <Image source={require('../../assets/images/icons/transactionIcon.png')} resizeMode='stretch' style={{ width: 30, height: 30 }} />
            <Text style={{ marginRight: 70 }} >{i18n.t('Transactions')}</Text>
          </View>
          <AntDesign name="right" size={20} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={{ marginTop: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }} onPress={() => props.navigation.navigate("Notifications")}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="notifications-outline" size={24} color="black" style={{ marginRight: 10 }} /><Text style={{ marginRight: 70 }} >{i18n.t('Notifications')}</Text>
          </View>
          <AntDesign name="right" size={20} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={{ marginTop: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }} onPress={signOutButton}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <AntDesign name="logout" size={20} color="black" style={{ marginRight: 10, marginLeft: 3 }} /><Text style={{ marginRight: 70 }} >{i18n.t('SignOut')}</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function DrawerNavigator() {
  return (
    // <Drawer.Navigator initialRouteName="MenuTab" screenOptions={{ headerShown: false }} drawerContent={(props) => CustomDrawerContent(props)}>
    <Drawer.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }} drawerContent={(props) => CustomDrawerContent(props)}>
      <Drawer.Screen name="Home" component={HomeStackNavigator} />
      {/* <Drawer.Screen name="HomePage" component={HomePage} /> */}
      <Drawer.Screen name="Profile" component={ProfilePage} />
      <Drawer.Screen name="Transactions" component={TransactionsPage} />
      <Drawer.Screen name="TransactionDetail" component={TransactionDetailPage} />
      <Drawer.Screen name="Notifications" component={NotificationsPage} />
      <Drawer.Screen name="NotificationDetail" component={NotificationDetailPage} />
      <Drawer.Screen name="OfferPage" component={OfferPage} />
      <Drawer.Screen name="TithePage" component={TithePage} />
    </Drawer.Navigator>
  );
}

export default DrawerNavigator;
