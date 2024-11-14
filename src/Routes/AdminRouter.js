
import React from "react";

import { Dimensions, Platform, SafeAreaView, Keyboard, PlatformOSType } from "react-native";
import { Box, Icon, IconButton, HStack, VStack, Pressable, Text, } from "native-base";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Path } from "react-native-svg";
import { PermissionsAndroid } from 'react-native';


import Octicons from "react-native-vector-icons/Octicons";
import AntDesign from "react-native-vector-icons/AntDesign";
import FontAwesome from "react-native-vector-icons/FontAwesome";

import Dashboard from "../Components/Admin/Dashboard"
import Inversiones from "../Components/Admin/Inversiones/Inversiones"
import Inversion from "../Components/Admin/Inversiones/Inversion"
import Reventas from "../Components/Admin/Reventas/Reventas"
import Haciendas from "../Components/Admin/Haciendas/Haciendas"
import Hacienda from "../Components/Admin/Haciendas/Hacienda"

import Comprar from "../Components/Admin/Comprar/Comprar"


import Cuenta from "../Components/Admin/Configuración/Cuenta"
import Cuentas from "../Components/Admin/Configuración/Cuentas/ListaCuentas"
import ListaBeneficiarios from "../Components/Admin/Configuración/Beneficiarios/ListaBeneficiarios"

import Menu from "../Components/Admin/Configuración/Menu"
import Chat from "../Components/Admin/Soporte/Chat";

import getToken from "../FCMToken";
import messaging from '@react-native-firebase/messaging';
import User from "../Contexts/User";


const BottomStack = createBottomTabNavigator()

const LinkButtom = ({
    onPress,
    icon = () => { },
    label,
    active = false
}) => {
    return (
        <Pressable flex={1} onPress={onPress}>
            {({
                isPressed
            }) => <VStack flex="1" alignItems="center" style={{
                transform: [{
                    scale: isPressed ? 0.9 : 1
                }]
            }}>
                    {icon(active ? "primary.900" : "#C8CBDC")}
                    <Text fontSize={"xs"}>{label}</Text>
                </VStack>}
        </Pressable>
    )
}

