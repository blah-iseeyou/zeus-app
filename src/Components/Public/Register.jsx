import React, { useEffect, useState } from "react";
import {
  Button,
  HStack,
  VStack,
  Text,
  Link,
  Checkbox,
  Divider,
  Image,
  useColorModeValue,
  IconButton,
  Icon,
  Pressable,
  Center,
  Hidden,
  StatusBar,
  Stack,
  Box, Input, Layout, Heading,

} from "native-base";
import AntDesign from "react-native-vector-icons/AntDesign";
import Entypo from "react-native-vector-icons/Entypo";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import AppIntroSlider from 'react-native-app-intro-slider';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SignInForm({ navigation }) {
    const [text, setText] = useState("");
    const [pass, setPass] = useState("");
    const [showPass, setShowPass] = React.useState(false);



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
              <Image alt="Zeus Oro Azu de los Altos" source={require("../../../assets/img/LogoZeuesOADLAH.png")} resizeMode="contain" h={"20"} />
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
                // _light={{
                //   color: "coolGray.50",
                // }}
                >
                  Inicie sesión para coninutar
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
                      isRequired
                      size="xl"
                      label="Email"
                      placeholder="Correo Electrónico"

                      defaultValue={text}
                      onChangeText={(txt) => setText(txt)}
                      _text={{ fontSize: "sm", fontWeight: "medium", }}
                    />
                    <Input
                      size="xl"
                      isRequired
                      type={showPass ? "text" : "password"}
                      placeholder="Contraseña"
                      label="Password"

                      defaultValue={pass}
                      onChangeText={(txt) => setPass(txt)}
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
                  >
                    ¿Olvidó su contraseña?
                  </Link>
               
                  <Button
                    mt="5"
                    size="md"

                    _text={{
                      fontWeight: "medium",
                    }}
                    onPress={() => {
                      navigation.navigate("Admin");
                    }}
                    borderRadius={300}
                  >
                    Iniciar Sesión
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