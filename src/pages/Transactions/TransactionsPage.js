import React from "react";
import { Text, View, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomHeader, { SubHeader } from "../../components/CustomHeader";
import { TransactionListItem } from "../../components/TransactionListItem";
import { useUserContext } from "../../context/userContext";
import axios from 'axios';
import Toast from "react-native-toast-message";
import Preloader from "../../components/Preloader";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LANGUAGE } from "../../constants/Images";
import {envVar} from '../../constants/env_vars';

function TransactionsPage({ navigation }) {
  const { user, isLoading, i18n, language } = useUserContext();
  const [transactionData, setTransactionData] = React.useState([]);

  const getTransaction = async () => {
    const token = await AsyncStorage.getItem('token');
    const headers = {
      authorization: `${token}`
    }
    await axios.get(`${envVar['BACKEND_LINK']}/transaction/get_all_transactions/${user.id}`, { headers })
      .then(function (response) {
        setTransactionData(response.data.transaction);
      })
      .catch(function (error) {
        Toast.show({
          type: 'error',
          text1: i18n.t("Failed"),
          text2: i18n.t(error.message),
        });
        console.log(error.message);
      });
  }

  React.useEffect(() => {
    const getData = navigation.addListener('focus', () => {
      getTransaction();
    });
    return getData;
  }, [navigation])

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <CustomHeader title={i18n.t('Transactions')} navigation={navigation} />
      <SubHeader navigation={navigation} />
      <ScrollView style={{ paddingHorizontal: 15 }}>
        {
          transactionData.map((item, index) => (
            <TouchableOpacity key={index} onPress={() => navigation.navigate("TransactionDetail", { id: item._id, churchName: item.churchId?.churchName, amount: item.amount, date: item.createdDate, type: item.type, projectName: item.projectId?.projectName, image:item.churchId?.photoUrl })}>
              <TransactionListItem churchName={item.churchId?.churchName} amount={item.amount} datetime={item.createdDate} image={item.churchId?.photoUrl}/>
            </TouchableOpacity>
          ))
        }
      </ScrollView>
      {isLoading && <Preloader />}
    </SafeAreaView>
  );
}

export default TransactionsPage;