export default function () {

    const insets = useSafeAreaInsets();
    const [keyboardShown, setKeyboardShown] = React.useState(false)
    const user = React.useContext(User);



    React.useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            "keyboardDidShow",
            () => {
                setKeyboardShown(true)
            }
        );
        const keyboardDidHideListener = Keyboard.addListener(
            "keyboardDidHide",
            () => {
                setKeyboardShown(false)
            }
        );

        PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);


        getToken();

        messaging()
            .subscribeToTopic(user?.cliente?._id)
            .then((e) => console.log('Subscribed to topic!', user?.cliente?._id));


        return () => {
            keyboardDidHideListener.remove();
            keyboardDidShowListener.remove();

        };
    }, []);



    const width = Dimensions.get("window").width

    return <BottomStack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName="Dashboard"
        tabBar={({ navigation, state }) => {
            return <Box w="100%" m={(keyboardShown && Platform.OS === "android") ? -100 : 0} px={0} py={2} h={insets.bottom + 60} shadow={1} background="white">
                <HStack flex="1" w="100%">
                    <LinkButtom
                        active={state.index === 0}
                        label={"Inicio"}
                        onPress={() => navigation.navigate("Dashboard")}
                        icon={(color) => <Icon as={FontAwesome} name="home" size="xl" color={color} />}
                    />
                    <LinkButtom
                        active={state.index === 1}
                        label={"Inversiones"}
                        onPress={() => navigation.navigate("Inversiones")}
                        icon={
                            (color) => <Icon size="xl" color={color} viewBox="0 0 88 88">
                                <Path d="M63.0105 42.2414C66.082 37.3703 68.8813 32.9319 71.861 28.1756L80.787 42.2382H77.5812C75.4079 42.2382 74.9817 42.6577 74.9588 44.7852C74.8244 60.1491 62.8007 73.6839 47.4892 75.7064C27.6114 78.3288 10.5659 63.0534 11.0084 43.015C11.4182 24.2649 28.7325 9.53036 47.204 12.3462C50.187 12.7985 53.1044 13.7983 55.9825 14.7817C58.0115 15.4766 58.7294 17.2566 58.0279 18.9316C57.2937 20.6788 55.5826 21.2262 53.5109 20.3936C42.7525 16.0273 31.6991 18.1744 24.1433 26.4809C17.3808 33.8989 15.4436 42.6545 18.6167 52.1836C21.7668 61.6439 28.4932 67.5115 38.2846 69.393C52.888 72.1957 66.5999 62.2011 68.6388 47.5157C68.7608 46.3749 68.8123 45.2276 68.7928 44.0804C68.8125 42.8741 68.1569 42.2742 66.9703 42.2578C65.7837 42.2414 64.6921 42.2414 63.0105 42.2414Z" fill={color} />
                                <Path d="M40.825 58.8412C38.8975 58.32 37.1962 57.9299 35.5441 57.3923C33.5413 56.7367 33.4397 56.3598 34.3149 54.0652C34.941 52.4262 35.3638 52.4032 37.2126 52.9015C39.277 53.5012 41.4027 53.8652 43.549 53.9865C45.224 54.0455 46.4992 52.9408 46.9843 51.2067C47.3678 49.7874 46.6565 48.2565 45.0175 47.2305C43.962 46.5749 42.7819 46.116 41.6608 45.5621C40.3497 44.9065 38.9762 44.3426 37.7273 43.5756C35.1442 41.989 33.7937 39.642 34.0952 36.5738C34.3968 33.3187 36.1964 31.0405 39.2155 29.9949C40.8217 29.4409 41.2773 28.6837 41.1823 27.084C41.0577 25.0254 41.6477 24.5731 43.6309 24.6419C44.9028 24.6878 45.4961 25.2418 45.5256 26.5563C45.5813 29.1459 45.6207 29.1426 48.1185 29.7195C48.4463 29.7949 48.7544 29.8637 49.0691 29.949C51.7407 30.6963 51.8849 31.0766 50.7933 33.5843C50.2459 34.8463 49.4821 34.8496 48.2889 34.5677C46.51 34.1175 44.6924 33.8365 42.8606 33.7285C41.2478 33.6564 40.0284 34.5644 39.6482 36.223C39.2876 37.8161 40.2251 38.8717 41.4806 39.5502C43.1196 40.4254 44.8438 41.0941 46.509 41.9005C49.1314 43.1658 51.4653 44.7589 52.3176 47.7517C53.5632 52.1311 51.4883 56.3729 47.1482 57.9135C45.5453 58.4741 45.07 59.1788 45.1814 60.7981C45.3355 63.0927 44.634 63.6041 42.382 63.3484C41.3462 63.2304 40.7922 62.7387 40.8151 61.657C40.8381 60.7195 40.825 59.7983 40.825 58.8412Z" fill={color} />
                            </Icon>
                        }
                    />
                    <LinkButtom
                        active={state.index === 3}
                        label={"Reventas"}
                        onPress={() => navigation.navigate("Reventas")}
                        icon={
                            (color) => <Icon size="xl" color={color} viewBox="0 0 25 23">
                                <Path d="M6.92184 11.7341C5.85423 13.4272 4.88121 14.9699 3.8455 16.6232L0.742942 11.7352H1.85727C2.61268 11.7352 2.7608 11.5894 2.76877 10.8499C2.81549 5.50961 6.99476 0.805084 12.3168 0.102082C19.2261 -0.809427 25.1509 4.50011 24.9971 11.4652C24.8546 17.9825 18.8364 23.104 12.416 22.1253C11.3791 21.968 10.3651 21.6205 9.36469 21.2787C8.6594 21.0372 8.40988 20.4185 8.65371 19.8363C8.90893 19.229 9.50369 19.0387 10.2238 19.3281C13.9632 20.8458 17.8053 20.0995 20.4315 17.2123C22.7821 14.6338 23.4555 11.5905 22.3526 8.27832C21.2576 4.99005 18.9196 2.95055 15.5162 2.29654C10.4403 1.32237 5.67421 4.79636 4.96552 9.90081C4.9231 10.2974 4.90522 10.6961 4.91197 11.0949C4.90513 11.5142 5.133 11.7227 5.54546 11.7284C5.95792 11.7341 6.33733 11.7341 6.92184 11.7341Z" fill={color} />
                                <Path d="M12.9449 16.2813C12.2749 16.1002 11.6836 15.9646 11.1094 15.7777C10.4132 15.5498 10.3779 15.4188 10.6821 14.6213C10.8997 14.0516 11.0467 14.0436 11.6893 14.2168C12.4069 14.4252 13.1457 14.5518 13.8917 14.5939C14.474 14.6144 14.9172 14.2304 15.0858 13.6277C15.2191 13.1343 14.9719 12.6023 14.4022 12.2456C14.0353 12.0178 13.6251 11.8582 13.2355 11.6657C12.7797 11.4378 12.3023 11.2418 11.8682 10.9752C10.9704 10.4238 10.5009 9.60795 10.6057 8.54148C10.7106 7.41007 11.3361 6.6182 12.3855 6.25473C12.9438 6.06218 13.1021 5.79898 13.0691 5.24296C13.0258 4.52742 13.2309 4.37019 13.9202 4.39412C14.3623 4.41007 14.5685 4.60262 14.5788 5.05952C14.5982 5.95963 14.6118 5.95849 15.48 6.15903C15.594 6.18523 15.7011 6.20916 15.8105 6.23878C16.7391 6.49856 16.7892 6.63073 16.4098 7.50236C16.2195 7.94103 15.954 7.94217 15.5393 7.84418C14.9209 7.68772 14.2892 7.59005 13.6525 7.55249C13.0919 7.52743 12.668 7.84304 12.5359 8.41957C12.4105 8.97331 12.7364 9.34019 13.1728 9.57605C13.7425 9.88026 14.3418 10.1127 14.9206 10.393C15.8321 10.8328 16.6434 11.3865 16.9396 12.4268C17.3726 13.949 16.6513 15.4234 15.1428 15.9589C14.5856 16.1537 14.4204 16.3987 14.4592 16.9616C14.5127 17.7591 14.2689 17.9369 13.4861 17.848C13.1261 17.807 12.9335 17.6361 12.9415 17.2601C12.9495 16.9342 12.9449 16.614 12.9449 16.2813Z" fill={color} />
                            </Icon>
                        }
                    />
                    <LinkButtom
                        active={state.index === 3 || state.index === 4}
                        label={"Haciendas"}
                        onPress={() => navigation.navigate("Haciendas")}
                        icon={
                            (color) => <Icon size="xl" color={color} viewBox="0 0 88 88">
                                <Path d="M76 32.37C74.95 23.625 67.8625 17 58.9375 17C54.475 17 50.0125 18.855 46.8625 22.035C45.025 23.89 43.7125 25.745 42.925 28.13L57.625 37.935V38.2H65.5V43.5H57.625V48.8H65.5V54.1H57.625V59.4H65.5V64.7H57.625V70H76V32.37ZM47.9125 30.25C49.4875 25.48 53.95 22.3 58.9375 22.3C63.925 22.3 68.3875 25.48 69.9625 30.25H47.9125M13 40.85V70H26.125V51.45H39.25V70H52.375V40.85L32.6875 27.6L13 40.85Z" fill={color} />
                            </Icon>
                        }
                    />
                    <LinkButtom
                        active={state.index === 5}
                        label={"Ajustes"}
                        onPress={() => navigation.navigate("Settings")}
                        icon={(color) => <Icon as={Octicons} name="gear" size="xl" color={color} />}
                    />
                </HStack>
            </Box>
        }}>
        <BottomStack.Screen name={"Dashboard"} component={Dashboard} />
        <BottomStack.Screen name={"Inversiones"} component={Inversiones} />

        <BottomStack.Screen name={"Inversion"} component={Inversion} initialParams={{ inversion_id: null }} />
        <BottomStack.Screen name={"Comprar"} component={Comprar}
            options={{ unmountOnBlur: true }}
            initialParams={{
                reventa_id: null,
                hacienda_id: null
            }} />

        <BottomStack.Screen name={"Reventas"} component={Reventas} />

        <BottomStack.Screen name={"Reventa"} component={Reventas} />

        <BottomStack.Screen name={"Haciendas"} component={Haciendas} />
        <BottomStack.Screen name={"Hacienda"} component={Hacienda} initialParams={{ hacienda_id: null }} />
        <BottomStack.Screen name={"Settings"} component={Menu} />
        <BottomStack.Screen name={"Cuentas"} component={Cuentas} />
        <BottomStack.Screen name={"Cuenta"} component={Cuenta} />
        <BottomStack.Screen name={"Soporte"} component={Chat} />


        <BottomStack.Screen name={"Beneficiarios"} component={ListaBeneficiarios} />
    </BottomStack.Navigator>
    {/* import Cuenta from "../Components/Admin/Configuración/Cuenta"
import Beneficiarios from "../Components/Admin/Configuración/Beneficiarios" */}
    {/* <BottomStack.Screen name={"Inversiones"} component={Inversiones} /> */ }
}
