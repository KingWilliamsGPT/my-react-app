import React, { useEffect, useState } from 'react';
import { View, ImageBackground, Image, Text, TouchableOpacity } from "react-native";
import { Card, TextInput, Button, Checkbox, Portal, Modal } from 'react-native-paper';
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

export default function RegisgerScreen({ navigation }) {

  const { signIn, signOut, setLoding, isLoading, language, setAppLanguage, i18n, setVerifyUserName, setVerifyPhoneNumber } = useUserContext();
  const [selectedLanguage, setSelectedLanguage] = React.useState(language);

  const [userName, setUserName] = React.useState('');
  const [userPhoneNumber, setUserPhoneNumber] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [cPassword, setCPassword] = React.useState('');
  const [fbUser, setFbUser] = useState();

  const [visible, setVisible] = React.useState(false);
  const [checked, setChecked] = React.useState(false)

  const showModal = () => setVisible(true);
  const hideModal = () => {
    setVisible(false);
    setChecked(true);
  }
  const containerStyle = {backgroundColor: 'white', padding: 20};

  const setToken = async (token) => {
    await AsyncStorage.setItem('token', token);
  }

  const signUpButton = async () => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (emailRegex.test(userName) == false) {
      Toast.show({
        type: 'error',
        text1:  i18n.t("Failed"),
        text2: i18n.t("InvalidEmail")
      });
      return;
    }
    if(checked == false) {
      Toast.show({
        type: 'error',
        text1: i18n.t("Failed"),
        text2: i18n.t("CheckTerms"),
      });
      return;
    }
    setLoding(true);
    let data = {
      useremail: userName,
      phonenumber: userPhoneNumber,
      password: password,
      language: selectedLanguage,
      avatarUrl: '',
      userName: ''
    }

    if (userName == '' || userPhoneNumber == '' || password == '') {
      setLoding(false);
      Toast.show({
        type: 'error',
        text1: i18n.t("Failed"),
        text2: i18n.t("UserPhonePassNull"),
      });
      return
    }

    if (password != cPassword && password != '') {
      setLoding(false);
      Toast.show({
        type: 'error',
        text1: i18n.t("Failed"),
        text2: i18n.t("PasswordMismatch"),
      });
      return
    }

    setVerifyUserName(userName);
    setVerifyPhoneNumber(userPhoneNumber);

    await axios.post(`${envVar['BACKEND_LINK']}/accounts/signup`, data)
      .then(function (response) {
        setLoding(false);
        Toast.show({
          type: 'success',
          text1: i18n.t("Succeed"),
          // text2: i18n.t(response.data.message),
        });

        navigation.navigate("RegisterAuth");
      })
      .catch(function (error) {
        setLoding(false);
        console.log('----Registrtation Page Error----');
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

  const isSignedIn = async () => {
    const isSignedIn = await GoogleSignin.isSignedIn();
    return isSignedIn;
  };

  const setSignGoogleorFacebook =  async() => {
    await AsyncStorage.setItem('googleorfacebook', "true");
  }

  const signInWithGoogleAsync = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      if (userInfo == undefined) {
        Toast.show({
          type: 'error',
          text1: i18n.t("Failed"),
          text2: i18n.t("Failed"),
        });
        return
      }

      setLoding(true)

      let data = {
        useremail: userInfo.user.email,
        phonenumber: '',
        password: userInfo.user.email,
        language: "EN",
        avatarUrl: userInfo.user.photo,
        userName: userInfo.user.name,
        GoogleorFacebook: true
      }

      setVerifyUserName(userInfo.user.email);
      await axios.post(`${envVar['BACKEND_LINK']}/accounts/signup`, data)
        .then(function (response) {
          setLoding(false);
          Toast.show({
            type: 'success',
            text1: i18n.t("Succeed"),
            // text2: i18n.t(response.data.message),
          });
          setToken(response.data.token);
          setSignGoogleorFacebook();
          // navigation.navigate("RegisterAuth");
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

  const signInWithFacebookAsync = async () => {

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
    return auth().signInWithCredential(facebookCredential);


  }

  const [initializing, setInitializing] = useState(true);

  const onAuthstateChanged = (user) => {
    setFbUser(user);
    if (initializing) setInitializing(false);
  }

  const fbSignUp = async () => {
    if (fbUser == undefined || fbUser == null) {
      return
    }

    setLoding(true)

    let data = {
      useremail: fbUser?.email,
      phonenumber: '',
      password: fbUser?.email,
      language: "EN",
      avatarUrl: fbUser?.photoURL,
      userName: fbUser?.displayName,
      GoogleorFacebook: true
    }

    //verify email
    setVerifyUserName(fbUser?.email);

    await axios.post(`${envVar['BACKEND_LINK']}/accounts/signup`, data)
      .then(function (response) {
        setLoding(false);
        Toast.show({
          type: 'success',
          text1: i18n.t("Succeed"),
          // text2: i18n.t(response.data.message),
        });
        setToken(response.data.token);
        setSignGoogleorFacebook();
        // navigation.navigate("RegisterAuth");
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
    const subscriber = firebase.auth().onAuthStateChanged(onAuthstateChanged);
    return subscriber;
  })

  useEffect(() => {
    const getData = navigation.addListener('focus', () => {
      signOut();
      setUserName('');
      setUserPhoneNumber('');
      setPassword('');
      setCPassword('');
      GoogleSignin.configure({
        offlineAccess: false,
        webClientId: '652995917303-ae65frjhndhrkoesue4qj3a9t2lth4gq.apps.googleusercontent.com',
        forceConsentPrompt: true
      });
    });
    return getData;
  }, [navigation]);

  useEffect(() => {
    if (fbUser != null || fbUser != undefined) {
      fbSignUp();
    }
  }, [fbUser]);

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
                    <Picker.Item label={i18n.t("English")} value="en" style={{ fontSize: 12, marginLeft: 15 }} />
                    <Picker.Item label={i18n.t("French")} value="fr" style={{ fontSize: 12 }} />
                  </Picker>
                </View>

                <View style={styles.tabButtonView}>
                  <Button style={styles.tabButton} textColor="#FE7940" onPress={() => navigation.navigate("Login")}>{i18n.t('Log In')}</Button>
                  <Button style={styles.tabButtonActive} textColor="white" onPress={() => navigation.navigate("Register")}>{i18n.t('Sign Up')}</Button>
                </View>
                <View>
                  <TextInput
                    label={i18n.t('Email')}
                    value={userName}
                    onChangeText={text => setUserName(text)}
                    style={styles.inputBox}
                    keyboardType='email-address'
                    require
                  />
                  <TextInput
                    label={i18n.t('Phone number')}
                    value={userPhoneNumber}
                    onChangeText={text => setUserPhoneNumber(text)}
                    style={styles.inputBox}
                    keyboardType='phone-pad'
                  />
                  <TextInput
                    label={i18n.t('Password')}
                    value={password}
                    onChangeText={text => setPassword(text)}
                    style={styles.inputBox}
                    secureTextEntry={true}
                  />
                  <TextInput
                    label={i18n.t('Confirm password')}
                    value={cPassword}
                    onChangeText={text => setCPassword(text)}
                    style={styles.inputBox}
                    secureTextEntry={true}
                  />
                  <View style={{ alignItems: 'center', flex: 1, flexDirection: 'row' }}>
                  <Checkbox color='#FE7940' status={checked ? "checked" : "unchecked"} onPress={() => setChecked(!checked)}/>
                  {/* <Text>{i18n.t('I Read and again to')}</Text> */}
                  <TouchableOpacity style={{ flexDirection: 'row', marginLeft: 10 }} onPress={showModal}>
                    <Text style={{color:'#FE7940', textDecorationLine:'underline'}}>{i18n.t('Terms & Conditions')}</Text>
                  </TouchableOpacity>
                </View>
                  <Button mode="contained" textColor='white' style={{ backgroundColor: '#FE7940', marginTop: 30 }} onPress={signUpButton}>{i18n.t('Sign Up')}</Button>
                  <Text style={{ marginBottom: 20, marginTop: 20, textAlign: 'center' }}>{i18n.t('OR')}</Text>
                  <View style={{ alignContent: 'center', flexDirection: 'row', justifyContent: "center" }}>
                    <Button style={{ height: 70, justifyContent: 'center', alignItems: 'flex-end', padding: 0 }} onPress={signInWithGoogleAsync}><Image source={require('../../../assets/images/icons/google.png')} resizeMode='stretch' style={{ width: 60, height: 60 }} /></Button>
                    <Button style={{ height: 70, justifyContent: 'center', alignItems: 'baseline', padding: 0 }} onPress={signInWithFacebookAsync}><Image source={require('../../../assets/images/icons/facebook.png')} resizeMode='stretch' style={{ width: 60, height: 60 }} /></Button>
                  </View>
                </View>
                
              </Card.Content>
            </Card>
          </ScrollView>
        </View>
        {isLoading && <Preloader />}
      </ImageBackground>
        <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={containerStyle}>
          <ScrollView>
            <View>
              <Text style={{fontSize:20, fontWeight:'bold', textAlign:'center', marginBottom:20}}>{i18n.t('Terms Title')}</Text>
              <Text style={{fontSize:12, fontWeight:'400', marginBottom:10}}>{i18n.t('Terms description')}</Text>
              <Text style={{fontSize:14, fontWeight:'bold', marginBottom:5}}>{i18n.t('Terms subtitle1')}</Text>
              <Text style={{fontSize:12, fontWeight:'400', marginBottom:10}}>{i18n.t('Terms subdescription1')}</Text>
              <Text style={{fontSize:14, fontWeight:'bold', marginBottom:5}}>{i18n.t('Terms subtitle2')}</Text>
              <Text style={{fontSize:12, fontWeight:'400', marginBottom:10}}>{i18n.t('Terms subdescription2')}</Text>
              <Text style={{fontSize:14, fontWeight:'bold', marginBottom:5}}>{i18n.t('Terms subtitle3')}</Text>
              <Text style={{fontSize:12, fontWeight:'400', marginBottom:10}}>{i18n.t('Terms subdescription3')}</Text>
              <Text style={{fontSize:14, fontWeight:'bold', marginBottom:5}}>{i18n.t('Terms subtitle4')}</Text>
              <Text style={{fontSize:12, fontWeight:'400', marginBottom:10}}>{i18n.t('Terms subdescription4')}</Text>
              <Text style={{fontSize:14, fontWeight:'bold', marginBottom:5}}>{i18n.t('Terms subtitle5')}</Text>
              <Text style={{fontSize:12, fontWeight:'400', marginBottom:10}}>{i18n.t('Terms subdescription5')}</Text>
              <Text style={{fontSize:14, fontWeight:'bold', marginBottom:5}}>{i18n.t('Terms subtitle6')}</Text>
              <Text style={{fontSize:12, fontWeight:'400', marginBottom:10}}>{i18n.t('Terms subdescription6')}</Text>
              <Text style={{fontSize:14, fontWeight:'bold', marginBottom:5}}>{i18n.t('Terms subtitle7')}</Text>
              <Text style={{fontSize:12, fontWeight:'400', marginBottom:10}}>{i18n.t('Terms subdescription7')}</Text>
              <Text style={{fontSize:14, fontWeight:'bold', marginBottom:5}}>{i18n.t('Terms subtitle8')}</Text>
              <Text style={{fontSize:12, fontWeight:'400', marginBottom:30}}>{i18n.t('Terms subdescription8')}</Text>
              <Text style={{fontSize:14, fontWeight:'bold', marginBottom:5}}>{i18n.t('Terms bottom title')}</Text>
              <Text style={{fontSize:12, fontWeight:'400', marginBottom:30}}>{i18n.t('Terms bottom description')}</Text>
              <Button mode="contained" textColor='white' style={{ backgroundColor: '#FE7940' }} onPress={hideModal}>{i18n.t('Agree Terms & Conditions')}</Button>
            </View>
          </ScrollView>
        </Modal>
    </View>
  )

}

