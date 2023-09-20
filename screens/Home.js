import React,{useState, useEffect} from 'react';
import { StyleSheet, ActivityIndicator,TouchableOpacity,Text, View, Button, Image, Alert, Platform, TextInput,Modal  } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import { StatusBar } from "expo-status-bar";
import { Camera } from 'expo-camera';
import axios from 'axios';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import * as Firebase from 'firebase';
import { firebaseConfig} from '../firebase';
import { NativeBaseProvider,HStack,VStack,Center,Pressable,Icon,Box, Switch,Heading,AlertDialog,Spinner,AspectRatio,Stack,Skeleton,IconButton,PresenceTransition} from "native-base";


export default function Home({navigation}){
  const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  
  const [textQuestion, setTextQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchOption, setSearchOption] = useState(false)
  const [selected, setSelected] = useState(1);
  const [switchVal,setSwitchValue] = useState(false)
  const [randNum,setRandNum] = useState([{num: Math.floor(Math.random() * 100) + 1, type:'Trivia'},{num: Math.floor(Math.random() * 100) + 1, type:'Date'},{num: Math.floor(Math.random() * 100) + 1, type:'Math'},{num: Math.floor(Math.random() * 100) + 1, type:'Trivia'},{num: Math.floor(Math.random() * 100) + 1, type:'Date'},{num: Math.floor(Math.random() * 100) + 1, type:'Math'},{num: Math.floor(Math.random() * 100) + 1, type:'Trivia'}])
  const [showModal, setshowModal] = useState(false)
  const [factDetail, setFactDetail] = useState([])
  
  //Firebase Instance
  if(Firebase.apps.length === 0){
    Firebase.initializeApp(firebaseConfig);
  }

  //Gallery Permission
  //Camera permission
  useEffect(() => {
    (async () => {
      const { cameraStatus } = await Camera.requestCameraPermissionsAsync();
      const { galleryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasCameraPermission(cameraStatus === "granted");
      setHasGalleryPermission(galleryStatus === "granted");
    })();
  }, []);

    const getApi = async() => {
    await axios
      .get('https://rknecmath.herokuapp.com/user')
      .then(function (response) {
        console.log(response.data);
      }).
      catch(function (error) {
        console.log(error);
      });
  }
  const IntegralSign = () => {setTextQuestion("∫ " + textQuestion + " dx from 1 to 4")};
  const PowerSign = () => {setTextQuestion(textQuestion + "^Y")};
  const CosSign = () => {setTextQuestion(textQuestion + "cos()")};
  const SinSign = () => {setTextQuestion(textQuestion + "sin()")};
  const TanSign = () => {setTextQuestion(textQuestion + "tan()")};
  const LogSign = () => {setTextQuestion(textQuestion + "log()")};
  const ClearSign = () => {setTextQuestion("")};
  const postApi = async(imgData) => {
    // uploadUri = imgData.uri uploadImage?img=
    apiUrl = "https://rknecmath.herokuapp.com/user?user=" + imgData
    await axios
      .post(apiUrl)
      .then(function (response) {
        console.log(response);
        if(response.status === 201){
          console.log(response);
        }
      }).
      catch(function (error) {
        console.log(error);
      });
  }

  const getFact = async(fNum,fType) => {

    apiUrl = "http://numbersapi.com/" + fNum + "/" + fType.toLowerCase()
    // console.log(apiUrl)
    await axios
      .get(apiUrl)
      .then(function (response) {
        if(response.status === 200){
          setFactDetail([fNum,fType,response.data])
          // console.log(response.data);
          setLoading(false)
        }
      }).
      catch(function (error) {
        console.log(error);
      });
  }

  const onTextSearch = async () => {
    navigation.navigate('AnswerPage', {question: textQuestion})
  }

  const pressHandler = () => {
        navigation.navigate('CamInterface', {cameraPerms: hasCameraPermission, galleryPerms: hasGalleryPermission})
        // navigation.push('CamInterface')
  }
    return (
    <NativeBaseProvider>
    <View style={styles.container}>
          <Modal 
            animationType= {'slide'}
            transparent={false}
            visible={showModal}
            onRequestClose={()=>{
              // console.log("Modal Closed")
              setshowModal(!showModal); 
            }}
          >
          <View style={styles.modal}>
          { 
            !loading ?
              <>
              <Box alignItems="center" justifyContent='center' flex={1} >
                <Box 
                  rounded="lg" 
                  overflow="hidden" 
                  borderColor="coolGray.200" 
                  borderWidth="1" 
                  _dark={{
                    borderColor: "coolGray.600",
                    backgroundColor: "gray.700"
                  }} 
                  _web={{
                    shadow: 2,
                    borderWidth: 0
                  }} 
                  _light={{
                    backgroundColor: "gray.50"
                  }}
                >
                  {/* <View flex={1}> */}
                            <Box>
                    <AspectRatio w="100%" ratio={16 / 9}>
                      <Image source={{
                      uri: "https://firebasestorage.googleapis.com/v0/b/backend-api-latex.appspot.com/o/math-wallpaper-preview.jpg?alt=media&token=a2986e88-1002-4678-976d-7b21ba9df37d"
                    }} alt="image" />
                    </AspectRatio>
                    <Center bg="violet.500" _dark={{
                    bg: "violet.400"
                  }} _text={{
                    color: "warmGray.50",
                    fontWeight: "700",
                    fontSize: "xs"
                  }} position="absolute" bottom="0" px="3" py="1.5">
                      {factDetail[1]}
                      {/* TYPE */}
                    </Center>
                  </Box>
                  <Stack p="4" space={3}>
                    <Stack space={2}>
                      <Heading size="lg" ml="-1">
                        {factDetail[1]} about the number {factDetail[0]}
                        {/* TYPE "About the number" NUM */}
                      </Heading>
                    </Stack>

                    <Heading fontWeight="400" fontSize="md">
                      {factDetail[2]}
                    </Heading>
                    <Center>
                      <VStack space={4} alignItems="center">
                        {["solid"].map(variant => <IconButton colorScheme="indigo" onPress={()=>{setshowModal(!showModal);}} key={variant} variant={variant} _icon={{
                        as: MaterialCommunityIcons,
                        name: "keyboard-backspace"
                      }} />)}
                      </VStack>
                    </Center>
                  </Stack>
                  
                </Box>
              </Box>
              </>
          :
              <VStack space={2} justifyContent="center" alignItems='center' flex={1}>
               <Spinner accessibilityLabel="Loading posts" color="indigo.500" />
               <Heading color="indigo.500" fontSize="xl">
                 Loading
               </Heading>
              </VStack>
          }
            
          </View>
          </Modal>
      <View style = {styles.searchBar}>
        <TextInput style={styles.input} placeholder="Enter Question" onChangeText={(text) => setTextQuestion(text)} onFocus={() => setSearchOption(true)} onBlur={() => setSearchOption(false) } value={textQuestion} />
          
        {searchOption
          ?
          <MaterialCommunityIcons name="clipboard-search" style={styles.rightButton} onPress={onTextSearch}></MaterialCommunityIcons>
          :
          <MaterialCommunityIcons name="camera" style={styles.rightButton} onPress={pressHandler}></MaterialCommunityIcons>
        }
        <StatusBar style="dark" />
      </View>
        <VStack space={4} alignItems="center">
          <Center alignSelf='center' w="80" h="10">
            {!searchOption
            ?
            <></>
            :
              !loading 
              ?
              <PresenceTransition visible={searchOption} initial={{
              opacity: 0,
              scale: 0
              }} animate={{
                opacity: 1,
                scale: 1,
                transition: {
                  duration: 250
                }
              }}>
                <VStack>
                  <HStack>
                    <MaterialCommunityIcons name="math-integral-box" style={styles.rightButtonMathInp} onPress={IntegralSign}></MaterialCommunityIcons>
                    <MaterialCommunityIcons name="math-cos" style={styles.rightButtonMathInp} onPress={CosSign}></MaterialCommunityIcons>
                    <MaterialCommunityIcons name="math-sin" style={styles.rightButtonMathInp} onPress={SinSign}></MaterialCommunityIcons>
                    <MaterialCommunityIcons name="math-tan" style={styles.rightButtonMathInp} onPress={TanSign}></MaterialCommunityIcons>
                    <MaterialCommunityIcons name="math-log" style={styles.rightButtonMathInp} onPress={LogSign}></MaterialCommunityIcons>
                    <MaterialCommunityIcons name="exponent-box" style={styles.rightButtonMathInp} onPress={PowerSign}></MaterialCommunityIcons>
                  </HStack>
                  <Center>
                  <HStack style={{marginTop:10}}>
                    <MaterialCommunityIcons name="camera" style={styles.rightButtonMathInp} onPress={pressHandler}></MaterialCommunityIcons>
                    <MaterialCommunityIcons name="format-clear" style={styles.rightButtonMathInp} onPress={ClearSign}></MaterialCommunityIcons>
                    {/* <MaterialCommunityIcons name="math-sin" style={styles.rightButtonMathInp} onPress={SinSign}></MaterialCommunityIcons>
                    <MaterialCommunityIcons name="math-tan" style={styles.rightButtonMathInp} onPress={TanSign}></MaterialCommunityIcons>
                    <MaterialCommunityIcons name="math-log" style={styles.rightButtonMathInp} onPress={LogSign}></MaterialCommunityIcons>
                    <MaterialCommunityIcons name="camera" style={styles.rightButtonMathInp} onPress={pressHandler}></MaterialCommunityIcons> */}
                  </HStack>
                  </Center>
                </VStack>
              </PresenceTransition>
              :
              <PresenceTransition visible={searchOption} initial={{
              opacity: 0,
              scale: 0
              }} animate={{
                opacity: 1,
                scale: 1,
                transition: {
                  duration: 250
                }
              }}>
                
                <VStack space={2} justifyContent="center" alignItems='center' flex={1}>
                <Spinner accessibilityLabel="Loading posts" color="indigo.500" />
                <Heading color="indigo.500" fontSize="xl">
                  Loading
                </Heading>
                </VStack>
                
              </PresenceTransition>
                
            }
            {!searchOption ?
              <HStack>
                <Heading color={switchVal?"indigo.300":"indigo.700"} fontSize="md" alignSelf='center' > Facts </Heading>
                {/* <Switch offTrackColor="indigo.200" onTrackColor="indigo.500" offThumbColor="indigo.500" onThumbColor="primary.100" size="sm"  onChange={()=>{setSwitchValue(!switchVal)}} value={switchVal}/>
                <Heading color={switchVal?"indigo.700":"indigo.300"} fontSize="md" alignSelf='center'  > History </Heading> */}
              </HStack>
              :<></>
            }
          </Center>
          { !searchOption ?
            !switchVal
            ?
            (<>
              <Pressable onPress={()=>{getFact(randNum[0].num,randNum[0].type);setshowModal(!showModal);setLoading(true)}} rounded="8" overflow="hidden" borderWidth="0" borderColor="coolGray.300" maxW="96" shadow="3" bg="coolGray.100" p="1">
              <Center w="80" h="20" bg="indigo.50" rounded="md" shadow={3} >
                <Icon mb="1" as={<MaterialCommunityIcons name="check-bold" />} color="blue" size="md" />
                <Text color="white" fontSize="12" style={{alignSelf:'center'}} >
                  {randNum[0].type} for {randNum[0].num}
                </Text>
              </Center>
              </Pressable>

              <Pressable onPress={()=>{getFact(randNum[1].num,randNum[1].type);setshowModal(!showModal);setLoading(true)}} rounded="8" overflow="hidden" borderWidth="0" borderColor="coolGray.300" maxW="96" shadow="3" bg="coolGray.100" p="1">
              <Center w="80" h="20" bg="indigo.100" rounded="md" shadow={3}>
                <Icon mb="1" as={<MaterialCommunityIcons name="check-bold" />} color="blue" size="md"  />
                <Text color="white" fontSize="12" style={{alignSelf:'center'}}>
                  {randNum[1].type} for {randNum[1].num}
                </Text>
              </Center>
              </Pressable>

              <Pressable onPress={()=>{getFact(randNum[2].num,randNum[2].type);setshowModal(!showModal);setLoading(true)}} rounded="8" overflow="hidden" borderWidth="0" borderColor="coolGray.300" maxW="96" shadow="3" bg="coolGray.100" p="1">
              <Center w="80" h="20" bg="indigo.200" rounded="md" shadow={3}>
                <Icon mb="1" as={<MaterialCommunityIcons name="check-bold" />} color="blue" size="md"  />
                <Text color="white" fontSize="12" style={{alignSelf:'center'}}>
                  {randNum[2].type} for {randNum[2].num}
                </Text>
              </Center>
              </Pressable>

              <Pressable onPress={()=>{getFact(randNum[3].num,randNum[3].type);setshowModal(!showModal);setLoading(true)}} rounded="8" overflow="hidden" borderWidth="0" borderColor="coolGray.300" maxW="96" shadow="3" bg="coolGray.100" p="1">
              <Center w="80" h="20" bg="indigo.300" rounded="md" shadow={3}>
                <Icon mb="1" as={<MaterialCommunityIcons name="check-bold" />} color="blue" size="md"  />
                <Text color="white" fontSize="12" style={{alignSelf:'center'}}>
                  {randNum[3].type} for {randNum[3].num}
                </Text>
              </Center>
              </Pressable>

              <Pressable onPress={()=>{getFact(randNum[4].num,randNum[4].type);setshowModal(!showModal);setLoading(true)}} rounded="8" overflow="hidden" borderWidth="0" borderColor="coolGray.300" maxW="96" shadow="3" bg="coolGray.100" p="1">
              <Center w="80" h="20" bg="indigo.400" rounded="md" shadow={3}>
                <Icon mb="1" as={<MaterialCommunityIcons name="check-bold" />} color="blue" size="md"  />
                <Text color="white" fontSize="12" style={{alignSelf:'center'}}>
                  {randNum[4].type} for {randNum[4].num}
                </Text>
              </Center>
              </Pressable>

              <Pressable onPress={()=>{getFact(randNum[5].num,randNum[5].type);setshowModal(!showModal);setLoading(true)}} rounded="8" overflow="hidden" borderWidth="0" borderColor="coolGray.300" maxW="96" shadow="3" bg="coolGray.100" p="1">
              <Center w="80" h="20" bg="indigo.500" rounded="md" shadow={3}>
                <Icon mb="1" as={<MaterialCommunityIcons name="check-bold" />} color="blue" size="md"  />
                <Text color="white" fontSize="12" style={{alignSelf:'center'}}>
                  {randNum[5].type} for {randNum[5].num}
                </Text>
              </Center>
              </Pressable>

            </>
            )
            :
            (<>
                <Center w="80" h="20" bg="indigo.200" rounded="md" shadow={3} >
                <Icon mb="1" as={<MaterialCommunityIcons name="check-bold" />} color="blue" size="md"  />
                <Text color="white" fontSize="12" style={{alignSelf:'center'}}>
                  History
                </Text>
                </Center>
                <Center w="80" h="20" bg="indigo.200" rounded="md" shadow={3} />
                <Center w="80" h="20" bg="indigo.200" rounded="md" shadow={3} />
                <Center w="80" h="20" bg="indigo.200" rounded="md" shadow={3} />
                <Center w="80" h="20" bg="indigo.200" rounded="md" shadow={3} />
                <Center w="80" h="20" bg="indigo.200" rounded="md" shadow={3} />
                <Center w="80" h="20" bg="indigo.200" rounded="md" shadow={3} />
            </>)
            :
            <></>

          }
          
        </VStack> 
    </View>
    </NativeBaseProvider>
    )
}

const styles = StyleSheet.create({
    container: {
      // flex: 1,
      marginTop: 50,
      alignItems:'center' ,
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
      width: '80%',
      margin: 5,
      // borderWidth: 0.5,
      // padding: 10,
      backgroundColor: '#ffffff',
      paddingLeft: 15,
      paddingRight: 15,
      borderRadius:10,
      shadowColor: "#312e81",
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.27,
      shadowRadius: 4.65,

      elevation: 6,
    },
    text: {
      fontSize: 20,
      fontWeight: '500',
      marginTop: 20,
    },
    searchBar:{
      flexDirection: 'row',
      alignItems:'center',
      marginBottom:35,
      borderRadius:10,
     
    },
    rightButton: { 
      justifyContent: 'flex-end',
      color: '#818cf8', 
      fontSize: 30,
      shadowColor: "#312e81",
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.27,
      shadowRadius: 4.65,

      elevation: 6, 
    },
    rightButtonMathInp: { 
      justifyContent: 'flex-end',
      color: '#818cf8', 
      fontSize: 30,
      shadowColor: "#312e81",
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.27,
      shadowRadius: 4.65,

      elevation: 6,
      marginHorizontal: 10 
    },
    modal:{
      flex:1,
      alignItems:'center',
      backgroundColor: '#a5b4fc',
      padding: 100,
    },
  });

// indigo.50  #eef2ff
// indigo.100 #e0e7ff
// indigo.200 #c7d2fe
// indigo.300 #a5b4fc
// indigo.400 #818cf8
// indigo.500 #6366f1
// indigo.600 #4f46e5
// indigo.700 #4338ca
// indigo.800 #3730a3
// indigo.900 #312e81