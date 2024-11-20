import { useRoute } from "@react-navigation/native";
import WebView from "react-native-webview";
import { Linking, View, TouchableOpacity, Text } from 'react-native';
import React, { Component } from 'react';
import CustomHeader, { SubHeader } from "../../components/CustomHeader";
import { AntDesign } from '@expo/vector-icons';
import { useUserContext } from "../../context/userContext";

var SendIntentAndroid = require("react-native-send-intent");

export default function PaymentScreen({ navigation }) {
  const { i18n } = useUserContext();
  const route = useRoute();
  const params = route.params;
  const { url } = params;
  let webview;
  return (
    <>
      <View style={{ position: 'relative' }}>
        <View style={{ position: 'absolute', top: 0, zIndex: 1000, width: '100%' }}>
          <View style={{ flexDirection: "row", height: 50, justifyContent: "space-between", alignItems: 'center', paddingHorizontal: 15 }}>
            <View style={{ flex: 1, justifyContent: "center" }}>
                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => navigation.goBack()}>
                  <AntDesign name="left" size={20} color="#474747" /><Text style={{ fontSize: 17, color: '#474747', fontWeight: '700', marginLeft: 10 }}>{i18n.t('Back')}</Text>
                </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
      <WebView
        originWhitelist={['*']}
        source={{
          uri: url,
        }}
        ref={(ref) => { webview = ref; }}
        // onNavigationStateChange={(webViewState)=>{
        //   console.log(webViewState.url)
        //   if(webViewState.url.includes("intent") || webViewState.url.includes("pay.wave.com")){
        //     //navigate or close webview
        //     console.log('---WavePay---');
        //     // webview.stopLoading();
        //     Linking.openURL(webViewState.url);
        //   }
        //   if(webViewState.url.includes("return_url")) {
        //     // payment is finished
        //     console.log('---Payment finished---');
        //   }}
        // }
        onShouldStartLoadWithRequest={(request) => {
          const { url } = request;
          console.log('-----------------', url);
          if (
            url.startsWith('wave://capture') || url.startsWith('intent://')
          ) {
            SendIntentAndroid.openChromeIntent(url);
            console.log('---request------------------');
            return false;
          }
          return true;
        }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
      />
    </>
  );
}
