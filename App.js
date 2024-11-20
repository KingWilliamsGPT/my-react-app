import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';


function App(){
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.box}>
        <Text style={styles.title}>Welcome to React Native</Text>
        <Text style={styles.subtitle}>This is your boilerplate App.js!</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa', // Light gray background
    justifyContent: 'center',
    alignItems: 'center',
  },
  box: {
    padding: 20,
    backgroundColor: '#007bff', // Blue background
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#f8f9fa',
  },
});

export default App;
