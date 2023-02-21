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
    HStack,
    Select
} from "native-base";
import AntDesign from "react-native-vector-icons/AntDesign";
import Entypo from "react-native-vector-icons/Entypo";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import AppIntroSlider from 'react-native-app-intro-slider';
import AsyncStorage from '@react-native-async-storage/async-storage';

import axios from '../../../Axios.js'
import { SetUser } from "../../../Contexts/User";
import { SafeAreaView } from "react-native-safe-area-context";

import validate from 'validate.js';



export default function SignInForm({ navigation }) {

    const toast = useToast();
    const setUser = useContext(SetUser)

    const [paises, setPaises] = useState([])
    const [estados, setEstados] = useState([])

    const [formData, setFormData] = React.useState({});
    const [errors, setErrors] = React.useState({});

    const [loading, setLoading] = useState(false);

    const setData = (valuesForm) => {

        let constraints = {
            calles: {
                presence: {
                    message: "Ingrese la calle de su dirección"
                }
            },
            numero: {
                presence: {
                    message: "Ingrese el número de su dirección"
                }
            },
            codigo_postal: {
                presence: {
                    message: "Ingrese el código postal de su dirección"
                }
            },
            pais_id: {
                presence: {
                    message: "Ingrese el país de origen"
                }
            },
            estado_id: {
                presence: {
                    message: "Ingrese el país de origen"
                }
            },
            ciudad: {
                presence: {
                    message: "Ingrese la ciudad de origen"
                }
            },
        }
        let errors = validate(valuesForm, constraints, { fullMessages: false });
        setErrors(errors)
        setFormData(valuesForm)
    }


    useEffect(() => {

        getPaises()
    }, [])



    const onFinish = () => {
        setLoading(true)

        if (errors) return;

        axios.put('/usuarios/update-registro', {
            status: 1,
            ...formData
        })
            .then(({ data, headers }) => {
                navigation.navigate("SignIn", { replace: true })
            })
            .catch(error => {
                console.log("err", error.response.data)
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

    /**
* @memberOf FormCliente
* @method getPaises
* @description obtiene una lista de los paises
*/
    const getPaises = () => {
        axios.get('/paises')
            .then(({ data }) => {
                setPaises(data.data)
            })
            .catch(error => {

            })
    }

    /**
    * @memberOf FormCliente
    * @method getEstados
    * @description obtiene una lista de los estados
    */
    const getEstados = (pais_id) => {
        axios.get('/estados', {
            params: { pais_id }
        })
            .then(({ data }) => {
                setEstados(data.data)
            })
            .catch(error => {

            })
    }


    useEffect(() => {

    }, [])

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
                                            <FormControl isRequired isInvalid={isError('calles')}>
                                                <FormControl.Label _text={{ bold: true }}>Calles</FormControl.Label>
                                                <Input placeholder="Soledad" value={formData.calles} onChangeText={value => setData({ ...formData, calles: value })} />
                                                {renderErrors('calles')}
                                            </FormControl>

                                            <FormControl isRequired isInvalid={isError('numero')}>
                                                <FormControl.Label _text={{ bold: true }}>Número</FormControl.Label>
                                                <Input placeholder="#1850" value={formData.numero} onChangeText={value => setData({ ...formData, numero: value })} />
                                                {renderErrors('numero')}
                                            </FormControl>

                                            <FormControl isRequired isInvalid={isError('codigo_postal')}>
                                                <FormControl.Label _text={{ bold: true }}>Código Postal</FormControl.Label>
                                                <Input placeholder="58413" value={formData.codigo_postal} onChangeText={value => setData({ ...formData, codigo_postal: value })} />
                                                {renderErrors('codigo_postal')}
                                            </FormControl>

                                            <FormControl isRequired isInvalid={isError('pais_id')}>
                                                <FormControl.Label _text={{ bold: true }}>Pais</FormControl.Label>
                                                <Select
                                                    placeholder="México"
                                                    selectedValue={formData.pais_id}
                                                    onValueChange={value => {

                                                        let updateValues = {
                                                            ...formData,
                                                            pais_id: value
                                                        }

                                                        if (value !== formData?.pais_id)
                                                            delete updateValues['estado_id']

                                                        getEstados(value)
                                                        setData(updateValues)
                                                    }}
                                                >
                                                    {paises.map(({ _id, nombre, nombre_es }) => <Select.Item label={nombre_es || nombre} value={_id} />)}
                                                </Select>
                                                {renderErrors('pais_id')}
                                            </FormControl>

                                            <FormControl isRequired isInvalid={isError('estado_id')}>                                                <FormControl.Label _text={{ bold: true }}>Estado</FormControl.Label>
                                                <Select
                                                    placeholder="Ciudad de México"
                                                    onValueChange={value => setData({ ...formData, estado_id: value })}
                                                    selectedValue={formData.estado_id}
                                                >
                                                    {estados.map(({ _id, nombre, nombre_es }) => <Select.Item label={nombre_es || nombre} value={_id} />)}
                                                </Select>
                                                {renderErrors('estado_id')}
                                            </FormControl>

                                            <FormControl isRequired isInvalid={isError('calles')}>
                                                <FormControl.Label _text={{ bold: true }}>Ciudad</FormControl.Label>
                                                <Input placeholder="John" value={formData.ciudad} onChangeText={value => setData({ ...formData, ciudad: value })} />
                                                {renderErrors('ciudad')}
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