import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import { firebase } from '../config/firebaseConfig.js';
import { LoginManager } from 'react-native-fbsdk-next';
import { I18n } from 'i18n-js';
import { ENTranslates, FRTranslates } from '../constants/Images';
// Create a context
const userContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [reRenderFlag, setReRenderFlag] = useState(false);
  const [notificationFlag, setNotificationFlag] = useState(false);
  const [language, setLanguage] = useState('fr');

  // For 6 digts verify
  const [verifyUserName, setVerifyUserName] = useState(' ');
  const [verifyPhoneNumber, setVerifyPhoneNumber] = useState('');
  const [stateEmailorPhone, setStateEmailorPhone] = useState(0); //0 - email forgot password, 1 - phone forgot password

  const translations = {
    en: ENTranslates,
    fr: FRTranslates,
  };
  const i18n = new I18n(translations);
  // console.log(Localization.locale);

  i18n.defaultLocale = language;
  i18n.locale = language;
  i18n.enableFallback = true;
  i18n.missingBehavior = "guess";


  const signIn = (
    {
      id,
      userName,
      userEmail,
      phoneNumber,
      birth,
      language,
      address,
      avatarUrl,
      church
    }) => {
    setUser({
      id: id,
      userName: userName,
      userEmail: userEmail,
      phoneNumber: phoneNumber,
      birth: birth,
      language: language,
      address: address,
      avatarUrl: avatarUrl,
      church: church
    }
    );

    let userData = {
      id: id,
      userName: userName,
      userEmail: userEmail,
      phoneNumber: phoneNumber,
      birth: birth,
      language: language,
      address: address,
      avatarUrl: avatarUrl,
      church: church
    }

    setUserData(userData);
   
  }

  const setUserData = async (data) => {
    await AsyncStorage.setItem("userData", JSON.stringify(data));
  }

  const setToken = async (token) => {
    await AsyncStorage.setItem('token', token);
  }

  const signOut = async () => {
    setToken('');
    setUserData('');
    setUser(null);
    try {
      await LoginManager.logOut();
      await firebase.auth().signOut();
    } catch (error) {
      console.log("error", error);
    }
  }

  const setLoding = (value) => {
    setIsLoading(value);
  }

  const setRenderFlag = (value) => {
    setReRenderFlag(value);
  }

  const setNotification = (value) => {
    setNotificationFlag(value);
  }

  const setAppLanguage = async (value) => {
    await AsyncStorage.setItem('language', value);
    setLanguage(value);
  }

  const getAppLanguage = async () => {
    let _language = await AsyncStorage.getItem('language');
    if (!_language) {
      _language = "en";
    }
    setLanguage(_language);
  }

  useEffect(() => {
    getAppLanguage();
  }, []);


  return (
    <userContext.Provider value={{ user, isLoading, reRenderFlag, notificationFlag, language, verifyUserName, setVerifyUserName, verifyPhoneNumber, setVerifyPhoneNumber, stateEmailorPhone, setStateEmailorPhone, signIn, signOut, setLoding, setRenderFlag, setNotification, setAppLanguage, i18n }}>
      {children}
    </userContext.Provider>
  );
};

export const useUserContext = () => {
  return useContext(userContext);
};