import { createStackNavigator } from "react-navigation-stack";
import { createAppContainer } from "react-navigation";
import Home from '../screens/Home';
import CamInterface from '../screens/CamInterface';
import ErrorPage from '../screens/ErrorPage';
import AnswerPage from "../screens/AnswerPage";
import testing from "../screens/testing";
const screens = {
    testing: {
        screen: testing, 
        navigationOptions: {headerShown: false},
    },
    Home: {
        screen: Home, 
        navigationOptions: {headerShown: false},
    },
    CamInterface: {
        screen: CamInterface,
        navigationOptions: {headerShown: false},
    },
    ErrorPage: {
        screen: ErrorPage, 
        navigationOptions: {headerShown: false},
    },
    AnswerPage: {
        screen: AnswerPage, 
        navigationOptions: {headerShown: false},
    },
    
    
    
    
}
const HomeStack = createStackNavigator(screens);

export default createAppContainer(HomeStack);