import React, {useState, useEffect} from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StyleSheet, ActivityIndicator,TouchableOpacity,Text, View, Button, Image, Alert, Platform, TextInput  } from "react-native";
import { NativeBaseProvider,HStack,VStack,Center,Pressable,Icon,Box, Switch,Heading,AlertDialog,Spinner,AspectRatio,Stack,Skeleton,IconButton} from "native-base";
import axios from 'axios';
import { StatusBar } from "expo-status-bar";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import _map from 'lodash/map'

export default function testing({navigation}) {
  const [loading, setLoading] = useState(false)
 
  const backButtonPressed = () => {
    navigation.navigate('Home')
    
}

 

    return (
        <SafeAreaView style = {styles.container} >
        <NativeBaseProvider >
          {!loading
          ?
          <VStack>
              <Center>
                <AspectRatio w={"100%"} ratio={8/ 11}>
                  <Image resizeMode="contain" source={{uri: 'https://firebasestorage.googleapis.com/v0/b/backend-api-latex.appspot.com/o/splash-with-name.png?alt=media&token=75697e88-e631-46b6-95c2-eb1470aa6dee'}} style={{flex:1, height: undefined, width: undefined}} alt="Query" />
                </AspectRatio>
                </Center>
                <Center>
                <TouchableOpacity onPress={backButtonPressed}> 
                  <AspectRatio w={"75%"} ratio={1/ 1}>
                    <Image resizeMode="contain" source={{uri: 'https://firebasestorage.googleapis.com/v0/b/backend-api-latex.appspot.com/o/button.png?alt=media&token=da56c377-5257-4310-97d8-ac9e4b4e829b'}} style={{flex:1, height: undefined, width: undefined}} alt="Query" />
                  </AspectRatio>
                </TouchableOpacity>
              </Center>
          </VStack>    
          
          :
            <VStack space={2} justifyContent="center" alignItems='center' flex={1}>
              <Spinner accessibilityLabel="Loading posts" color="indigo.500" />
              <Heading color="indigo.500" fontSize="xl">
                Loading
              </Heading>
            </VStack>
          }
          <StatusBar style="dark" />
        </NativeBaseProvider>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 50,
        flexDirection: 'column',
        backgroundColor: '#f8f9fa',
        alignItems:'center' ,
        justifyContent: 'center',
        margin: 15,
      },
      container2: {
        flex: 1,
        marginTop: 50,
        flexDirection: 'column',
        backgroundColor: '#f8f9fa',
        alignItems:'center' ,
        justifyContent: 'center',
        margin: 15,
      },
})
