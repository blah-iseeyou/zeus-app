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


    let [formData, setFormData] = React.useState({});
    let [errors, setErrors] = React.useState({});
    const [isValid, setIsValid] = React.useState(false);


    const checkEmail = (email) => {
        if (!(/[a-z0-9\._]+@[a-z0-9\._]+\.[a-z0-9]+/.test(email))) return Promise.resolve(false)

        return new Promise((resolve, reject) => {
            axios.post('/verify-email', { email })
                .then(({ data }) => {
                    resolve(true)
                })
                .catch(error => {
                    // console.log("e",  error)
                    resolve(false)
                })
        })
    }

    const [showPass, setShowPass] = useState(false)
    const [loading, setLoading] = useState(false);



    const setData = (valuesForm) => {
        let constraints = {
            email: {
                presence: {
                    message: "Debe de ingresar un correo electrónico válido"
                },
                email: {
                    message: "El correo debe de ser válido"
                }
            },
            telefono: {
                presence: {
                    message: "El telefono no es válido"
                }
            },
            telefono: {
                presence: {
                    message: "El telefono no es válido"
                }
            },
            password: {
                presence: {
                    message: "Debe ingresar una contraseña"
                },
                length: {
                    minimum: 8,
                    message: "La contraseña debe de tener mínimo 8 caracteres"
                },
                format: {
                    pattern: "^(?=.*[~`!@#$%^&*()\-_+={}[\]\|\/:;\"'<>,.?¿¡]).+$",
                    message: "Debe contener al menos un caracter especial"
                },
            },
            password: {
                presence: {
                    message: "Debe ingresar una contraseña"
                },
                length: {
                    minimum: 8,
                    message: "La contraseña debe de tener mínimo 8 caracteres"
                },
                format: {
                    pattern: "^(?=.*[~`!@#$%^&*()\-_+={}[\]\|\/:;\"'<>,.?¿¡]).+$",
                    message: "Debe contener al menos un caracter especial"
                },
            },
            confirm: {
                presence: {
                    message: "Debe ingresar la confirmación de la contraseña"
                },
                equality: {
                    attribute: "password",
                    message: "Las contraseñas deben de coincidir."
                }
            }
        }
        let errors = validate(valuesForm, constraints, { fullMessages: false });
        setErrors(errors)
        setFormData(valuesForm)
    }




    useEffect(() => {

    }, [])


    const onFinish = () => {

        console.log("erro xrs", errors)
        if (errors) return;

        setLoading(true)
        axios.post('/register', {
            status: 2,
            keep_session: true, 
            ...formData
        })
            .then(async ({ data, headers }) => {
                console.log("d", data)
                console.log("h", headers)
                await AsyncStorage.setItem('@token', headers.authorization)
                axios.defaults.headers.common['Authorization'] = headers.authorization
                setUser(data)
                navigation.navigate("UserInformation")
            })
            .catch(error => {
                toast.show({
                    render: () => {
                        return <Box bg="red.500" px="2" mx="4" py="1" rounded="sm" mb={5}>
                            <Heading size="xs" color={"white"}>{error?.response?.data?.message ?? "Revise su información ingresada"}</Heading>
                        </Box>
                    }
                })
            })
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
                                            <FormControl isRequired isInvalid={isError('email')}>
                                                <FormControl.Label _text={{ bold: true }}>Correo Electrónico</FormControl.Label>
                                                <Input
                                                    fontSize={"lg"}
                                                    placeholder="yo@dominio.com"
                                                    value={formData.email}
                                                    
                                                    autoCapitalize={false}
                                                    autoCorrect={false}
                                                    spellCheck={false}
                              
                                                    onChangeText={value => setData({ ...formData, email: value })}
                                                    
                                                    />
                                                {renderErrors('email')}
                                            </FormControl>

                                            <FormControl isRequired isInvalid={isError('telefono')}>
                                                <FormControl.Label _text={{ bold: true }}>Teléfono</FormControl.Label>
                                                <Input fontSize={"lg"} placeholder="6641251515" value={formData.telefono} onChangeText={value => setData({ ...formData, telefono: value })} />
                                                {renderErrors('telefono')}
                                            </FormControl>
                                            <FormControl isRequired isInvalid={isError('password')}>
                                                <FormControl.Label _text={{ bold: true }}>Contraseña</FormControl.Label>
                                                <Input type={showPass ? "text" : "password"} fontSize={"lg"} placeholder=" * * * * " value={formData.password} onChangeText={value => setData({ ...formData, password: value })} InputRightElement={<IconButton variant="unstyled" icon={<Icon size="4" color="coolGray.400" as={Entypo} name={showPass ? "eye-with-line" : "eye"} />} onPress={() => setShowPass(!showPass)} />}
                                                />
                                                {renderErrors('password')}
                                            </FormControl>
                                            <FormControl isRequired isInvalid={isError('confirm')}>
                                                <FormControl.Label _text={{ bold: true }}>Confirmar Contraseña</FormControl.Label>
                                                <Input type={"password"} fontSize={"lg"} placeholder=" * * * * " value={formData.confirm} onChangeText={value => setData({ ...formData, confirm: value })} />
                                                {renderErrors('confirm')}
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