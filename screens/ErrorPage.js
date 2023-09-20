import React,{useState, useEffect} from 'react';
import { StyleSheet, Text, ActivityIndicator,TouchableOpacity, View, Button, Image, Alert, Platform, TextInput  } from "react-native";
import { StatusBar } from "expo-status-bar";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'


export default function Error({navigation}){
  const backButtonPressed = () => {
    navigation.replace('Home')
}
    return (
      
    <View style={styles.container}>
        <Text style={styles.textStyleTop}>404</Text>
        <Text style={styles.textStyle}>ERROR PLEASE TRY AGAIN</Text>
        <MaterialCommunityIcons name="close-circle" style={styles.btnStyle} onPress={backButtonPressed}></MaterialCommunityIcons>
       <StatusBar style="dark" />
    </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      marginTop: 50,
      flexDirection: 'column',
      alignItems:'center' ,
      justifyContent: 'center',
      // backgroundColor: '#000000',
      // margin: 30,
    },

    btnStyle:{
      color:'red',
      fontSize: 36, 
      borderRadius: 8,
      margin:16,
      alignItems: 'center',
      justifyContent: 'center',
      // backgroundColor:'red',
    },

    textStyleTop:{
      color:'black',
      fontWeight:'bold',
      paddingHorizontal:40,
      fontSize: 40
    },

    textStyle:{
      color:'black',
      fontWeight:'bold',
      paddingHorizontal:40,
      fontSize: 18
    },
  });