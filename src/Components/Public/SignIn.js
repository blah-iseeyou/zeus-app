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

import axios from '../../Axios.js'
// // import axios from 'axios'
import { SetUser } from "../../Contexts/User";


export default function SignInForm({ navigation }) {
  const slides = [
    {
      key: 's1',
      title: '¡Invierte en Agave!',
      subtitle: 'Desde cualquier parte del mundo como nunca antes',
      description: "Somos la nueva generación de AgroTech",
      image: require("../../../assets/img/LogoZeusOADLA.png"),
      content: <>
        <Button borderRadius={100} width={200} mt={5} onPress={(e) => {
          onDone()
          navigation.navigate('Register')
        }}>Crear una Cuenta</Button>
        <Button borderRadius={100} width={200} mt={5} onPress={() => {
          console.log("onDone")
          onDone()
        }}>Iniciar Sesión</Button>
      </>
    },
    {
      key: 's2',
      title: 'Selección de Haciendas',
      subtitle: 'Buscamos los mejores predios para plantar y cultivar agave.',
      image: require("../../../assets/img/card1-farm.png"),
    },
    {
      key: 's3',
      title: 'Selección de Plantas',
      subtitle: 'Elegimos plantas de primera calidad para ofrecerte el mejor rendimiento posible',
      image: require("../../../assets/img/card2-plant.png"),
    },
    {
      key: 's4',
      title: 'Venta de plantas',
      subtitle: 'Despues de plantar el agave en las haciendas elegidas, ponemos en venta las plantas en nuestra plataforma y app móvil.',
      image: require("../../../assets/img/card3-sell.png"),
    },
    {
      key: 's5',
      title: 'Retorno de Capital',
      subtitle: 'Una vez el agave llega a su maduración en alguna de nuestras haciendas, lo vendemos a las tequileras y hacemos retornos de capital.',
      image: require("../../../assets/img/card4-return.png"),
    },
  ]

  const toast = useToast();
  const setUser = useContext(SetUser)

  const [text, setText] = useState("")
  const [pass, setPass] = useState("")
  const [showPass, setShowPass] = useState(false)

  const [intro, setIntro] = useState(false)
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getIntroStatus()
    getUserLogged()
  }, [])


  const getIntroStatus = () => {
    AsyncStorage.getItem('@intro_status')
      .then(status => {
        setIntro((status == null))
      })
      .catch(error => {
        console.log("e", error)
      })
  }

  const getUserLogged = () => {
    setLoading(true)
    axios.get('/user/logged', {
      params: {
        cliente: true
      },
      withCredentials: true
    })
      .then(({ data }) => {
        console.log("A", data)
        setUser(data.data)
        switch (data.data.status) {
          case 0:
            // message.error("No es posible iniciar sesión")
            break;
          case 1:
            navigation.navigate("Admin")
            break;
          case 2:
            navigation.navigate("UserInformation")
            break;
          case 3:
            navigation.navigate("Address")
            break;
          default:
            navigation.navigate("Admin") 
        }
      })
      .catch((error) => {

        console.log("error", error)
        // navigationRef.navigate("SignIn")
      })
      .finally(() => setLoading(false))
  }


  const onDone = () => {
    console.log("A")
    AsyncStorage.setItem('@intro_status', String(true))
      .then(status => {
        setIntro(false)
      })
      .catch(error => {
        console.log("e", error)
      })
  }


  const onFinish = () => {
    setLoading(true)
    axios.post('/login', { email: text, password: pass, keep_session: true }, { withCredentials: true })
      .then(async ({ data, headers }) => {
        await AsyncStorage.setItem('@token', headers.authorization)
        axios.defaults.headers.common['Authorization'] = headers.authorization
        setUser(data)

        console.log("data.user.status",)
        switch (data.user.status) {
          case 0:
            // message.error("No es posible iniciar sesión")
            break;
          case 1:
            navigation.navigate("Admin")
            break;
          case 2:
            navigation.navigate("UserInformation")
            break;
          case 3:
            navigation.navigate("Address")
            break;
          default:
            navigation.navigate("Admin") 
        }
      })
      .catch(error => {
        toast.show({
          render: () => {
            return <Box bg="red.500" px="2" mx="4" py="1" rounded="sm" mb={5}>
              <Heading size="xs" color={"white"}>{error?.response?.data?.message ?? "El usuario o la contraseña no son correctos"}</Heading>
            </Box>
          }
        })
      })
      .finally(() => setLoading(false))

  }


  if (loading)
    return <Spinner flex={1} color="primary.900" size="lg" />


  if (intro)
    return <AppIntroSlider
      renderDoneButton={(e) => <Button variant={"link"} onPress={onDone}>Finalizar</Button>}
      activeDotStyle={{ backgroundColor: "green" }}
      data={slides}
      renderItem={({ item }) => (<Center flex={1} px="5" _light={{ bg: "white", }}>
        <Image alt={item.subtitle} source={item.image} resizeMethod="scale" resizeMode="contain" maxH={250} />
        <Heading mt={20}>{item.title}</Heading>
        <Text mt="5" fontWeight="bold" textAlign="center">{item.subtitle}</Text>
        <Text mt="5">{item.description}</Text>
        {item.content}
      </Center>)}
      onDone={onDone}
      showSkipButton={false}
      onSkip={onDone}
    />


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
                  Bienvenido
                </Text>
                <Text
                  fontSize="md"
                  fontWeight="normal"
                  _dark={{
                    color: "white.300",
                  }}
                >
                  Inicie sesión para continuar
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
              <Hidden till="md">
                <Text fontSize="lg" fontWeight="normal">
                  Sign in to continue!
                </Text>
              </Hidden>
              <VStack>
                <VStack space="3">
                  <VStack space={{ base: "7", md: "4", }}>
                    <Input
                      
                      value={text}
                      onChangeText={txt => setText(txt.toLocaleLowerCase().trim())}

                      autoCapitalize={false}
                      autoCorrect={false}
                      spellCheck={false}

                      isRequired
                      size="xl"
                      label="Email"
                      placeholder="Correo Electrónico"

                      _text={{ fontSize: "sm", fontWeight: "medium", }}
                    />
                    <Input
                      value={pass}
                      onChangeText={setPass}

                      size="xl"
                      isRequired
                      type={showPass ? "text" : "password"}
                      placeholder="Contraseña"
                      label="Password"
                      InputRightElement={
                        <IconButton
                          variant="unstyled"
                          icon={
                            <Icon
                              size="4"
                              color="coolGray.400"
                              as={Entypo}
                              name={showPass ? "eye-with-line" : "eye"}
                            />
                          }
                          onPress={() => setShowPass(!showPass)}
                        />
                      }
                      _text={{
                        fontSize: "sm",
                        fontWeight: "medium",
                      }}
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
                    onPress={() => navigation.navigate("RecoveryPassword")}
                  >
                    ¿Olvidó su contraseña?
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
                    Iniciar Sesión
                  </Button>
                  <Text textAlign={"center"}>¿No tienes cuenta? <Text color={"primary.900"} onPress={() => navigation.navigate("Credentials")}>Registrate</Text></Text>
                </VStack>
              </VStack>
            </VStack>
          </VStack>
        </Stack>
      </Center>
    </KeyboardAwareScrollView>
  </>
}