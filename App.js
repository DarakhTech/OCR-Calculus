import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, ActivityIndicator,TouchableOpacity, View, Button, Image, Alert, Platform, TextInput } from 'react-native';
import React,{useState, useEffect} from 'react';
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'expo-camera';
import Navigator from './routes/homeStack'
// import {CustomKeyboard} from './demo/demoScreen';


export default function App() {
  
  const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  //Gallery Permission
  //Camera permission
  useEffect(() => {
    (async () => {
      const { cameraStatus } = await Camera.requestCameraPermissionsAsync();
      const { galleryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasCameraPermission(cameraStatus === 'granted');
      setHasGalleryPermission(galleryStatus === 'granted');
    })();
  }, []);

  return (
    <Navigator />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 30,
  },
  btnStyle:{
    backgroundColor:'red',
    height:48,
    borderRadius: 8,
    margin:16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textStyle:{
    color:'white',
    fontWeight:'bold',
    paddingHorizontal:40
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  text: {
    fontSize: 20,
    fontWeight: '500',
    marginTop: 20,
  }
});
