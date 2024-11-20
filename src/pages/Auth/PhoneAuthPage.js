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
import {auth, getAuth} from '@react-native-firebase/auth';
import { firebase } from '../../config/firebaseConfig.js';
import { ScrollView } from 'react-native-gesture-handler';
import { Picker } from '@react-native-picker/picker';
import { envVar } from '../../constants/env_vars';

export default function PhoneAuthScreen({ navigation }) {

  const { signIn, signOut, setLoding, isLoading, language, setAppLanguage, i18n, verifyUserName, verifyPhoneNumber } = useUserContext();
  const [selectedLanguage, setSelectedLanguage] = React.useState(language);

  const [userName, setUserName] = React.useState('');

  // If null, no SMS has been sent
  const [confirm, setConfirm] = useState(null);

  // verification code (OTP - One-Time-Passcode)
  const [code, setCode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  // Handle login
  function onAuthStateChanged(user) {
    if (user) {
      // Some Android devices can automatically process the verification code (OTP) message, and the user would NOT need to enter the code.
      // Actually, if he/she tries to enter it, he/she will get an error message because the code was already used in the background.
      // In this function, make sure you hide the component(s) for entering the code and/or navigate away from this screen.
      // It is also recommended to display a message to the user informing him/her that he/she has successfully logged in.
    }
  }

  const setToken = async (token) => {
    await AsyncStorage.setItem('token', token);
  }

  // Handle the button press
  async function signInWithPhoneNumber(phoneNumber) {
    // const confirmation = await firebase.auth().signInWithPhoneNumber(phoneNumber);
    // setConfirm(confirmation);
    // firebase.auth().settings.appVerificationDisabledForTesting = true;
    // const appVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');
    const appVerifier = window.recaptchaVerifier;
    // Test phone number: 16505553434
    // Test verify code: 654321
    let realPhoneNumber = phoneNumber + "";
    if (realPhoneNumber[0] != "+") {
      realPhoneNumber = "+" + phoneNumber;
    }
    setLoding(true);
    firebase.auth().signInWithPhoneNumber(realPhoneNumber)  //Instead of this +16505553434, use phoneNumber
    .then(function (confirmationResult) {
      setConfirm(confirmationResult);
      setLoding(false);
    }).catch(function (error) {
      console.log('--myerror', error);
      setLoding(false);
      Toast.show({
        type: 'error',
        text1: i18n.t("SMSNotSent"),
      });
    });
  }

  function confirmCode() {
    setLoding(true);
    try {
      confirm.confirm(code).then(async function() {
        await signNoAuthPhoneChange();
        setLoding(false);
      }).catch(function(error) {
        console.log('Invalid code.');
        setLoding(false);
        Toast.show({
          type: 'error',
          text1: i18n.t("VerifyIncorrect"),
        });
      });
    } catch (error) {
      console.log('Invalid code.');
      setLoding(false);
      Toast.show({
        type: 'error',
        text1: i18n.t("Verify Failed"),
      });
    }
  }

  // Send Verification code to the server and gest response
  const signNoAuthPhoneChange = async () => {
    setLoding(true);
    let data = {
      useremail: userName,
    }

    await axios.post(`${envVar['BACKEND_LINK']}/accounts/signNoAuth`, data)
      .then(function (response) {
        setLoding(false);
        // Toast.show({
        //   type: 'success',
        //   text1: i18n.t("Succeed"),
        // });

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
        console.log('----Phone Auth Page-----');
        setLoding(false);
        if (error.response?.status == 401) {
          Toast.show({
            type: 'error',
            text1: i18n.t("Verify Failed"),
          });
        }
        if (error.response?.status == 500) {
          Toast.show({
            type: 'error',
            text1: i18n.t("Verify Failed"),
          });
        }
      });
  }

  useEffect(() => {
    const getData = navigation.addListener('focus', () => {
      signOut();
      setUserName(verifyUserName);
      setPhoneNumber(verifyPhoneNumber);
    });
    return getData;
  }, [navigation]);


  useEffect(() => {
    setAppLanguage(selectedLanguage)
  }, [selectedLanguage]);

  useEffect(() => {
    const auth = getAuth();
    auth.languageCode = 'it';

    const subscriber = firebase.auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  });

  return (
    <View style={styles.container}>
      <ImageBackground source={IMAGE.BACKGROUND_IMAGE} resizeMode="cover" style={styles.image}>
        <View style={styles.mainContinaer}>
          <ScrollView>
            <Card style={styles.authCard}>
              <Card.Content>
                {!confirm ? (<View>
                  <Text>{i18n.t('EnterPhone')}</Text>
                  <TextInput
                    label={i18n.t('Phone Number')}
                    value={phoneNumber}
                    onChangeText={text => setPhoneNumber(text)}
                    style={styles.inputBox}
                    require
                    disabled={true}
                  />
                  <Button mode="contained" textColor='white' style={{ backgroundColor: '#FE7940', marginVertical: 30 }} onPress={() => signInWithPhoneNumber(phoneNumber)}>{i18n.t('Send a code')}</Button>
                </View>) : (<View>
                  <Text>{i18n.t('EnterVerifyCode')}</Text>
                  <TextInput
                    label={i18n.t('6 digit code')}
                    value={code}
                    onChangeText={text => setCode(text)}
                    style={styles.inputBox}
                    keyboardType='numeric'
                    require
                  />
                  <Button mode="contained" textColor='white' style={{ backgroundColor: '#FE7940', marginVertical: 30 }} onPress={confirmCode}>{i18n.t('Verify')}</Button>
                </View>)}

                <View style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  borderColor: '#FE7940',
                  borderWidth: 1,
                  borderRadius: 20,
                  width: "50%",
                  marginLeft: 'auto',
                  marginRight: 'auto'
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

