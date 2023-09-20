import React, {useState, useEffect} from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StyleSheet, ActivityIndicator,TouchableOpacity,Text, View, Button, Image, Alert, Platform, TextInput  } from "react-native";
import { NativeBaseProvider,HStack,VStack,Center,Pressable,Icon,Box, Switch,Heading,AlertDialog,Spinner,AspectRatio,Stack,Skeleton,IconButton} from "native-base";
import axios from 'axios';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import _map from 'lodash/map'

export default function AnswerPage({navigation}) {
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState("NULL");
  const [result, setResult] = useState([])
  const [qLen, setQLen] = useState("25%")
  const [subpodLen, setSubpodLen] = useState(1)
  const [pType, setPType] = useState("Unable to solve the problem")
  const backButtonPressed = () => {
    setQuery("NULL")
    setResult("NULL")
    setPType(" ")
    navigation.navigate('Home')
    
}
  useEffect(() => {
    (async () => {
      setLoading(true)

      if(navigation.getParam('question', 'NO-ID').length > 20){
        setQLen("100%")
      }else if(navigation.getParam('question', 'NO-ID').length > 10){
        setQLen("50%")
      }

      apiUrl = `https://api.wolframalpha.com/v2/query?appid=EWHKLU-URV8L3RAYG&input=`+encodeURIComponent(JSON.stringify(navigation.getParam('question', 'NO-ID')))+`&podstate=Result__Step-by-step%20solution&format=image&output=JSON`
      console.log("Wolfram Query: " + apiUrl)
      await axios
      .post(apiUrl)
      .then(function (response) {
        console.log(response)
        let res = response.data.queryresult.pods
        for(const key in res){

          if (res[key].id == "Input") {
            console.log(res[key].subpods[0].img.alt)      
            setQuery(res[key].subpods[0].img.src)
            setPType(res[key].title)
          }
          const arr = []
          const subPodLength = []

          //COMPLEX SOLUTIONS
          if (((res[key].title == "Complex solutions" || res[key].title == "Complex solution") && (res[key].id == "ComplexSolution") )) {
            let str2 = ""
            let item = res[key].subpods
            // console.log("COMPLEX ITEM LENGTH: " + item.length)
            item.forEach(element => {
              if(element.title == ""){
                str2 = element.img.alt
                str2 = str2.replace("≈","=")
                 arr.push(str2)
                setResult(resu => [...resu,str2])
              }
              // str1 = str1 + "\n" +  str2 
            });
            // setResult(arr)
            setSubpodLen(arr.length)
          }
          //IF COMPLEX EXSISTS THEN REAL SOLUTIONS
          if (((res[key].title == "Real solution" || res[key].title == "Real solutions") && (res[key].id == "RealSolution") )) {
            let str2 = ""
            let item = res[key].subpods
            // console.log("REAL ITEM LENGTH: " + item.length)
            item.forEach(element => {
              if(element.title == ""){
                str2 = element.img.alt
                str2 = str2.replace("≈","=")
                arr.push(str2)
                setResult(resu => [...resu,str2])
              }
            });
            // setResult(arr)
            // console.log("R: ",arr, result)
            setSubpodLen(arr.length)
          }
          //ONLY REAL SOLUTIONS
          if (((res[key].title == "Solution" || res[key].title == "Solutions") && (res[key].id == "Solution"))  ) {
                let str2 = ""
                let item = res[key].subpods
                // console.log(item.length)
                setSubpodLen(item.length)
                item.forEach(element => {
                  if(element.title == ""){
                    str2 = element.img.alt
                    str2 = str2.replace("≈","=")
                    arr.push(str2)
                    setResult(resu => [...resu,str2])
                  }
                  // str1 = str1 + "\n" +  str2 
                });
                // setResult(arr)
                setSubpodLen(subPodLength.length)
          }

          //SIMPLIFICATION
          if (((res[key].title == "Result" || res[key].title == "Results") && (res[key].id == "Result"))  ) {
            let str2 = ""
            let item = res[key].subpods
            // console.log(item.length)
            setSubpodLen(item.length)
            item.forEach(element => {
              if(element.title == ""){
                str2 = element.img.alt
                str2 = str2.replace("≈","=")
                arr.push(str2)
                setResult(resu => [...resu,str2])
              }
              // str1 = str1 + "\n" +  str2 
            });
            // setResult(arr)
            setSubpodLen(subPodLength.length)
      }
        }
        
        }).
      catch(function (error) {
        console.log(error);
      });

      setLoading(false)
    })();
  }, []);
 

    return (
        <SafeAreaView style = {styles.container}>
        <NativeBaseProvider>
          {!loading
          ?
          <VStack>
            <Center>
            <View style={{marginTop:10}}>
              <Text style={{color:'#818cf8', fontWeight:'bold', fontSize:18}}>{pType}</Text>
            </View>
            </Center>

            {
              query != "NULL"
              ?
              <Center>
                <AspectRatio w={"80%"} ratio={16 / 9}>
                  <Image resizeMode="contain" source={{uri: query}} style={{flex:1, height: undefined, width: undefined}} alt="Query" />
                </AspectRatio>
              </Center>
              :
              <View style={{justifyContent: "center",alignItems: "center"}}>
                <MaterialCommunityIcons name="keyboard-backspace" style={styles.leftButton} onPress={backButtonPressed}></MaterialCommunityIcons>
              </View>
            }
            

              <Center>
                { result != []
                ?
                  (result.length == 1) 
                  ?
                  <Center>
                    <AspectRatio w={"80%"} ratio={16 / 9}>
                      <Image resizeMode="contain" source={{uri: 'https://chart.googleapis.com/chart?cht=tx&chl=' + encodeURIComponent(result[0])}} style={{flex:1, height: undefined, width: undefined}} alt="Query" />
                    </AspectRatio>
                  </Center>
                  :
                    (result.length  == 2)
                    ?
                    <VStack>
                      <Center>
                        <AspectRatio w={"80%"} ratio={16 / 9}>
                          <Image resizeMode="contain" source={{uri:'https://chart.googleapis.com/chart?cht=tx&chl=' + encodeURIComponent(result[0]) }} style={{flex:1, height: 44, width:550}} alt="Query" />
                        </AspectRatio>
                      </Center>
                      <Center>
                        <AspectRatio w={"80%"} ratio={16 / 9}>
                          <Image resizeMode="contain" source={{uri:'https://chart.googleapis.com/chart?cht=tx&chl=' + encodeURIComponent(result[1]) }} style={{flex:1, height: undefined, width: undefined}} alt="Query" />
                        </AspectRatio>
                      </Center>
                    </VStack>
                    :
                      (result.length  == 3)
                      ?
                      <VStack>
                        <Center>
                          <AspectRatio w={"80%"} ratio={16 / 9}>
                            <Image resizeMode="contain" source={{uri: 'https://chart.googleapis.com/chart?cht=tx&chl=' + encodeURIComponent(result[0])}} style={{flex:1, height: undefined, width: undefined}} alt="Query" />
                          </AspectRatio>
                        </Center>
                        <Center>
                          <AspectRatio w={"80%"} ratio={16 / 9}>
                            <Image resizeMode="contain" source={{uri: 'https://chart.googleapis.com/chart?cht=tx&chl=' + encodeURIComponent(result[1])}} style={{flex:1, height: undefined, width: undefined}} alt="Query" />
                          </AspectRatio>
                        </Center>
                        <Center>
                          <AspectRatio w={"80%"} ratio={16 / 9}>
                            <Image resizeMode="contain" source={{uri: 'https://chart.googleapis.com/chart?cht=tx&chl=' + encodeURIComponent(result[2])}} style={{flex:1, height: undefined, width: undefined}} alt="Query" />
                          </AspectRatio>
                        </Center>
                      </VStack>
                      :
                        (result.length  == 4)
                        ?
                        <VStack>
                          <Center>
                            <AspectRatio w={"80%"} ratio={16 / 9}>
                              <Image resizeMode="contain" source={{uri: 'https://chart.googleapis.com/chart?cht=tx&chl=' + encodeURIComponent(result[0])}} style={{flex:1, height: undefined, width: undefined}} alt="Query" />
                            </AspectRatio>
                          </Center>
                          <Center>
                            <AspectRatio w={"80%"} ratio={16 / 9}>
                              <Image resizeMode="contain" source={{uri: 'https://chart.googleapis.com/chart?cht=tx&chl=' + encodeURIComponent(result[1])}} style={{flex:1, height: undefined, width: undefined}} alt="Query" />
                            </AspectRatio>
                          </Center>
                          <Center>
                            <AspectRatio w={"80%"} ratio={16 / 9}>
                              <Image resizeMode="contain" source={{uri: 'https://chart.googleapis.com/chart?cht=tx&chl=' + encodeURIComponent(result[2])}} style={{flex:1, height: undefined, width: undefined}} alt="Query" />
                            </AspectRatio>
                          </Center>
                          <Center>
                            <AspectRatio w={"80%"} ratio={16 / 9}>
                              <Image resizeMode="contain" source={{uri: 'https://chart.googleapis.com/chart?cht=tx&chl=' + encodeURIComponent(result[3])}} style={{flex:1, height: undefined, width: undefined}} alt="Query" />
                            </AspectRatio>
                          </Center>
                        </VStack>
                        :
                          <View style={{justifyContent: "center",alignItems: "center"}}>
                            <Text style={{ color: '#818cf8', fontWeight: 'bold', fontSize: 18 }}>{result}</Text>
                            <MaterialCommunityIcons MaterialCommunityIcons name="keyboard-backspace" style={styles.leftButton} onPress={backButtonPressed}></MaterialCommunityIcons>
                          </View>
                :
                  <>
                    <Text style={{color:'#818cf8', fontWeight:'bold', fontSize:18}}>Bad Gateway: 502 </Text>
                    <View style={{justifyContent: "center",alignItems: "center"}}>
                      <MaterialCommunityIcons MaterialCommunityIcons name="keyboard-backspace" style={styles.leftButton} onPress={backButtonPressed}></MaterialCommunityIcons>
                    </View>
                  </>
                }
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
        </NativeBaseProvider>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 50,
        flexDirection: 'column',
        backgroundColor: '#ffffff',
        alignItems:'center' ,
        justifyContent: 'center',
        margin: 15,
      },
      leftButton: { 
        color: '#6366f1', 
        fontSize: 36, 
      },
})
