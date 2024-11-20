import React, { useEffect, useState } from 'react';
import { View, ImageBackground, Image, Text, TouchableOpacity } from "react-native";
import { Card, TextInput, Button } from 'react-native-paper';
import { styles } from '../../styles';
import { IMAGE } from '../../constants/Images';
import Toast from 'react-native-toast-message';
import axios from 'axios';
import { useUserContext } from '../../context/userContext';
import Preloader from '../../components/Preloader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import { firebase } from '../../config/firebaseConfig.js';
import { LoginManager, AccessToken } from 'react-native-fbsdk-next';
import { ScrollView } from 'react-native-gesture-handler';
import { Picker } from '@react-native-picker/picker';
import {envVar} from '../../constants/env_vars';
import { AntDesign } from '@expo/vector-icons';

export default function ResetPasswordScreen({ navigation }) {
  const { signIn, signOut, setLoding, isLoading, language, setAppLanguage, i18n, verifyUserName, verifyPhoneNumber, stateEmailorPhone } = useUserContext();
  const [selectedLanguage, setSelectedLanguage] = React.useState(language);
  const [isShow, setIsShow] = React.useState(false);
  const [isShow2, setIsShow2] = React.useState(false);


  const [userName, setUserName] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');

  const setToken = async (token) => {
    await AsyncStorage.setItem('token', token);
  }

  // Send Verification code to the server and gest response
  const updatePasswordButton = async () => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (password != confirmPassword) {
      Toast.show({
        type: 'error',
        text1: i18n.t("Failed"),
        text2: i18n.t("PasswordMismatch"),
      });
      return;
    }


    setLoding(true);

    let data = {
      stateEmailorPhone: stateEmailorPhone, // 0 - email reset password, 1 - phone reset password
      useremail: userName,
      phoneNumber: verifyPhoneNumber,
      password: password
    };
  
    await axios.post(`${envVar['BACKEND_LINK']}/accounts/resetPassword`, data)
      .then(function (response) {
        setLoding(false);
        Toast.show({
          type: 'success',
          text1: i18n.t("PasswordReset"),
          // text2: i18n.t(response.data.message),
        });

        setToken(response.data.token)
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
        });
        navigation.navigate("HomeApp");
      })
      .catch(function (error) {
        setLoding(false);
        if (error.response?.status == 401) {
          Toast.show({
            type: 'error',
            text1: i18n.t("Verify Failed"),
            text2: i18n.t(error.response.data.message),
          });
        }
        if (error.response?.status == 500) {
          Toast.show({
            type: 'error',
            text1: i18n.t("Verify Failed"),
            text2: i18n.t(error.response.data.error),
          });
        }
      });
  }

  useEffect(() => {
    const getData = navigation.addListener('focus', () => {
      signOut();
      setUserName(verifyUserName);
      GoogleSignin.configure({
        offlineAccess: false,
        webClientId: '652995917303-ae65frjhndhrkoesue4qj3a9t2lth4gq.apps.googleusercontent.com',
        forceConsentPrompt: true
      });
    });
    return getData;
  }, [navigation]);


  useEffect(() => {
    setAppLanguage(selectedLanguage)
  }, [selectedLanguage]);

  return (
    <View style={styles.container}>
      <ImageBackground source={IMAGE.BACKGROUND_IMAGE} resizeMode="cover" style={styles.image}>
        <View style={styles.mainContinaer}>
          <ScrollView>
            <Card style={styles.authCard}>
              <Card.Content>
                <View>
                  <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => navigation.navigate("Login")}>
                    <AntDesign name="left" size={20} color="#474747" /><Text style={{ fontSize: 17, color: '#474747', fontWeight: '700', marginLeft: 10 }}>{i18n.t('Back')}</Text>
                  </TouchableOpacity>
                </View>
                <View>
                  <TextInput
                    label={i18n.t('New Password')}
                    value={password}
                    onChangeText={text => setPassword(text)}
                    style={styles.inputBox}
                    right={<TextInput.Icon icon="eye" onPress={() => setIsShow(!isShow)} />}
                    secureTextEntry={!isShow ? true : false}
                    require
                  />
                   <TextInput
                    label={i18n.t('New Confirm Password')}
                    value={confirmPassword}
                    onChangeText={text => setConfirmPassword(text)}
                    style={styles.inputBox}
                    right={<TextInput.Icon icon="eye" onPress={() => setIsShow2(!isShow2)} />}
                    secureTextEntry={!isShow2 ? true : false}
                    require
                  />
                  <Button mode="contained" textColor='white' style={{ backgroundColor: '#FE7940', marginVertical: 30 }} onPress={updatePasswordButton}>{i18n.t('Update password')}</Button>
                </View>
                <View style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  borderColor: '#FE7940',
                  borderWidth: 1,
                  borderRadius:20,
                  width:"50%",
                  marginLeft:'auto',
                  marginRight:'auto'
                }}>
                  <Picker
                    selectedValue={selectedLanguage}
                    style={{ width: "100%", height: 30, marginLeft: 15 }}

                    onValueChange={(itemValue, itemIndex) => setSelectedLanguage(itemValue)}
                  >
                    <Picker.Item label="English" value="en" style={{ fontSize: 12, marginLeft: 15 }} />
                    <Picker.Item label="French" value="fr" style={{ fontSize: 12 }} />
                  </Picker>
                </View>
              </Card.Content>
            </Card>
          </ScrollView>
        </View>
        {isLoading && <Preloader />}
      </ImageBackground>
    </View>
  )

}

