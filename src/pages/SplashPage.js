import React, { useState, useEffect } from 'react';
import { ActivityIndicator, View, ImageBackground, Button } from 'react-native';
import { styles } from '../styles';
import auth from '@react-native-firebase/auth';
import { firebase } from '../config/firebaseConfig.js';
import { LoginManager, AccessToken, LoginButton, Profile } from 'react-native-fbsdk-next';
import { useUserContext } from '../context/userContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SplashPage({ navigation }) {
    const [animating, setAnimating] = useState(true);
    const { user, signIn } = useUserContext();

    const getUserData = async () => {
        try {
            const _userData = await AsyncStorage.getItem('userData');
            if (_userData != null) {
                let userData = JSON.parse(_userData);
                if (Object.keys(userData).length !== 0) {
                    userData = JSON.parse(_userData)
                    signIn({
                        id: userData._id,
                        userName: userData.userName,
                        userEmail: userData.userEmail,
                        phoneNumber: userData.phoneNumber,
                        birth: userData.birth,
                        language: userData.language,
                        address: userData.address,
                        avatarUrl: userData.avatarUrl,
                        church: userData.church
                    });
                    navigation.navigate("HomeApp");
                } else {
                    navigation.navigate("Login");
                }
            }
            else {
                navigation.navigate("Login");
            }
        } catch (e) {
            navigation.navigate("Login");
        }
    }

    useEffect(() => {
        getUserData();
        setAnimating(false);
        // setTimeout(() => {
        //     navigation.navigate("Login");
        // }, 2000);
    }, []);
    // getUserData();

    return (
        <View style={{ flex: 1 }}>
            <ImageBackground source={require('../../assets/images/splash.png')} resizeMode="cover" style={{ backgroundColor: "#FE7940", flex: 1, justifyContent: 'center' }}>
                <ActivityIndicator
                    animating={animating}
                    color="#FFFFFF"
                    size="large"
                    style={styles.activityIndicator}
                />
            </ImageBackground>
        </View>
    )
}