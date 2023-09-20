import React, {useState, useEffect, useRef} from "react";
import { StyleSheet, ActivityIndicator,View, Text, Icon, Container, Content, Header, Item, Input, Button, Alert , SafeAreaView, ScrollView , Modal, Dimensions, Platform} from "react-native";
import { AutoFocus, Camera } from "expo-camera";
import { StatusBar } from "expo-status-bar";
import { shareAsync } from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';
import * as Firebase from 'firebase';
import { firebaseConfig} from '../firebase';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import * as ImagePicker from 'expo-image-picker'
import axios from 'axios';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';   
import { NativeBaseProvider,HStack,VStack,Center,Pressable,Box, Switch,Heading,AlertDialog,Spinner,AspectRatio,Stack,Skeleton,IconButton, Image, useToast} from "native-base";

// GLOBAL Dimensions
var h = Dimensions.get('window').height
var w = Dimensions.get('window').width
const overlayColor = '#000000'
require('dotenv').config();
export default function CamInterface({navigation}){
    let cameraRef = useRef(null);
    const [output, setOutput] = useState();
    const [camera, setCamera] = useState(null);
    const [hasCameraPermission, setHasCameraPermission] = useState();
    const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState();
    const [loading, setLoading] = useState(false)
    const [showModal, setshowModal] = useState(false)
    const [URL, setURL] = useState(null)
    const [outString, setOutString] = useState("We are almost near the solution")
    const [questionString, setQuestionString] = useState("")
    const [confidenceRate, setConfidenceRate] = useState(0)
    const toast = useToast();

    const backButtonPressed = () => {
        navigation.goBack()
    }
    
    if(Firebase.apps.length === 0){
        Firebase.initializeApp(firebaseConfig);
      }

    useEffect(() => {
        (async () => {
          const cameraPermission = await Camera.requestCameraPermissionsAsync();
          const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync();
          setHasCameraPermission(cameraPermission.status === "granted");
          setHasMediaLibraryPermission(mediaLibraryPermission.status === "granted");
        })();
      }, [])

    const requestPermissionFunction = async() => {
      cameraPermission = await Camera.requestCameraPermissionsAsync();
      mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync();
      setHasCameraPermission(cameraPermission.status === "granted");
      setHasMediaLibraryPermission(mediaLibraryPermi0ssion.status === "granted");
      // PERMISSION WALA CHEEZE Sort Karna
    }
    if (hasCameraPermission === undefined) {
      return <Text style={{alignItems:'center'}} Requesting permissions />
    } else if (!hasCameraPermission) {
      return (
        <View style = {styles.container} >
          <Text>Permission for camera not granted. Please change this in settings.</Text>
          <MaterialCommunityIcons name="access-point-plus" style={styles.permButton} onPress={requestPermissionFunction}></MaterialCommunityIcons>
        </View>
      )
    }

    

    let captureImage = async (format = SaveFormat.JPEG)=>{
        let options = {
            quality: 1,
            base64: true,
            exif: false,
            aspect: [16, 9],
            fixOrientation: true,
        };

        if(camera){
            const data = await camera.takePictureAsync(options)
            const result2 = await manipulateAsync(
              data.uri,
              [
                {crop:{
                  originX:0.225*w,
                  originY:h*1.055,
                  height:900,
                  width:Platform.OS === 'ios'? 1800 :  1800,
                }
              }],{ compress: 1, format: SaveFormat.JPEG });
            setOutput(result2.uri);
            setshowModal(true)
            console.log(h*1.055)
        }
    }

    const onGallery = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 1,
      });
  
      console.log(result.cancelled);
  
      if (!result.cancelled) {
        setOutput(result.uri);
        setshowModal(true)
      }
    }

    let buttonPress = async ()=>{
      Alert.alert("Pressed Button")
    }

    const compressImage = async (uri, format = SaveFormat.JPEG) => { // SaveFormat.PNG
      const result1 = await manipulateAsync(
          uri,
          [{ resize: { width: 1200 } }],
          { compress: 0, format }
      );
      imageUpload(uri)
      // imageUpload(result1.uri)
      return  { name: `${Date.now()}.${format}`, type: `image/${format}`, ...result1 };
      // return: { name, type, width, height, uri }
  };
    const imageUpload = async (url) => {
        const blob = await new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.onload = function() {
            resolve(xhr.response);
          };
          xhr.onerror = function() {
            reject(new TypeError('Network request failed'));
          };
          xhr.responseType = 'blob';
          xhr.open('GET', url, true);
          xhr.send(null);
        });
        
        const ref = Firebase.storage().ref().child(new Date().toISOString());
        const snapshot = ref.put(blob);
    
        snapshot.on(Firebase.storage.TaskEvent.STATE_CHANGED,() => {
          setLoading(true);
        },
        (error) => {
          setLoading(false);
          console.log(error);
          blob.close();
          return
        },
        () => {
          snapshot.snapshot.ref.getDownloadURL().then((downloadURL) => {
            console.log('File available at', downloadURL);
            blob.close();
            setURL(downloadURL)
            pressHandler(downloadURL)
            setLoading(false)
            return downloadURL;
          });
        }
        
        )
    }

    const headers = {
      'content-type':process.env.cType,
      'app_key':process.env.aKey,
      'app_id':process.env.aId
    }  
    const pressHandler = async(downloadURI) => {
      axios({
            method: 'post',
            url: process.env.awsLink,
            headers: headers,
            data: JSON.stringify({
                "src": downloadURI,
                "formats": ["text", "data"],
                "data_options": {
                  "include_asciimath": true
                }
              }),
            
          })
            .then(function (response) {
                if(response.status == 200){
                  setOutString("Solution is ready")
                  setQuestionString(response.data.data[0].value)
                  setConfidenceRate(response.data.confidence_rate)
                  // console.log("Value : ",)
                  // console.log("Confidence_rate: ",)

                }else{
                 setOutString("Python Server OCR Error: Go Back") 
                }
                
            }).
            catch(function (error) {
                console.log(error);
            });
      }  
    const onTextSearch = async () => {
      setshowModal(!showModal); 
      navigation.navigate('AnswerPage', {question: questionString, rate:confidenceRate})
    }
    return (
      <NativeBaseProvider>
      <SafeAreaView>
        <View style = {styles.container}>
          <Modal 
            animationType= {'slide'}
            transparent={false}
            visible={showModal}
            onRequestClose={()=>{
              console.log("Modal Closed")
              setshowModal(!showModal); 
              // setOutput(); ?////////////////////////////////////////////////////////////////////// ISKO UNCOM KAR DENA BAADME
            }}
          >
            <View style={styles.modal}>
            <NativeBaseProvider>
            <Center>
            <View style={{marginTop:250}}></View>
              <Center>
              {/* <Image source={{ uri: output }} style={{width: '100%',height: undefined,aspectRatio: 1.7778}} /> */}
              <AspectRatio w="100%" ratio={16 / 9}>
                <Image source={{uri: output}} alt="image" borderRadius={10}/>
              </AspectRatio>
              </Center>
            
              { 
                !loading
              ?
                URL === null 
                ?
                <>
                  <Center>
                  <View style={styles.btnHolderModal}>
                      <MaterialCommunityIcons name="upload-off" style={styles.cancelBtn} onPress={() => { setshowModal(!showModal); setOutput(); } }></MaterialCommunityIcons>
                      <MaterialCommunityIcons name="upload" style={styles.sendBtn} onPress={() => { compressImage(output); } }></MaterialCommunityIcons>
                  </View>
                  </Center>
                </>
                :
                <>
                  <Center>
                  <Text style={styles.solutionText} onPress={onTextSearch}>{outString}</Text>
                  <MaterialCommunityIcons name="arrow-down-thin" style={styles.solutionBtn} onPress={() => {(questionString == "")?backButtonPressed:onTextSearch} }></MaterialCommunityIcons>
                  </Center>    
                </>
              : 
              (
                <Center>
                <HStack space={2} justifyContent="center" marginTop={25}>
                  <Spinner accessibilityLabel="Loading posts" />
                  <Heading color="indigo.500" fontSize="md">
                    Loading
                  </Heading>
                 </HStack>
                 </Center>
              )
              }
              </Center>
              </NativeBaseProvider>
            </View>
          </Modal>

          <Camera ratio = "16:9" style = {styles.cameraArea} ref = {ref =>setCamera(ref)}>
            
            {/* COLUMN CREATED, JEE WALI DIARY ME HAI CHEEZE */}
            <View style={styles.screenContainer}>

                {/* LEFT SPACE */}
                <View style={styles.leftSpace} />

                {/* CENTER WORKING SPACE */}
                <View style={styles.centerSpace}>

                  <View style={styles.centerTopSpace}>
                    <View style={styles.thingsAtBottom}>
                      <Text style={styles.captureMathProbText}>Capture your math problem</Text>
                    </View>
                  </View>

                  <View style={styles.centerWorkSpace}>
                    
                    {/* <MaterialCommunityIcons name="scan-helper" size = {204} style={styles.scannerArea} ></MaterialCommunityIcons> */}
                  </View>

                  <View style={styles.centerBottomSpace}>
                  
                    
                    <View style={styles.iconsView}>
                      <View style= {styles.iconHolder}>
                        <MaterialCommunityIcons name="keyboard-backspace" style={styles.leftButton} onPress={backButtonPressed}></MaterialCommunityIcons>
                
                        <MaterialCommunityIcons name="circle-outline" style={styles.centerButton} onPress={captureImage}></MaterialCommunityIcons>
                
                        <MaterialCommunityIcons name="flip-to-front" style={styles.rightButton} onPress={onGallery}></MaterialCommunityIcons>
                      </View>
                    </View>

                   {/* ICON VIEW */}
                  
                  </View>

                </View>

              {/* RIGHT SPACE */}
                <View style={styles.rightSpace}/>
            </View>

            

           
            

          </Camera>
          
        <StatusBar style="auto" />
        </View>
      </SafeAreaView>  
      </NativeBaseProvider>
    )

}

