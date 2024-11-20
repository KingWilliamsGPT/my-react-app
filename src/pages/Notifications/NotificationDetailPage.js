import React from "react";
import { ScrollView, Text, TouchableOpacity, View, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomHeader from "../../components/CustomHeader";
import { useRoute } from "@react-navigation/native";
import Preloader from "../../components/Preloader";
import { useUserContext } from "../../context/userContext";
import { AntDesign } from '@expo/vector-icons';

function NotificationDetailPage({ navigation }) {
    const { isLoading, i18n } = useUserContext();

    const route = useRoute();
    const { title, description,} = route.params;


    return (
        <SafeAreaView style={{ flex: 1 }}>
            <CustomHeader title={i18n.t('Notification')} navigation={navigation} />
            <View style={{ position: 'relative' }}>
                <View style={{ flexDirection: "row", height: 50, justifyContent: "space-between", alignItems: 'center', paddingHorizontal: 15, position: 'absolute', zIndex: 10, width: "100%" }}>
                    <View style={{ flex: 1, justifyContent: "center" }}>
                        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => navigation.navigate('Notifications')}>
                            <AntDesign name="left" size={20} color="white" /><Text style={{ fontSize: 17, color: 'white', fontWeight: '700', marginLeft: 10 }}>{i18n.t('Back')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            <ScrollView>
                <Image source={require('../../../assets/images/slide/3.jpg')} style={{ height: 290 }} />
                <View style={{ paddingHorizontal: 55, paddingVertical: 30 }}>
                    <Text style={{ fontWeight: 'bold', color: '#A8A7A7', fontSize: 12 }}>{i18n.t('Title')}: </Text>
                    <Text style={{ fontSize: 16, fontWeight: '500', color: 'black', marginBottom: 20 }}>{title}</Text>
                    <Text style={{ fontWeight: 'bold', color: '#A8A7A7', fontSize: 12 }}>{i18n.t('Description')}: </Text>
                    <Text style={{ fontSize: 16, fontWeight: '500', color: 'black', marginBottom: 20 }}>{description}</Text>
                </View>
            </ScrollView>
            {isLoading && <Preloader />}
        </SafeAreaView>
    );
}

export default NotificationDetailPage;
