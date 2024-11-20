import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomHeader, { SubHeader } from "../../components/CustomHeader";
import { Card } from 'react-native-paper';
import { Fontisto } from '@expo/vector-icons';
import { ScrollViewCard } from "../../components/Cards";
import { useRoute } from "@react-navigation/native";
import axios from 'axios';
import Toast from "react-native-toast-message";
import Preloader from "../../components/Preloader";
import { useUserContext } from "../../context/userContext";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { envVar } from "../../constants/env_vars";

function ProjectListPage({ navigation }) {
  const { i18n, isLoading } = useUserContext();

  const [churchData, setChurchData] = useState(null);
  const [projectData, setProjectData] = useState(null);

  const route = useRoute();
  const churchId = route.params;

  const getChurch = async () => {
    const token = await AsyncStorage.getItem('token');
    const headers = {
      authorization: `${token}`
    }
    await axios.get(`${envVar['BACKEND_LINK']}/church/get_church_detail/${churchId}`, { headers })
      .then(function (response) {
        setChurchData(response.data.church);
        setProjectData(response.data.projects);
      })
      .catch(function (error) {
        Toast.show({
          type: 'error',
          text1: i18n.t("Failed"),
          text2: i18n.t(error.message),
        });
      });
  }

  React.useEffect(() => {
    getChurch();
  }, []);


  return (
    <SafeAreaView style={{ flex: 1 }}>
      <CustomHeader title={i18n.t('Projects')} navigation={navigation} />
      <Card style={{ backgroundColor: 'white', position: 'relative' }}>
        <View style={{ position: 'absolute', top: 0, zIndex: 100, width: '100%' }}>
          <SubHeader navigation={navigation} isWhite={true} />
        </View>
        <Card.Cover source={{ uri: churchData?.photoUrl }} style={{ borderRadius: 0, height: 290 }} />
        <Card.Content style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: 10 }}>
          <View style={{ width: "60%" }}>
            <Text style={{ fontSize: 14, fontWeight: '800', color: 'black', marginBottom: 10 }}>{churchData?.churchName}</Text>
            <Text style={{ fontSize: 13, color: 'black' }}><Fontisto name="map-marker-alt" size={14} color="#FF4A0E" style={{ marginRight: 8 }} />{churchData?.churchAddress}</Text>
          </View>

        </Card.Content>
      </Card>
      <View style={{ paddingHorizontal: 20 }}>
        <View style={{ width: "100%", height: 3, backgroundColor: '#DBDBDB', marginVertical: 30 }}></View>
        <Text style={{ fontSize: 16, fontWeight: '600', color: 'black', marginBottom: 30 }}>{i18n.t('Projects')}</Text>
        {projectData?.length < 1 ? (
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <Image source={require('../../../assets/images/banner/error.png')} style={{ width: 110, height: 120, marginBottom: 20 }} />
            <Text style={{ textAlign: 'center', fontSize: 16 }}>{i18n.t("NoProjects")}</Text>
          </View>
        ) : (
          <ScrollView horizontal={true}>
            {projectData?.map((item, index) => (
              <TouchableOpacity key={index} onPress={() => navigation.navigate("Donate", { id: item._id, projectName: item.projectName, projectPhoto: item.projectPhoto, description: item.projectDescription, churchId: churchData._id })}>
                <ScrollViewCard title={item.projectName} imagePath={item.projectPhoto} />
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>
      {isLoading && <Preloader />}
    </SafeAreaView>
  );
}

export default ProjectListPage;
