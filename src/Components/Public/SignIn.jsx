import React, { useState } from "react";
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
  Box, Input
} from "native-base";
import AntDesign from "react-native-vector-icons/AntDesign";
import Entypo from "react-native-vector-icons/Entypo";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
export function SignInForm({ props }) {

  const [text, setText] = useState("");
  const [pass, setPass] = useState("");
  const [showPass, setShowPass] = React.useState(false);

  return  <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1 }} style={{ flex: 1}}>
    <VStack flex="1" px="6" py="9" space="3" justifyContent="space-between"
        _light={{ bg: "white", }}
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
              <Checkbox
                alignItems="flex-start"
                mt="5"
                isChecked
                value="demo"
                colorScheme="primary"
                accessibilityLabel="Remember me"
              >
                <Text
                  pl="3"
                  fontWeight="normal"
                  _light={{
                    color: "coolGray.800",
                  }}
                  _dark={{
                    color: "coolGray.400",
                  }}
                >
                  Mantener mi sesión activa
                </Text>
              </Checkbox>
              <Button
                mt="5"
                size="md"

                _text={{
                  fontWeight: "medium",
                }}
                // _light={{
                //   bg: "primary.900",
                // }}
                // _dark={{
                //   bg: "primary.700",
                // }}
                onPress={() => {
                  props.navigation.navigate("Admin");
                }}
              >
                INICIAR SESIÓN
              </Button>
            </VStack>
          </VStack>
        </VStack>
      </VStack>
  </KeyboardAwareScrollView>
  
}
export default function SignIn(props) {
  return (
    <>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <Box
        safeAreaTop
        _light={{
          bg: "primary.900",
        }}
        _dark={{
          bg: "coolGray.900",
        }}
      />
      <Center
        colorScheme="primary"
        my="auto"
        variant="linear-gradient"
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
              <HStack space="2" alignItems="center">
                {/* <IconButton
                  variant="unstyled"
                  pl="0"
                  onPress={() => { }}
                  icon={
                    <Icon
                      size="6"
                      as={AntDesign}
                      name="arrowleft"
                      color="coolGray.50"
                    />
                  }
                /> */}
                {/* <Text color="coolGray.50" fontSize="lg">
                  Sign In
                </Text> */}
              </HStack>
              <VStack space="2">
                <Text fontSize="3xl" fontWeight="bold" color="coolGray.50">
                  Bienvenido
                </Text>
                <Text
                  fontSize="md"
                  fontWeight="normal"
                  _dark={{
                    color: "white.300",
                  }}
                  _light={{
                    color: "coolGray.50",
                  }}
                >
                  Inicie sesión para coninutar
                </Text>
              </VStack>
            </VStack>
          </Hidden>
          
          <SignInForm props={props} />
        </Stack>
      </Center>
    </>
  );
}