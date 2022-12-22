import React, { useState, } from "react";

import { Dimensions,  } from "react-native"
import {
  Avatar,
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
  // Icon,
  Pressable,
  Center,
  Hidden,
  StatusBar,
  Stack,
  Box,
  Input,
  InputGroup,
  InputLeftAddon,
  InputRightAddon,
  Icon,
  
} from "native-base";

import Carousel from 'react-native-reanimated-carousel/src/index'

import Header from "../Header"
import { SafeAreaView } from "react-native-safe-area-context";

import Feather from "react-native-vector-icons/Feather";

export default function SignIn(props) {

  const width = Dimensions.get('window').width;
  const height = Dimensions.get('window').height;

  return (
    <Box
      colorScheme="primary"
      my="auto"
      variant="layout"
      flex="1"
    >
      <SafeAreaView style={{ flex: 1 }} >
        <Header />
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

          <VStack px="4" mt="4" mb="5" space="9">
            <VStack space="2">
              <Text fontSize="3xl" fontWeight="bold" color="coolGray.50">
                Hey, Alberto
              </Text>
            </VStack>
          </VStack>
          <VStack px="4" mt="4" mb="5" space="9">
            <HStack space="3">
              <Input flex={1} placeholder="Buscar" placeholderTextColor={"whiteOpacity.400"} bg="whiteOpacity.800" borderColor="whiteOpacity.400" color={"whiteOpacity.100"} />
              <IconButton icon={<Icon as={Feather} name="sliders" size="xl" color="white" />} bg="whiteOpacity.800" borderColor="whiteOpacity.400" borderWidth={1} borderRadius={8} />
            </HStack>
          </VStack>
          <Carousel
            loop
            onSnapToItem={() => console.log("X")}
            width={width / 5}
            height={height * 0.14}
            data={[...new Array(8).keys()]}
            style={{ width, }}
            defaultIndex={0}
            renderItem={({ index }) => (
              <Box px="2" flex="1">
                <Box
                  // bg={(index != 0) ? "whiteOpacity.800" : undefined}
                  {...(index != 0) ? {
                    bg: "whiteOpacity.800"
                  }: {
                    bg: {
                      linearGradient: {
                          colors: ['#A62E99', '#681FB0'],
                          start: { x: 0.5, y: 0.5 },
                          end: {x: 1, y: 0.5},
                      },
                  }
                  }}
                  flex={1}
                  borderRadius={100}
                  borderColor="whiteOpacity.400"
                  borderWidth={0.5}
                >
                  <Avatar
                    mx="auto"
                    mt={1}
                    width={55}
                    height={55}
                    bg="green.500"
                    source={{
                      uri: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
                    }}
                  />
                  <Text color="white" w="100%" textAlign="center" mt={4}>{(index == 0) ? "Todos" : index} </Text> 
                </Box>
              </Box>
            )}
          />
        </Stack>
      </SafeAreaView>
    </Box>
  );
}
