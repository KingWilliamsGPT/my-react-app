import React, { useState, useEffect } from 'react';
import { Text, View, Image, ScrollView, TouchableOpacity, Share } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomHeader, { SubHeader } from "../../components/CustomHeader";
import * as ImagePicker from 'expo-image-picker';
import { TextInput, Button, Modal } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import { useUserContext } from '../../context/userContext';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import Preloader from '../../components/Preloader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { envVar } from '../../constants/env_vars';
import { auth, getAuth } from '@react-native-firebase/auth';
import { firebase } from '../../config/firebaseConfig.js';
import { styles } from '../../styles';

function ProfilePage({ navigation }) {
    const { user, signIn, setLoding, isLoading, i18n } = useUserContext();
    const [churchData, setChurchData] = React.useState([]);

    const [name, setName] = useState(user?.userName);
    const [email, setEmail] = useState(user?.userEmail);
    const [birth, setBirth] = useState(user?.birth);
    const oldPhoneNumber = user?.phoneNumber;
    const [phone, setPhone] = useState(user?.phoneNumber);
    const [address, setAddress] = useState(user?.address);
    const [avataUrl, setAvatarUrl] = React.useState(user?.avatarUrl);
    const [selectedChurch, setSelectedChurch] = React.useState(user?.church);
    const [selectedLanguage, setSelectedLanguage] = React.useState(user?.language);
    const [visible, setVisible] = React.useState(false);

    const [oPassword, setOPassword] = useState('');
    const [nPassword, setNPassword] = useState('');
    const [cPassword, setCPassword] = useState('');
    const [allowOldPassword, setAllowOldPassword] = useState(true);

    // Show verify phone number UI
    const [phoneShow, setPhoneShow] = useState(false);
    // If null, no SMS has been sent
    const [confirm, setConfirm] = useState(null);

    // verification code (OTP - One-Time-Passcode)
    const [code, setCode] = useState('');
    ////////////
    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);
    const containerStyle = { backgroundColor: 'white', padding: 20 };

    /**
     *    Phone Verify
     */
    // Handle login
    function onAuthStateChanged(user) {
        if (user) {
            // Some Android devices can automatically process the verification code (OTP) message, and the user would NOT need to enter the code.
            // Actually, if he/she tries to enter it, he/she will get an error message because the code was already used in the background.
            // In this function, make sure you hide the component(s) for entering the code and/or navigate away from this screen.
            // It is also recommended to display a message to the user informing him/her that he/she has successfully logged in.
        }
    }

    // Handle the button press
    async function signInWithPhoneNumber(phoneNumber) {
        // const confirmation = await firebase.auth().signInWithPhoneNumber(phoneNumber);
        // setConfirm(confirmation);
        // firebase.auth().settings.appVerificationDisabledForTesting = true;
        // const appVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');
        if (phoneNumber != oldPhoneNumber) {
            const data = {
                userEmail: email,
                phoneNumber: phoneNumber
            }
            const token = await AsyncStorage.getItem('token');
            const headers = {
                authorization: `${token}`
            }
            await axios.post(`${envVar['BACKEND_LINK']}/accounts/checkPhoneNumber`, data, { headers })
                .then(function (response) {
                    //Check the new phone that is existed in database
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
                            setConfirm(null);
                            setLoding(false);
                            setPhone(oldPhoneNumber);
                            Toast.show({
                                type: 'error',
                                text1: i18n.t("SMSNotSent"),
                            });
                        });
                })
                .catch(function (error) {
                    Toast.show({
                        type: 'error',
                        text1: i18n.t("PhoneExists"),
                    });
                    setConfirm(null);
                    setPhone(oldPhoneNumber);
                    setPhoneShow(false);
                    return;
                });
        }
        else {
            setPhoneShow(false);
        }

    }

    function confirmCode() {
        setLoding(true);
        try {
            confirm.confirm(code).then(async function () {
                await updateProfile();
                setLoding(false);
                setConfirm(null);
                setPhoneShow(false);
            }).catch(function (error) {
                console.log('Invalid code.');
                setLoding(false);
                setConfirm(null);
                setPhoneShow(false);
                Toast.show({
                    type: 'error',
                    text1: i18n.t("VerifyIncorrect"),
                });
            });
        } catch (error) {
            console.log('Invalid code.');
            setLoding(false);
            setConfirm(null);
            setPhoneShow(false);
            Toast.show({
                type: 'error',
                text1: i18n.t("Verify Failed"),
            });
        }


    }
    //
    const pickImage = async () => {
        let image = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });


        if (!image.canceled) {
            setAvatarUrl(image.uri);

            let imageUri = image.uri;
            let fileName = imageUri.split('/').pop();
            let fileExtension = imageUri.substring(imageUri.lastIndexOf('.') + 1);
            let date = new Date();
            setLoding(true);

            const formData = new FormData();
            formData.append('image', {
                uri: image.uri,
                type: `image/${image.type}`,
                name: `profile_${date.getFullYear()}_${date.getMonth()}_${date.getDay()}_${date.getHours()}_${date.getMinutes()}_${date.getSeconds()}.${fileExtension}`,
            });

            await axios.post(`${envVar['BACKEND_LINK']}/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
                .then(response => {
                    setAvatarUrl(response.data.path);
                    setLoding(false);
                    Toast.show({
                        type: 'success',
                        text1: i18n.t("ImageUploaded"),
                    });
                })
                .catch(error => {
                    setLoding(false);
                    console.error(error);
                });
        }
    };


    const updateProfile = async () => {
        console.log('updateProfile');
        setLoding(true);
        const token = await AsyncStorage.getItem('token');
        const headers = {
            authorization: `${token}`
        }
        await axios.post(`${envVar['BACKEND_LINK']}/accounts/update_profile`,
            {
                userId: user.id,
                username: name,
                useremail: email,
                phonenumber: phone,
                birth: birth,
                language: selectedLanguage,
                address: address,
                church: selectedChurch,
                avatarurl: avataUrl,
                status: true
            },
            { headers })
            .then(function (response) {
                Toast.show({
                    type: 'success',
                    text1: i18n.t("Succeed"),
                    // text2: i18n.t(response.data.message),
                });
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
                })
                setLoding(false);

            })
            .catch(function (error) {
                setLoding(false);
                Toast.show({
                    type: 'error',
                    text1: i18n.t("Failed"),
                    text2: error.message,
                });
            });
    }

    const updatePassword = async () => {
        const token = await AsyncStorage.getItem('token');
        const headers = {
            authorization: `${token}`
        }


        if (nPassword == '' || cPassword == '') {
            Toast.show({
                type: 'error',
                text1: i18n.t("EnterPass"),
            });
            return;
        }

        if (nPassword != cPassword) {
            Toast.show({
                type: 'error',
                text1: i18n.t("PasswordMismatch"),
            });
            return;
        }
        setLoding(true);
        await axios.post(`${envVar['BACKEND_LINK']}/accounts/update_password`,
            {
                userId: user.id,
                useremail: email,
                oldpassword: oPassword,
                newpassword: nPassword,
                GoogleorFacebook: !allowOldPassword
            }, {
            headers
        })
            .then(function (response) {
                Toast.show({
                    type: 'success',
                    text1: i18n.t("Succeed"),
                    // text2: i18n.t(response.data.message),
                });
                // signIn(response.data)
                setOPassword("");
                setNPassword("");
                setCPassword("");
                setLoding(false);

            })
            .catch(function (error) {
                setLoding(false);
                Toast.show({
                    type: 'error',
                    text1: i18n.t("Failed"),
                    text2: i18n.t(error.message),
                });
            });
    }

    const getChurchList = async () => {
        const token = await AsyncStorage.getItem('token');
        const headers = {
            authorization: `${token}`
        }
        await axios.get(`${envVar['BACKEND_LINK']}/church/all_churches`, { headers })
            .then(function (response) {
                setChurchData(response.data.church);
            })
            .catch(function (error) {
                Toast.show({
                    type: 'error',
                    text1: i18n.t("Failed"),
                    text2: i18n.t(error.message),
                });
            });
    }
    const getSignGoogleorFacebook = async () => {
        const isAllowed = await AsyncStorage.getItem('googleorfacebook');
        const token = await AsyncStorage.getItem('token');
        const headers = {
            authorization: `${token}`
        }
        if (isAllowed == "true") {
            const data = {
                userEmail: user?.userEmail
            }
            await axios.post(`${envVar['BACKEND_LINK']}/accounts/getSignGoogleorFacebook`, data, { headers })
                .then(function (response) {
                    if (response.data.GoogleorFacebook) {
                        setAllowOldPassword(false);
                        setOPassword(email);
                    }
                })
                .catch(function (error) {
                    Toast.show({
                        type: 'error',
                        text1: i18n.t("Failed"),
                        text2: i18n.t(error.message),
                    });
                });
        }
    }

    useEffect(() => {
        const getData = navigation.addListener('focus', () => {
            setOPassword('');
            setNPassword('');
            setCPassword('');
            getChurchList();
            getSignGoogleorFacebook();
            setConfirm(null);
            setPhoneShow(false);
        });
        return getData;
    }, [navigation]);


    useEffect(() => {
        const auth = getAuth();
        auth.languageCode = 'it';

        const subscriber = firebase.auth().onAuthStateChanged(onAuthStateChanged);
        return subscriber; // unsubscribe on unmount
    });

    const onShare = async () => {
        try {
            const result = await Share.share({
                message:
                    'React Native | A framework for building native apps using React',
            });
            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // shared with activity type of result.activityType
                } else {
                    // shared
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
            }
        } catch (error) {
            Alert.alert(error.message);
        }
    };


    return (
        <SafeAreaView style={{ flex: 1 }}>
            <CustomHeader title={i18n.t('Setting')} navigation={navigation} />
            <SubHeader navigation={navigation} />
            <ScrollView style={{ flex: 1, paddingHorizontal: 15 }}>
                {phoneShow ? <>
                    {!confirm ?
                        <View>
                            <Text>{i18n.t('EnterPhone')}</Text>
                            <TextInput
                                label={i18n.t('Phone Number')}
                                value={phone}
                                onChangeText={text => setPhone(text)}
                                style={styles.inputBox}
                                require
                            />
                            <Button mode="contained" textColor='white' style={{ backgroundColor: '#FE7940', marginVertical: 30 }} onPress={() => signInWithPhoneNumber(phone)}>{i18n.t('Send a code')}</Button>
                        </View> : <View>
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
                        </View>}
                </> :
                    <><View style={{ alignItems: 'center', justifyContent: 'center' }}>
                        <TouchableOpacity onPress={pickImage}>
                            {avataUrl ? <Image source={{ uri: avataUrl }} style={{ width: 115, height: 115, borderRadius: 500, marginBottom: 20 }} /> : <Image source={require('../../../assets/images/default_user.png')} style={{ width: 115, height: 115, borderRadius: 500, marginBottom: 20 }} />}
                        </TouchableOpacity>
                    </View>
                        <Text style={{ color: "#868889", fontSize: 13, fontWeight: '700', textAlign: 'left' }}>{i18n.t('Profile')}</Text>
                        <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
                            <TextInput
                                label={i18n.t('Full Name')}
                                value={name}
                                style={{ backgroundColor: 'transparent', fontSize: 12 }}
                                onChangeText={text => setName(text)}
                            />
                            <TextInput
                                label={i18n.t('Email')}
                                value={email}
                                style={{ backgroundColor: 'transparent', fontSize: 12 }}
                                onChangeText={text => setEmail(text)}
                            />
                            <TextInput
                                label={i18n.t('Phone number')}
                                value={phone}
                                style={{ backgroundColor: 'transparent', fontSize: 12 }}
                                onChangeText={text => setPhone(text)}
                            />
                            <TextInput
                                label={i18n.t('Address')}
                                value={address}
                                style={{ backgroundColor: 'transparent', fontSize: 12 }}
                                onChangeText={text => setAddress(text)}
                            />
                            <TextInput
                                label={i18n.t('Birthday')}
                                placeholder='2000-01-01'
                                keyboardType={'numeric'}
                                style={{ backgroundColor: 'transparent', width: "100%", fontSize: 12 }}
                            />
                            <Text style={{ fontSize: 11, marginLeft: 15, marginTop: 5 }}>{i18n.t('Churches')}</Text>
                            <View style={{
                                flex: 1,
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexDirection: 'column',
                                borderBottomColor: 'black',
                                borderBottomWidth: 1
                            }}>

                                <Picker
                                    selectedValue={selectedChurch}
                                    style={{ width: "100%", height: 30, marginLeft: 15 }}
                                    onValueChange={(itemValue, itemIndex) => setSelectedChurch(itemValue)}
                                >
                                    {churchData.map((item, index) => (
                                        <Picker.Item label={item.churchName} key={index} value={item._id} style={{ fontSize: 12 }} />
                                    ))}
                                </Picker>

                            </View>

                            <Button mode="contained" textColor='white' style={{ backgroundColor: '#FE7940', marginTop: 30 }} onPress={() => setPhoneShow(true)}>{i18n.t('Update Profile')}</Button>
                        </View>
                        <Text style={{ color: "#868889", fontSize: 13, fontWeight: '700', textAlign: 'left' }}>{i18n.t('Security')}</Text>
                        <View style={{ paddingHorizontal: 20, marginBottom: 50 }}>
                            <TextInput
                                label={i18n.t('Old Password')}
                                secureTextEntry={true}
                                value={oPassword}
                                onChangeText={(text) => setOPassword(text)}
                                style={{ backgroundColor: 'transparent', fontSize: 12 }}
                                disabled={!allowOldPassword}
                            />
                            <TextInput
                                label={i18n.t('New Password')}
                                secureTextEntry={true}
                                value={nPassword}
                                onChangeText={(text) => setNPassword(text)}
                                style={{ backgroundColor: 'transparent', fontSize: 12 }}
                            />
                            <TextInput
                                label={i18n.t('Confirm Password')}
                                secureTextEntry={true}
                                value={cPassword}
                                onChangeText={text => setCPassword(text)}
                                style={{ backgroundColor: 'transparent', fontSize: 12 }}
                            />
                            <Button mode="contained" textColor='white' style={{ backgroundColor: '#FE7940', marginTop: 30 }} onPress={updatePassword}>{i18n.t('Update Password')}</Button>
                            <TouchableOpacity mode="contained" textColor='white' style={{ borderColor: "#FE7940", borderWidth: 1, borderRadius: 50, backgroundColor: 'white', marginVertical: 30, flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 40 }} onPress={onShare}><Ionicons name="share-social" size={20} color="#FE7940" /><Text style={{ color: '#FE7940', marginLeft: 10 }}>{i18n.t('Share')}</Text></TouchableOpacity>
                            <TouchableOpacity style={{ flexDirection: 'row', marginLeft: 10, justifyContent: 'center' }} onPress={showModal}>
                                <Text style={{ color: '#FE7940', textDecorationLine: 'underline' }}>{i18n.t('Terms & Conditions')}</Text>
                            </TouchableOpacity>
                        </View></>}

            </ScrollView>
            {isLoading && <Preloader />}
            <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={containerStyle}>
                <ScrollView>
                    <View>
                        <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 }}>{i18n.t('Terms Title')}</Text>
                        <Text style={{ fontSize: 12, fontWeight: '400', marginBottom: 10 }}>{i18n.t('Terms description')}</Text>
                        <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 5 }}>{i18n.t('Terms subtitle1')}</Text>
                        <Text style={{ fontSize: 12, fontWeight: '400', marginBottom: 10 }}>{i18n.t('Terms subdescription1')}</Text>
                        <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 5 }}>{i18n.t('Terms subtitle2')}</Text>
                        <Text style={{ fontSize: 12, fontWeight: '400', marginBottom: 10 }}>{i18n.t('Terms subdescription2')}</Text>
                        <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 5 }}>{i18n.t('Terms subtitle3')}</Text>
                        <Text style={{ fontSize: 12, fontWeight: '400', marginBottom: 10 }}>{i18n.t('Terms subdescription3')}</Text>
                        <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 5 }}>{i18n.t('Terms subtitle4')}</Text>
                        <Text style={{ fontSize: 12, fontWeight: '400', marginBottom: 10 }}>{i18n.t('Terms subdescription4')}</Text>
                        <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 5 }}>{i18n.t('Terms subtitle5')}</Text>
                        <Text style={{ fontSize: 12, fontWeight: '400', marginBottom: 10 }}>{i18n.t('Terms subdescription5')}</Text>
                        <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 5 }}>{i18n.t('Terms subtitle6')}</Text>
                        <Text style={{ fontSize: 12, fontWeight: '400', marginBottom: 10 }}>{i18n.t('Terms subdescription6')}</Text>
                        <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 5 }}>{i18n.t('Terms subtitle7')}</Text>
                        <Text style={{ fontSize: 12, fontWeight: '400', marginBottom: 10 }}>{i18n.t('Terms subdescription7')}</Text>
                        <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 5 }}>{i18n.t('Terms subtitle8')}</Text>
                        <Text style={{ fontSize: 12, fontWeight: '400', marginBottom: 30 }}>{i18n.t('Terms subdescription8')}</Text>
                        <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 5 }}>{i18n.t('Terms bottom title')}</Text>
                        <Text style={{ fontSize: 12, fontWeight: '400', marginBottom: 30 }}>{i18n.t('Terms bottom description')}</Text>
                        <Button mode="contained" textColor='white' style={{ backgroundColor: '#FE7940' }} onPress={hideModal}>{i18n.t('Agree Terms & Conditions')}</Button>
                    </View>
                </ScrollView>
            </Modal>
        </SafeAreaView>
    );
}

export default ProfilePage;
