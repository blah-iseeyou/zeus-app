import React, { useContext, useEffect, useState } from "react";
import {
    Button,
    VStack,
    Text,
    Link,
    Image,
    IconButton,
    Icon,
    Center,
    Hidden,
    StatusBar,
    Stack,
    Input,
    Heading,
    Spinner,
    useToast,
    Box
} from "native-base";
import AntDesign from "react-native-vector-icons/AntDesign";
import Entypo from "react-native-vector-icons/Entypo";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import AppIntroSlider from 'react-native-app-intro-slider';
import AsyncStorage from '@react-native-async-storage/async-storage';

import axios from '../../Axios'
// // import axios from 'axios'
import { SetUser } from "../../Contexts/User";


export default function SignInForm({ navigation }) {

    const toast = useToast();
    const setUser = useContext(SetUser)

    const [email, setEmail] = useState("")

    const [loading, setLoading] = useState(false);

    useEffect(() => {

    }, [])





    const onFinish = () => {
        setLoading(true)
        axios.put("/password/recovery", { email })
            .then(res => {
                toast.show({
                    title: "Se ha enviado el correo de recuperación",
                    bg: "green.400",
                    placement: "top"
                })
                navigation.navigate("SignIn")

            })
            .catch(res => {
                toast.show({
                    title: "No es posible enviar el correo de recuperación",
                    bg:"red.400",
                    placement: "top"
                })
            }).finally(() => setLoading(false))

    }



    return <>
        <StatusBar
            translucent
            backgroundColor="transparent"
            barStyle="dark-content"
        />
        <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1 }} style={{ flex: 1 }}>
            <Center
                safeAreaTop
                colorScheme="primary"
                my="auto"
                // variant="linear-gradient"
                flex="1"
            >
                <Stack
                    flexDirection={{
                        base: "column",
                        md: "row",
                    }}
                    w="100%"
                    maxW={{
                        md: "1016px",
                    }}
                    flex={{
                        base: "1",
                        md: "none",
                    }}
                >
                    <Hidden from="md">
                        <VStack px="4" mt="4" mb="5" space="9">
                            <Image alt={"Zeus Oro Azul de los Altos"} source={require("../../../assets/img/LogoZeuesOADLAH.png")} resizeMode="contain" h={"20"} />
                            <VStack space="2">
                                <Text fontSize="3xl" fontWeight="bold" >
                                    Recuperación
                                </Text>
                                <Text
                                    fontSize="md"
                                    fontWeight="normal"
                                    _dark={{
                                        color: "white.300",
                                    }}
                                // _light={{
                                //   color: "coolGray.50",
                                // }}
                                >
                                    ¡Ingresa tu Correo para recuperar tu cuenta!
                                </Text>
                            </VStack>
                        </VStack>
                    </Hidden>
                    <VStack flex="1" px="6" py="9" space="3" justifyContent="space-between"
                        _dark={{ bg: "coolGray.800", }}
                        borderTopRightRadius={{ base: "2xl", md: "xl" }}
                        borderBottomRightRadius={{ base: "0", md: "xl", }}
                        borderTopLeftRadius={{ base: "2xl", md: "0", }}
                    >
                        <VStack space="7">
                            <VStack>
                                <VStack space="3">
                                    <VStack space={{ base: "7", md: "4", }}>
                                        <Input
                                            isRequired
                                            size="xl"
                                            label="Email"
                                            placeholder="Correo Electrónico"

                                            defaultValue={email}
                                            onChangeText={(txt) => setEmail(txt)}
                                            _text={{ fontSize: "sm", fontWeight: "medium", }}
                                        />
                                    </VStack>
                                    <Link
                                        ml="auto"
                                        _text={{
                                            fontSize: "xs",
                                            fontWeight: "bold",
                                            textDecoration: "none",
                                        }}
                                        _light={{
                                            _text: {
                                                color: "primary.900",
                                            },
                                        }}
                                        _dark={{
                                            _text: {
                                                color: "primary.500",
                                            },
                                        }}
                                        onPress={() => navigation.navigate("SignIn")}
                                    >
                                        ¿Ya tienes cuenta? Iniciar Sesión
                                    </Link>
                                    <Button
                                        mt="5"
                                        size="md"

                                        _text={{
                                            fontWeight: "medium",
                                        }}
                                        onPress={onFinish}
                                        borderRadius={300}
                                        isLoading={loading}
                                    >
                                        Enviar correo de recuperación
                                    </Button>

                                    <Text textAlign={"center"}>¿No tienes cuenta? <Text color={"primary.900"} onPress={() => console.log("sdfas")}>Registrate</Text></Text>
                                </VStack>
                            </VStack>
                        </VStack>
                    </VStack>



                </Stack>
            </Center>
        </KeyboardAwareScrollView>
    </>


}