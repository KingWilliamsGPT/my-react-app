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

export default function RegisgerAuthScreen({ navigation }) {

  const { signIn, signOut, setLoding, isLoading, language, setAppLanguage, i18n, verifyUserName } = useUserContext();
  const [selectedLanguage, setSelectedLanguage] = React.useState(language);

  const [userName, setUserName] = React.useState('');
  const [verifyCode, setVerifyCode] = React.useState('');

  const setToken = async (token) => {
    await AsyncStorage.setItem('token', token);
  }

  // Send Verification code to the server and gest response
  const signUpAuthButton = async () => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    
    setLoding(true);
    let data = {
      useremail: userName,
      verifyCode: verifyCode
    }
  
    await axios.post(`${envVar['BACKEND_LINK']}/accounts/signupAuth`, data)
      .then(function (response) {
        setLoding(false);
        // Toast.show({
        //   type: 'success',
        //   text1: i18n.t("Succeed"),
        //   text2: i18n.t(response.data.message),
        // });

        setToken(response.data.token)
        navigation.navigate("PhoneAuth");
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

  // send verification code again
  const resendCodeButton = async() => {
    const data = {
      useremail: userName,
    }

    await axios.post(`${envVar['BACKEND_LINK']}/accounts/resendVerifyCode`, data)
      .then(function (response) {
        setLoding(false);
        Toast.show({
          type: 'success',
          text1: i18n.t("SendCodeSucceed"),
          text2: i18n.t(response.data.message),
        });
        setToken(response.data.token)
      })
      .catch(function (error) {
        setLoding(false);
        if (error.response?.status == 401) {
          Toast.show({
            type: 'error',
            text1: i18n.t("Failed"),
            text2: i18n.t(error.response.data.message),
          });
        }
        if (error.response?.status == 500) {
          Toast.show({
            type: 'error',
            text1: i18n.t("Failed"),
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
                  <Text>{i18n.t('RegisterVerifyDesc')}</Text>       
                  <TouchableOpacity onPress={resendCodeButton}>
                    <View>
                      <Text style={{textAlign:'right', color: 'blue'}}>{i18n.t('Resend code')}</Text>
                    </View>
                  </TouchableOpacity>
                </View>
                <View>
                  <TextInput
                    label={i18n.t('6 digit code')}
                    value={verifyCode}
                    onChangeText={text => setVerifyCode(text)}
                    style={styles.inputBox}
                    keyboardType='numeric'
                    require
                  />
                  <Button mode="contained" textColor='white' style={{ backgroundColor: '#FE7940', marginVertical: 30 }} onPress={signUpAuthButton}>{i18n.t('Verify')}</Button>
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