// IOS WORKING ASPECT 
// container:{
//   position: "absolute",
//   height: Dimensions.get('window').height,
//   width: Dimensions.get('window').width,
//   alignItems: "center",
//   justifyContent: "space-around"
// },
// cameraArea: {
//     alignItems: 'center',
//     justifyContent: 'flex-end',
//     height: Platform.OS === 'ios'? Dimensions.get('window').height :  Math.round((Dimensions.get('window').width * 16) / 9),
//     width: "100%",
// },

const styles = StyleSheet.create({
    container:{
      // flex:1,
      // backgroundColor: 'black' 
      position: "absolute",
      height: Dimensions.get('window').height,
      width: Dimensions.get('window').width,
      alignItems: "center",
      justifyContent: "space-around"
    },
    cameraArea: {
      flex: 1, 
      justifyContent: 'space-between',
        // alignItems: 'center',
        // justifyContent: 'flex-end',
        // height: Platform.OS === 'ios'? Dimensions.get('window').height :  Math.round((Dimensions.get('window').width * 16) / 9),
        // width: "100%",
        // // width: '100%',
        height: '100%',
    },
    buttonContainer: {
        backgroundColor: 'black',
        width: '100%',
        height: 100,
        // backgroundColor: '#EE5407',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute', //Here is the trick
        bottom: 0, //Here is the trick
    },
    preview:{
        alignSelf: 'stretch',
        flex: 1
    },

    iconsView: {
      // justifyContent: 'flex-end',
      // alignContent:'center', 
      // paddingHorizontal: 10, 
      marginBottom: 35, 
      // alignItems: 'flex-end',
      // flexBasis: 'auto'
    },
    iconHolder:{
      alignItems:'center',
      flexDirection: 'row',
      
    },
    permButton: { 
      color: 'red', 
      fontSize: 100,
      marginHorizontal: '10%'
      // borderEndWidth: 25,
      // borderStartWidth: 25
    },
    leftButton: { 
      color: '#6366f1', 
      fontSize: 36, 
    },
    centerButton: { 
      color: '#c7d2fe', 
      fontSize: 100,
      marginHorizontal:20,
      marginBottom:10,
      // marginHorizontal: '10%'
      // borderEndWidth: 25,
      // borderStartWidth: 25
    },
    rightButton: { 
      color: '#6366f1', 
      fontSize: 36 
    
    },
    modal:{
      flex:1,
      alignItems:'center',
      justifyContent:'center',
      backgroundColor: '#a5b4fc',
      padding: 50,
    },
    btnHolderModal:{
      // marginTop: 25,
      alignItems:'center',
      flexDirection: 'row'
    },
    cancelBtn: { 
      color: '#e0e7ff', 
      fontSize: 36, 
      margin:20,
      
    },
    sendBtn: { 
      color: '#4f46e5', 
      fontSize: 36, 
      // margin:20,
    },
    solutionBtn: { 
      color: '#4f46e5', 
      fontSize: 36, 
    },
    solutionText: {
      marginTop: 25,
      fontSize: 20,
      color: '#4f46e5',
      fontWeight: 'bold'
    },

    // OVERLAY
    screenContainer:{
      backgroundColor: 'transparent',
      opacity: 1,
      width: w,
      height: h,
      opacity:0.5,
      flexDirection:'row'
    },
    leftSpace:{
      backgroundColor: overlayColor,
      opacity: 1,
      alignSelf:'flex-start',
      width: (w*0.075),
      height: h,
      
    },
    centerSpace:{
      backgroundColor: "transparent",
      opacity: 1,
      alignSelf:'flex-start',
      width: (w*0.85),
      height: h,
      flexDirection:'column',
    },
    centerTopSpace:{
      backgroundColor: overlayColor,
      opacity: 1,
      alignSelf:'flex-start',
      width: w*0.85,
      height: h*0.175,
    },
    centerWorkSpace:{
      backgroundColor: "transparent",
      opacity: 1,
      alignSelf:'flex-start',
      width: w*0.85,
      height: h*0.225,
      borderColor:'#818cf8',
      borderWidth:5,
      borderRadius:10,
    },
    centerBottomSpace:{
      backgroundColor: overlayColor,
      opacity: 1,
      justifyContent: 'center',
      alignItems: 'flex-end',
      flexDirection:'row',
      width: w*0.85,
      height: h*0.6,
      
    },
    rightSpace:{
      backgroundColor: overlayColor,
      opacity: 1,
      alignSelf:'flex-start',
      width: (w*0.075),
      height: h
    },
    thingsAtBottom:{
      flex: 1,
      justifyContent: 'flex-end',
      marginBottom:5
    },
    captureMathProbText:{
      alignSelf:'center',
      color: 'white',
      fontWeight: 'bold'
    },
    scannerArea:{
      color: 'white', 
      fontSize: 36, 
    }

    
})