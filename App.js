import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import DrawerNavigator from "./src/navigators/DrawerNavigator";
import { PaperProvider } from 'react-native-paper';
import SplashPage from "./src/pages/SplashPage";
import Toast from 'react-native-toast-message';
import { UserProvider } from "./src/context/userContext";
import LoginScreen from "./src/pages/Auth/LoginPage";
import RegisgerScreen from "./src/pages/Auth/RegistrationPage";
import RegisgerAuthScreen from "./src/pages/Auth/RegistrationAuthPage";
import PhoneAuthScreen from "./src/pages/Auth/PhoneAuthPage";
import ForgotPasswordScreen from "./src/pages/Auth/RegistrationForgotPasswordPage";
import ResetPasswordScreen from "./src/pages/Auth/ResetPasswordPage";
import PaymentScreen from "./src/pages/Payment/PaymentScreen";
import PhoneAuthResetPasswordScreen from './src/pages/Auth/PhoneAuthResetPasswordPage'

const StackApp = createStackNavigator();


export default function App() {

  // const token = await AsyncStorage.getItem('token');
  
  return (
    <PaperProvider>
      <UserProvider>
        <NavigationContainer>
          <StackApp.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
            <StackApp.Screen name="Splash" component={SplashPage} />
            <StackApp.Screen name="HomeApp" component={DrawerNavigator} />
            <StackApp.Screen name="Login" component={LoginScreen} />
            <StackApp.Screen name="Register" component={RegisgerScreen} />
            <StackApp.Screen name="RegisterAuth" component={RegisgerAuthScreen} />
            <StackApp.Screen name="PhoneAuth" component={PhoneAuthScreen} />
            <StackApp.Screen name="PhoneAuthResetPassword" component={PhoneAuthResetPasswordScreen} />
            <StackApp.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
            <StackApp.Screen name="ResetPassword" component={ResetPasswordScreen} />
            <StackApp.Screen name="Cinetpay" component={PaymentScreen} />
          </StackApp.Navigator>
        </NavigationContainer>
      </UserProvider>
      <Toast />
    </PaperProvider>
  );
}