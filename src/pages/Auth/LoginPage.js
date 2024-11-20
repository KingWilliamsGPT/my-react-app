import React, { useEffect, useState } from 'react';
import { View, ImageBackground, Image, Text, TouchableOpacity } from "react-native";
import { Card, TextInput, Button } from 'react-native-paper';
import { styles } from '../../styles';
import { IMAGE, LANGUAGE } from '../../constants/Images';
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

export default function LoginScreen({ navigation }) {

  const { signIn, signOut, setLoding, isLoading, language, setAppLanguage, i18n, setVerifyUserName, verifyPhoneNumber, setVerifyPhoneNumber } = useUserContext();
  const [isShow, setIsShow] = React.useState(false);

  const [selectedLanguage, setSelectedLanguage] = React.useState(language);

  const [userName, setUserName] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [fbUser, setFbUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  //Forgot password dialog show
  const [forgotPasswordShow, setForgotPasswordShow] = useState(false);
  const [emailorphone, setEmailorPhone] = useState('');

  // const onAuthstateChanged = (user) => {
  //   setFbUser(user);
  //   if (initializing) setInitializing(false);
  // }

  const setToken = async (token) => {
    await AsyncStorage.setItem('token', token);
  }
 
  const setSignGoogleorFacebook =  async() => {
    await AsyncStorage.setItem('googleorfacebook', "true");
  }

  const signInButton = async () => {
    if (userName == '' || password == '') {
      Toast.show({
        type: 'error',
        type: i18n.t("Failed"),
        text1: i18n.t('NamePassNull')
      });
      return;
    }
    setLoding(true);

    let data = {
      useremail: userName,
      password: password
    }

    await axios.post(`${envVar['BACKEND_LINK']}/accounts/signin`, data)
      .then(function (response) {
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
        setLoding(false);
        navigation.navigate("HomeApp");
      })
      .catch(function (error) {
        setLoding(false);
        console.log(error.response.data)
        if (error.response?.status == 401) {
          console.log(error.response.data.message)
          Toast.show({
            type: 'error',
            text1: i18n.t("Failed"),
            text2: i18n.t(error.response.data.message),
          });
        }
        if (error.response?.status == 500) {
          console.log(error.response.data.message)
          Toast.show({
            type: 'error',
            text1: i18n.t("Failed"),
            text2: i18n.t(error.response.data.error),
          });
        }
      });
  }

  // useEffect(() => {
  //   const subscriber = firebase.auth().onAuthStateChanged(onAuthstateChanged);
  //   return subscriber;
  // },[])

  useEffect(() => {
    const getData = navigation.addListener('focus', async() => {
      signOut();
      setUserName('');
      setPassword('');
      setEmailorPhone('');
      setForgotPasswordShow(false);
      await AsyncStorage.setItem('googleorfacebook', "false");
      GoogleSignin.configure({
        offlineAccess: false,
        webClientId: '652995917303-ae65frjhndhrkoesue4qj3a9t2lth4gq.apps.googleusercontent.com',
        forceConsentPrompt: true
      });
    });
    return getData;
  }, [navigation]);

  // useEffect(() => {
  //   if (fbUser != null || fbUser != undefined) {
  //     fbSignIn();
  //   }
  // }, [fbUser]);

  useEffect(() => {
    setAppLanguage(selectedLanguage)
  }, [selectedLanguage]);


  const signInWithGoogleAsync = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      setLoding(true);
      if (userInfo == undefined) {
        Toast.show({
          type: 'error',
          text1: i18n.t("Failed"),
          text2: i18n.t("Login Failed"),
        });
        return
      }

      let data = {
        useremail: userInfo.user.email,
      }

      await axios.post(`${envVar['BACKEND_LINK']}/accounts/signinWithGoogle`, data)
        .then(function (response) {
          // Toast.show({
          //   type: 'success',
          //   text1: i18n.t("Succeed"),
          //   text2: i18n.t(response.data.message),
          // });
          setToken(response.data.token)
          setSignGoogleorFacebook(); // google or facebook sign in
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
          setLoding(false);
          navigation.navigate("HomeApp");
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

    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
      }
    }
  }


  async function signInWithFacebookAsync() {
    const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);

    if (result.isCancelled) {
      throw i18n.t('UserCancelLogin');
    }

    // Once signed in, get the users AccessToken
    const data = await AccessToken.getCurrentAccessToken();

    if (!data) {
      throw i18n.t('AccessTokenObtain');
    }

    // Create a Firebase credential with the AccessToken
    const facebookCredential = auth.FacebookAuthProvider.credential(data.accessToken);

    // fbSignUp();
    // Sign-in the user with the credential
    //return auth().signInWithCredential(facebookCredential);
    let result1 = await auth().signInWithCredential(facebookCredential);
     if (result1.user != null || result1.user != undefined) {
        setFbUser(result1.user);
        fbSignIn();
     }
  };

  const fbSignIn = async () => {
    console.log('------fbSignIn-------');
    // if (fbUser == undefined || fbUser == null) {
    //   return
    // }
    setLoding(true);

    let data = {
      useremail: fbUser?.email,
    }


    await axios.post(`${envVar['BACKEND_LINK']}/accounts/signinWithFacebook`, data)
      .then(function (response) {
        // Toast.show({
        //   type: 'success',
        //   text1: i18n.t("Succeed"),
        //   text2: i18n.t(response.data.message),
        // });
        setToken(response.data.token)
        setSignGoogleorFacebook(); //google or facebook sign in
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
        setLoding(false);
        navigation.navigate("HomeApp");
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
  
  const forgotPassword = async(emailorphone) => {
    setVerifyUserName(emailorphone);
    const data = {
      useremail: emailorphone
    }
    setLoding(true);
    await axios.post(`${envVar['BACKEND_LINK']}/accounts/forgotPassword`, data)
      .then(function (response) {
        // Toast.show({
        //   type: 'success',
        //   text1: i18n.t("Succeed"),
        //   text2: i18n.t(response.data.message),
        // });
        setToken(response.data.token)
        setLoding(false);
        navigation.navigate("ForgotPassword");
      })
      .catch(function (error) {
        setLoding(false);
        console.log(error.response.data)
        if (error.response?.status == 401) {
          console.log(error.response.data.message)
          Toast.show({
            type: 'error',
            text1: i18n.t(error.response.data.message),
          });
        }
        if (error.response?.status == 500) {
          console.log(error.response.data.message)
          Toast.show({
            type: 'error',
            text1: i18n.t("Failed"),
          });
        }
      });
  }
 
  // send verify code to email or phone
  const EmailorPhoneVerify =  async() => {
    const phoneRegex = /^\d+$/;
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (emailRegex.test(emailorphone) == true) {
      // send verify code to the email via back-end
      await forgotPassword(emailorphone);
    } else if(phoneRegex.test(emailorphone) == true) {
      // send verify code to the phone via this front-end
      setLoding(true);
      let data = {
        emailorphone: emailorphone
      }
      await axios.post(`${envVar['BACKEND_LINK']}/accounts/checkSendcode`, data)
      .then(async function (response) {
        setLoding(false);
        //phone verify sms
        setVerifyPhoneNumber(emailorphone);
        navigation.navigate("PhoneAuthResetPassword");

      })
      .catch(function (error) {
        setLoding(false);
        console.log(error.response.data.message)
        Toast.show({
          type: 'error',
          text1: i18n.t(error.response.data.message),
        });
      });
    } else {
      Toast.show({
        type: 'error',
        text2: i18n.t("EnterValidEmailorPhone")
      });
      return;
    }
  }

  return (
    <View style={styles.container}>
      <ImageBackground source={IMAGE.BACKGROUND_IMAGE} resizeMode="cover" style={styles.image}>
        <View style={styles.mainContinaer}>
          <ScrollView>
            <Card style={styles.authCard}>
              {!forgotPasswordShow ? <Card.Content>
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
                  marginRight:'auto',
                  marginBottom: 20
                }}>
                  <Picker
                    selectedValue={selectedLanguage}
                    style={{ width: "100%", height: 30, marginLeft: 15 }}

                    onValueChange={(itemValue, itemIndex) => setSelectedLanguage(itemValue)}
                  >
                    <Picker.Item label={i18n.t('English')} value="en" style={{ fontSize: 12, marginLeft: 15 }} />
                    <Picker.Item label={i18n.t('Français')} value="fr" style={{ fontSize: 12 }} />
                  </Picker>
                </View>

                <View style={styles.tabButtonView}>
                  <Button style={styles.tabButtonActive} textColor="white" onPress={() => navigation.navigate("Login")}>{i18n.t('Log In')}</Button>
                  <Button style={styles.tabButton} textColor="#FE7940" onPress={() => navigation.navigate("Register")} >{i18n.t('Sign Up')}</Button>
                </View>
                <View>
                  <TextInput
                  label={i18n.t('Email or Phone number')}
                    style={styles.inputBox}
                    value={userName}
                    onChangeText={text => setUserName(text)}
                  />
                  <TextInput
                    label={i18n.t('Password')}
                    value={password}
                    onChangeText={text => setPassword(text)}
                    style={styles.inputBox}
                    right={<TextInput.Icon icon="eye" onPress={() => setIsShow(!isShow)} />}
                    secureTextEntry={!isShow ? true : false}
                  />
                  <View> 
                    <TouchableOpacity onPress={() => setForgotPasswordShow(true)}>
                        <View>
                          <Text style={{textAlign:'right', color: 'blue'}}>{i18n.t('Forgot Password')}</Text>
                        </View>
                    </TouchableOpacity>
                  </View>
                  {/* <Text style={{ textAlign: 'right', fontSize: 12 }}>{i18n.t('Forgot Password')}</Text> */}
                  <Button mode="contained" textColor='white' style={{ backgroundColor: '#FE7940', marginTop: 30 }} onPress={signInButton}>{i18n.t('Log In')}</Button>
                  <Text style={{ marginBottom: 20, marginTop: 20, textAlign: 'center' }}>{i18n.t('OR')}</Text>
                  <View style={{ alignContent: 'center', flexDirection: 'row', justifyContent: "center" }}>
                    <Button style={{ height: 70, justifyContent: 'center', alignItems: 'flex-end', padding: 0 }} onPress={signInWithGoogleAsync}><Image source={require('../../../assets/images/icons/google.png')} resizeMode='stretch' style={{ width: 60, height: 60 }} /></Button>
                    <Button style={{ height: 70, justifyContent: 'center', alignItems: 'baseline', padding: 0 }} onPress={signInWithFacebookAsync}><Image source={require('../../../assets/images/icons/facebook.png')} resizeMode='stretch' style={{ width: 60, height: 60 }} /></Button>
                  </View>
                </View>
              </Card.Content> : 
              <Card.Content>
                <View>
                  <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => setForgotPasswordShow(false)}>
                    <AntDesign name="left" size={20} color="#474747" /><Text style={{ fontSize: 17, color: '#474747', fontWeight: '700', marginLeft: 10 }}>{i18n.t('Back')}</Text>
                  </TouchableOpacity>
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
                  marginRight:'auto',
                  marginBottom: 20
                }}>
                  <Picker
                    selectedValue={selectedLanguage}
                    style={{ width: "100%", height: 30, marginLeft: 15 }}

                    onValueChange={(itemValue, itemIndex) => setSelectedLanguage(itemValue)}
                  >
                    <Picker.Item label={i18n.t('English')} value="en" style={{ fontSize: 12, marginLeft: 15 }} />
                    <Picker.Item label={i18n.t('Français')} value="fr" style={{ fontSize: 12 }} />
                  </Picker>
                </View>
                <Text>{i18n.t('EnterEmailorPhone')}</Text>
                <TextInput
                  label={i18n.t('Email or Phone number')}
                    style={styles.inputBox}
                    value={emailorphone}
                    onChangeText={text => setEmailorPhone(text)}
                  />
                 <Button mode="contained" textColor='white' style={{ backgroundColor: '#FE7940', marginTop: 30 }} onPress={EmailorPhoneVerify}>{i18n.t('Next')}</Button>
              </Card.Content>}
            </Card>
          </ScrollView>
        </View>
        {isLoading && <Preloader />}
      </ImageBackground>
    </View>
  )

}

