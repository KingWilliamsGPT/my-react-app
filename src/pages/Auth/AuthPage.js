import React, { useEffect } from 'react';
import { View, ImageBackground, Image, Text } from "react-native";
import { Card, TextInput, Button } from 'react-native-paper';
import { styles } from '../../styles';
import { IMAGE } from '../../constants/Images';
import Toast from 'react-native-toast-message';
import axios from 'axios';
import { useUserContext } from '../../context/userContext';
import Preloader from '../../components/Preloader';
import { envVar } from '../../constants/env_vars';

export default function AuthScreen({ navigation }) {

    const { signIn, signOut, setLoding, isLoading, i18n } = useUserContext();
    const [isFirst, setIsFirst] = React.useState(true);
    const [isShow, setIsShow] = React.useState(false);

    const [userName, setUserName] = React.useState('');
    const [userPhoneNumber, setUserPhoneNumber] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [cPassword, setCPassword] = React.useState('');



    useEffect(() => {
        setUserName('');
        setUserPhoneNumber('');
        setPassword('');
        setCPassword('');
    }, [isFirst]);

    const signInButton = async () => {
        setLoding(true);

        let data = {
            useremail: userName,
            password: password
        }


        await axios.post(`${envVar['BACKEND_LINK']}/accounts/signin`, data)
            .then(function (response) {
                Toast.show({
                    type: 'success',
                    text1: "Succeed",
                    text2: response.data.message,
                });
                // signIn(response.data)

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
                Toast.show({
                    type: 'error',
                    text1: "Failed",
                    text2: error.message,
                });
            });
    }

    const signUpButton = async () => {
        setLoding(true);
        let data = {
            useremail: userName,
            phonenumber: userPhoneNumber,
            password: password,
            language: "EN",
        }

        if (userName == '' || userPhoneNumber == '' || password == '') {
            setLoding(false);
            Toast.show({
                type: 'error',
                text1: i18n.t('Failed'),
                text2: i18n.t("UserPhonePassNull"),
            });
            return
        }

        if (password != cPassword && password != '') {
            setLoding(false);
            Toast.show({
                type: 'error',
                text1:  i18n.t('Failed'),
                text2: i18n.t('"PasswordMismatch'),
            });
            return
        }

        await axios.post(`${envVar['BACKEND_LINK']}/accounts/signup`, data)
            .then(function (response) {
                setLoding(false);
                Toast.show({
                    type: 'success',
                    text1: "Succeed",
                    text2: response.data.message,
                });

                navigation.navigate("HomeApp");

            })
            .catch(function (error) {
                setLoding(false);
                Toast.show({
                    type: 'error',
                    text1: i18n.t('Failed'),
                    text2: error.message,
                });
            });
    }

    useEffect(() => {
        signOut();
        setUserName('');
        setUserPhoneNumber('');
        setPassword('');
        setCPassword('');
    }, []);

    const SignUpForm = () => {
        return (
            <View>
                <TextInput
                    label={i18n.t("Email")}
                    defaultValue={userName}
                    onChangeText={text => setUserName(text)}
                    style={styles.inputBox}
                    keyboardType='email-address'
                    require
                />
                <TextInput
                    label={i18n.t("Phone number")}
                    defaultValue={userPhoneNumber}
                    onChangeText={text => setUserPhoneNumber(text)}
                    style={styles.inputBox}
                    keyboardType='phone-pad'
                />
                <TextInput
                    label = {i18n.t('Password')}
                    defaultValue={password}
                    onChangeText={text => setPassword(text)}
                    style={styles.inputBox}
                    secureTextEntry={true}
                />
                <TextInput
                    label={i18n.t("Confirm Password")}
                    defaultValue={cPassword}
                    onChangeText={text => setCPassword(text)}
                    style={styles.inputBox}
                    secureTextEntry={true}
                />
                <Button mode="contained" textColor='white' style={{ backgroundColor: '#FE7940', marginTop: 30 }} onPress={signUpButton}>{i18n.t('Sign Out')}</Button>
                <Text style={{ marginBottom: 20, marginTop: 20, textAlign: 'center' }}>{i18n.t('OR')}</Text>
                <View style={{ alignContent: 'center', flexDirection: 'row', justifyContent: "center" }}>
                    <Button style={{ height: 70, justifyContent: 'center', alignItems: 'flex-end', padding: 0 }}><Image source={require('../../../assets/images/icons/google.png')} resizeMode='stretch' style={{ width: 60, height: 60 }} /></Button>
                    <Button style={{ height: 70, justifyContent: 'center', alignItems: 'baseline', padding: 0 }}><Image source={require('../../../assets/images/icons/facebook.png')} resizeMode='stretch' style={{ width: 60, height: 60 }} /></Button>
                </View>
            </View>
        )
    }

    return (

        <View style={styles.container}>
            <ImageBackground source={IMAGE.BACKGROUND_IMAGE} resizeMode="cover" style={styles.image}>
                <View style={styles.mainContinaer}>
                    <Card style={styles.authCard}>
                        <Card.Content>
                            <View style={styles.tabButtonView}>
                                <Button style={isFirst ? styles.tabButtonActive : styles.tabButton} textColor={isFirst ? "white" : "#FE7940"} onPress={() => setIsFirst(true)}>Log In</Button>
                                <Button style={!isFirst ? styles.tabButtonActive : styles.tabButton} textColor={!isFirst ? "white" : "#FE7940"} onPress={() => setIsFirst(false)}>Sign Up</Button>
                            </View>
                            {isFirst ? (
                                <View>
                                    <TextInput
                                        label={i18n.t('Email or Phone number')}
                                        style={styles.inputBox}
                                        defaultValue={userName}
                                        onChangeText={text => setUserName(text)}
                                    />
                                    <TextInput
                                        label={i18n.t("Password")}
                                        defaultValue={password}
                                        onChangeText={text => setPassword(text)}
                                        style={styles.inputBox}
                                        right={<TextInput.Icon icon="eye" onPress={() => setIsShow(!isShow)} />}
                                        secureTextEntry={!isShow ? true : false}
                                    />
                                    <Text style={{ textAlign: 'right', fontSize: 12 }}>{i18n.t('Forgot Password')}</Text>
                                    <Button mode="contained" textColor='white' style={{ backgroundColor: '#FE7940', marginTop: 30 }} onPress={signInButton}>{i18n.t('Log In')}</Button>
                                    <Text style={{ marginBottom: 20, marginTop: 20, textAlign: 'center' }}>{i18n.t('OR')}</Text>
                                    <View style={{ alignContent: 'center', flexDirection: 'row', justifyContent: "center" }}>
                                        <Button style={{ height: 70, justifyContent: 'center', alignItems: 'flex-end', padding: 0 }}><Image source={require('../../../assets/images/icons/google.png')} resizeMode='stretch' style={{ width: 60, height: 60 }} /></Button>
                                        <Button style={{ height: 70, justifyContent: 'center', alignItems: 'baseline', padding: 0 }}><Image source={require('../../../assets/images/icons/facebook.png')} resizeMode='stretch' style={{ width: 60, height: 60 }} /></Button>
                                    </View>
                                </View>
                            ) : (
                                <SignUpForm />
                            )}
                        </Card.Content>
                    </Card>
                </View>
                {isLoading && <Preloader />}
            </ImageBackground>
        </View>
    )

}

