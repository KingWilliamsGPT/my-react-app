import React, { useEffect } from "react";
import { ScrollView, Text, View, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomHeader, { SubHeader } from "../../components/CustomHeader";
import { Button } from 'react-native-paper';
import { useRoute } from "@react-navigation/native";
import { useUserContext } from "../../context/userContext";
import Toast from 'react-native-toast-message';
import axios from 'axios';
import Preloader from "../../components/Preloader";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TextInput } from 'react-native-paper';
import { envVar } from '../../constants/env_vars';
import uuid from 'react-native-uuid';

function DonatePage({ navigation }) {
  const { user, i18n, isLoading, setNotification } = useUserContext();
  const route = useRoute();
  const { id, projectPhoto, description, churchId } = route.params;
  const [amount, setAmount] = React.useState('2000');
  //Cinetpay Integration
  const serviceID = 'Church'; // for transaction_id
  const apiUrl = 'https://api-checkout.cinetpay.com/v2/payment';
  
  const getPaymentUrl = () => {
    const apiPayload = {
      apikey: '750439465653bed44e05e38.46267388', 
      site_id: 511756, 
      transaction_id: `${serviceID}_${uuid.v4()}`, 
      amount: parseInt(amount),  //transaction amount //100
      currency: 'XOF',
      description: 'Souscription Focus Ecole',
      notify_url: 'https://google.com',   //notify url
      return_url: 'https://google.com',   //return url
      channels: 'ALL',
      lang: 'en',
      metadata: '',
      invoice_data: {},
  
      customer_id: 'customer_id',
      customer_name: 'customer_name',
      customer_surname: 'customer_surname',
      customer_phone_number: 'customer_phone_number',
      customer_email: 'ajj@gmail.com',
      customer_address: 'customer_address',
      customer_city: 'customer_city',
      customer_country: 'DZ',
      customer_state: 'customer_state',
      customer_zip_code: '00225', //zipcode
    };
    const options = {
      method: 'POST',
      body: JSON.stringify(apiPayload),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    };
    
    return new Promise(async (resolve, reject) => {
      try {
        const fetch1 = await fetch(apiUrl, options);
        const result = await fetch1.json();
        if (result.code === '201') {
          //si le status est positif -> succès
          console.log('resolving with...', result);
          resolve(result);
        } else {
          console.log('rejecting with...', result);
          reject(result.description);
        }
      } catch (error) {
        console.log('getPaymentUrl.catch---------------', error);
        reject(error);

      }
    });
  }

  const makeOffer = async () => {

    if (amount == '' || amount == 0) {
      Toast.show({
        type:  i18n.t('Error'),
        text1: i18n.t("AmountNull"),
      });
      return;
    }

    const token = await AsyncStorage.getItem('token');
    const headers = {
      authorization: `${token}`
    }

    let data = {
      userId: user.id,
      churchId: churchId,
      projectId: id,
      amount: amount,
      type: "Project",
    }

    await axios.post(`${envVar['BACKEND_LINK']}/transaction/create_payment`, data, { headers })
      .then(function (response) {
        setNotification(true)
        Toast.show({
          type: 'success',
          text1: i18n.t("Action"),
          text2: i18n.t(response.data.message),
        });

      },
        { headers })
      .catch(function (error) {
        Toast.show({
          type: 'error',
          text1: i18n.t("Action Error"),
          text2: i18n.t(error.message),
        });
      });
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <CustomHeader title={i18n.t('Donate')} navigation={navigation} />
      <View style={{ position: 'relative' }}>
        <View style={{ position: 'absolute', top: 0, zIndex: 1000, width: '100%' }}>
          <SubHeader navigation={navigation} isWhite={true} />
        </View>
      </View>
      <ScrollView>
        {projectPhoto != '' ? (
          <Image source={{ uri: projectPhoto }} style={{ height: 290 }} />
        ) : (
          <Image source={require('../../../assets/images/slide/3.jpg')} style={{ height: 290 }} />
        )}
        <View style={{ paddingHorizontal: 55, paddingVertical: 30 }}>
          <Text style={{ fontSize: 14, fontWeight: '500', color: 'black', marginBottom: 30 }}>{description}</Text>
          <View>
            <Button style={{ height: 40, borderColor: "#FE7940", borderWidth: 1, borderRadius: 50, backgroundColor: 'white', marginBottom: 20 }} textColor="#FE7940" onPress={() => setAmount('2000')}>{i18n.t('2 000 F CFA')}</Button>
            <Button style={{ height: 40, borderColor: "#FE7940", borderWidth: 1, borderRadius: 50, backgroundColor: 'white', marginBottom: 20 }} textColor="#FE7940" onPress={() => setAmount('10000')}>{i18n.t('10 000 F CFA')}</Button>
            <Button style={{ height: 40, borderColor: "#FE7940", borderWidth: 1, borderRadius: 50, backgroundColor: 'white', marginBottom: 20 }} textColor="#FE7940" onPress={() => setAmount('50000')}>{i18n.t('50 000 F CFA')}</Button>
            <TextInput
              style={{ backgroundColor: 'white', marginBottom: 20, textAlign: 'center', borderRadius: 5, borderColor: '#FE7940', borderBottomWidth: 1 }}
              onChangeText={setAmount}
              keyboardType="numeric"
              label={i18n.t('Custom Amount')}
              mode="flat"
              value={amount}
            />
            <Button style={{ height: 40, borderColor: "#FE7940", borderWidth: 1, borderRadius: 50, backgroundColor: '#FE7940', marginBottom: 50 }} textColor="white" onPress={() => {
              getPaymentUrl().then((response) => {
                navigation.navigate('Cinetpay', {
                  url: response.data.payment_url,
                });
              });
            }}>{i18n.t('Donate')}</Button>
          </View>
        </View>
      </ScrollView>
      {isLoading && <Preloader />}
    </SafeAreaView>
  );
}

export default DonatePage;
