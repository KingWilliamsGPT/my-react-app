import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import HomePage from "../pages/Home/HomePage";
import ChurchPage from "../pages/Churches/ChurchesPage";
import ProjectListPage from "../pages/Churches/ProjectListPage";
import DonatePage from "../pages/Churches/DonatePage";

const StackHome = createStackNavigator();

function HomeStackNavigator() {
  return (
    <StackHome.Navigator initialRouteName="HomePage" screenOptions={{ headerShown: false }}>
      <StackHome.Screen name="HomePage" component={HomePage} />
      <StackHome.Screen name="Church" component={ChurchPage} />
      <StackHome.Screen name="Project" component={ProjectListPage} />
      <StackHome.Screen name="Donate" component={DonatePage} />
    </StackHome.Navigator>
  );
}

export default HomeStackNavigator;
