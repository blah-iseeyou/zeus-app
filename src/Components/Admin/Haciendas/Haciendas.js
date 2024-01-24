import React, { useContext, useEffect, useState, } from "react";
import { Dimensions, } from "react-native"
import {
  HStack,
  VStack,
  Text,
  Stack,
  Box,
  ScrollView,
  Heading,
  Button,
  Image,
  Icon,
  Pressable,
  Spinner
} from "native-base";
import Carousel from 'react-native-reanimated-carousel/src/index'
import { SafeAreaView } from "react-native-safe-area-context";

import Color from "color";
import AntDesign from "react-native-vector-icons/AntDesign";
import moment from "moment"

import axios from "../../../Axios"
import User from "../../../Contexts/User"

import Header from "../../Header"

import SoldOut from "../../../../assets/icons/SoldOut"


export default function SignIn({ navigation }) {
  const user = useContext(User)

  const [haciendas, setHaciendas] = useState({
    data: [],
    page: 1,
    limit: 20,

    pages: 0,
    total: 0,
    loading: false
  })


  //Información del Contrato

  useEffect(() => {
    getHaciendas()
  }, [])

  let getHaciendas = ({ page, limit, } = haciendas) => {

    setHaciendas({...haciendas, page, limit, loading: true})
    axios.get('/haciendas', {
      params: {
        page,
        limit,
      }
    })
      .then(response => {
        console.log("response.data.data.data",)
        // setHaciendas(response.data.data)
        setHaciendas({...response.data.data, loading: false})
      })
      .catch(error => {
        setHaciendas({...haciendas, page, limit, loading: false})

      })
  }

  return (
    <Box variant={"layout"} flex="1"  >
      <SafeAreaView flex={1}>
        <Header />
        <ScrollView flex={1}>
          <Box mx={5} mt={4}>
            <Heading fontSize="lg">Haciendas</Heading>
            <Heading fontSize="sm">Lista de Haciendas</Heading>
          </Box>
          <Box flexDir={"row"} flexWrap="wrap">
            {haciendas.loading ? <Spinner mx="auto" size="lg" /> : null}
            {haciendas.data.map((item) => (<Pressable key={item._id} onPress={() => navigation.navigate("Hacienda", {hacienda_id: item._id })} w="50%" minH={"200"}>
              {({
                isPressed
              }) => <Box borderRadius={16} flex={1} p={2}>
                  <Box bg={{
                    linearGradient: {
                      colors: [Color(item.color).darken(0.2).hex(), item.color],
                      start: [0, 0],
                      end: [1, 0]
                    }
                  }} borderRadius={10} flex={1}>
                    <VStack p={2}>
                      <Heading size={"sm"} color="white">{item.nombre}</Heading>
                      <Text color="white">{item.descripcion}</Text>
                    </VStack>
                    <Image alt={"Zeus Oro azul de los altos"} source={require("../../../../assets/img/ZeusAgave.png")} resizeMode="contain" h={"20"} opacity={0.2} right={-52} bottom={0} />
                  </Box>
                  {
                      (item.disponible <= 0 || item.estatus == 3) && <SoldOut
                        style={{
                          position: "absolute",
                          right: 10,
                          top: 0,
                          maxWidth: "100%"
                        }}
                        width="100%"
                      />
                    }
                </Box>
                }
            </Pressable>))}
          </Box>
        </ScrollView>
      </SafeAreaView>
      {(haciendas.pages > 0) ? <Button.Group isAttached mx={{ base: "auto", md: 0 }} size="sm">
        <Button startIcon={<Icon as={AntDesign} name="left"></Icon>}>Anterior</Button>
        <Button endIcon={<Icon as={AntDesign} name="right"></Icon>}>Siguiente</Button>
      </Button.Group> : null}
    </Box>
  );
}
