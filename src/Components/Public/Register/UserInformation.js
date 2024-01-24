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
    Box,
    FormControl,
    ScrollView,
    HStack
} from "native-base";
import AntDesign from "react-native-vector-icons/AntDesign";
import Entypo from "react-native-vector-icons/Entypo";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import AppIntroSlider from 'react-native-app-intro-slider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import validate from 'validate.js';
import axios from '../../../Axios'
import { SetUser } from "../../../Contexts/User";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignInForm({ navigation }) {

    const toast = useToast();
    const setUser = useContext(SetUser)


    const [formData, setFormData] = React.useState({});
    const [errors, setErrors] = React.useState({});

    const [loading, setLoading] = useState(false);

    const setData = (valuesForm) => {
        let constraints = {
            nombre: {
                presence: {
                    message: "Ingrese su nombre"
                }
            },
            apellido_paterno: {
                presence: {
                    message: "Ingrese su apellido paterno"
                }
            },
            apellido_materno: {
                presence: {
                    message: "Ingrese su apellido materno"
                }
            },
        }
        let errors = validate(valuesForm, constraints, { fullMessages: false });
        setErrors(errors)
        setFormData(valuesForm)
    }


    useEffect(() => {

    }, [])

    const onFinish = () => {

        setLoading(true)
        axios.put('/usuarios/update-registro', {
            status: 3,
            ...formData
        })
            .then(({ data, headers }) => {
                // console.log("YEI")
                navigation.navigate("Address")
            })
            .catch(e => console.log("e", e))
            .finally(e => setLoading(false))
    }

    const isError = (name) => errors && errors[name]

    const renderErrors = (name) => (isError(name)) ? errors[name].map(e => <FormControl.ErrorMessage>{e}</FormControl.ErrorMessage>) : null

    return <>
        <StatusBar
            translucent
            backgroundColor="transparent"
            barStyle="dark-content"
        />
        <SafeAreaView flex={1}>
            <ScrollView style={{ flex: 1 }}>
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
                        }}
                        w="100%"
                        maxW={{
                            md: "1016px",
                        }}
                        flex={{
                            base: "1",
                        }}
                    >
                        <Hidden from="md">
                            <VStack px="4" mt="4" mb="5" space="9">
                                <Image alt={"Zeus Oro Azul de los Altos"} source={require("../../../../assets/img/LogoZeuesOADLAH.png")} resizeMode="contain" h={"20"} />
                                <VStack space="2">
                                    <Text fontSize="3xl" fontWeight="bold" >
                                        Registrate
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
                                        Ingresa tu información para continuar
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
                                        <VStack space={{ base: "4", md: "2", }}>
                                            <FormControl isRequired isInvalid={isError('nombre')}>
                                                <FormControl.Label _text={{ bold: true }}>Nombre</FormControl.Label>
                                                <Input fontSize={"lg"} placeholder="Jose" value={formData.nombre} onChangeText={value => setData({ ...formData, nombre: value })} />
                                                {renderErrors('nombre')}
                                            </FormControl>

                                            <FormControl isRequired isInvalid={isError('apellido_paterno')}>
                                                <FormControl.Label _text={{ bold: true }}>Apellido Paterno</FormControl.Label>
                                                <Input fontSize={"lg"} placeholder="Perez" value={formData.apellido_paterno} onChangeText={value => setData({ ...formData, apellido_paterno: value })} />
                                                {renderErrors('apellido_paterno')}
                                            </FormControl>

                                            <FormControl isRequired isInvalid={isError('apellido_materno')}>
                                                <FormControl.Label _text={{ bold: true }}>Apellido Materno</FormControl.Label>
                                                <Input fontSize={"lg"} placeholder="Gomez" value={formData.apellido_materno} onChangeText={value => setData({ ...formData, apellido_materno: value })} />
                                                {renderErrors('apellido_materno')}
                                            </FormControl>



                                            <HStack justifyContent={"space-between"} flex={1}>
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
                                                    onPress={() => navigation.navigate("RecoveryPassword")}
                                                >
                                                    ¿Olvidó su contraseña?
                                                </Link>
                                                <Link
                                                    ml="auto"
                                                    _text={{
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
                                                    onPress={() => navigation.navigate("Signin")}
                                                >
                                                    Iniciar Sesión
                                                </Link>
                                            </HStack>
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
                                                Continuar
                                            </Button>

                                        </VStack>

                                    </VStack>
                                </VStack>
                            </VStack>
                        </VStack>



                    </Stack>
                </Center>
            </ScrollView>
        </SafeAreaView>

    </>


}