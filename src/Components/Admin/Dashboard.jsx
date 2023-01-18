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
  Pressable
} from "native-base";
import Carousel from 'react-native-reanimated-carousel/src/index'
import { SafeAreaView } from "react-native-safe-area-context";

import axios from "../../Axios"

import moment from "moment"
import Header from "../Header"
import User from "../../Contexts/User"
import Color from "color";

import Inversion from "../Admin/Inversiones/Inversion";



export default function SignIn({ navigation }) {
  const { width, height } = Dimensions.get('window')
  const user = useContext(User)

  const [montos, setMontos] = useState({})

  const [inversionId, setInversionId] = useState()

  const [inversiones, setInversiones] = useState({
    data: [],
    page: 1,
    limit: 20,

    pages: 0,
    total: 0
  })

  const [haciendas, setHaciendas] = useState({
    data: [],
    page: 1,
    limit: 20,

    pages: 0,
    total: 0
  })

  useEffect(() => {
    getClienteDetalles()
    getHaciendas()
    getInversiones()
  }, [])



  let getClienteDetalles = () => {
    axios.get('/customer/detalles')
      .then((response) => {
        setMontos({
          monto_total: response.data.monto_total,
          monto_total_dolar: response.data.monto_total_dolar,
          monto_pesos: response.data.monto_pesos,
          monto_dolar: response.data.monto_dolar,
          monto_pendiente_pesos: response.data.monto_pendiente_pesos,
          monto_pendiente_dolar: response.data.monto_pendient_dolar,
          plantas_vendidas: response.data.plantas_vendidas,
          monto_pagado_pesos: response.data.monto_pagado_pesos,
          monto_pagado_dolar: response.data.monto_pagado_dolar,
        })
      })
      .catch(error => {
        console.log("E", error)
      })
  }

  let getHaciendas = ({ page, limit } = haciendas) => {

    axios.get('/haciendas', {
      params: {
        page,
        limit
      }
    })
      .then(({ data }) => {
        setHaciendas(data.data)
      })
      .catch(error => {
        console.log("E", error)
      })
  }


  let getInversiones = ({ page, limit, } = inversiones) => {

    axios.get('/customer/inversiones', {
      params: {
        page,
        limit,
      }
    })
      .then(response => {
        // console.log("response", response.data.data);
        setInversiones(response.data.data)
        // this.setState({
        //   inversiones: {
        //     ...this.state.inversiones,
        //     data: response.data.data.data,
        //     page: response.data.data.page,
        //     limit: response.data.data.limit,
        //     total: response.data.data.total
        //   },
        // })
      })
      .catch(error => {
        // if (error.response.status === 403)
        //   message.error(error.response.data.message)
        // else
        //   message.error('Error al cargar las transacciones')
      })
    // .finally(() => this.setState({ loading: false }))
  }

  let renderMontoVendido = () => {
    const { monto_total, monto_total_dolar, monto_pesos, monto_dolar } = montos;

    let amountInPesos, amountInDollars;
    if (monto_pesos > 0) {
      amountInPesos = <>{monto_pesos?.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} <Text>MXN</Text></>
    }
    if (monto_dolar > 0) {
      amountInDollars = <>{monto_dolar?.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} <Text>USD</Text></>
    }

    if (!amountInPesos && !amountInDollars) return <Text ellipsis> $ 0 <Text>MXN</Text> </Text>;
    return <Text> {amountInPesos} {amountInPesos && amountInDollars ? " / " : ""} {amountInDollars}</Text>;
  }

  /**
 * @param {*} estatus
 * @description Renderiza el Tag con el estatus de la inversion
 */
  const renderEstatusInversion = (estatus = 0) => {

    let steps = {
      0: <Text borderRadius={100} bg={"red.400"} color="white" px={3} right={-8}>Cancelada</Text>,
      1: <Text borderRadius={100} bg={"yellow.400"} color="white" px={3} right={-8}>Pendiente</Text>,
      2: <Text borderRadius={100} bg={"green.500"} color="white" px={3} right={-8}>Pagada</Text>,
      3: <Text borderRadius={100} bg={"gray.400"} px={3} right={-8}>Ejecutada</Text>,
      4: <Text borderRadius={100} bg={"red.400"} color="white" px={3} right={-8}>Revendida</Text>,
    }

    return estatus != undefined ? steps[estatus] : 'N/A'

  }

  return (
    <Box variant={"layout"} flex="1"  >
      <SafeAreaView flex={1}>
        <Header />
        <ScrollView flex={1}>
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
                <Text fontSize="lg" fontWeight="bold">
                  Bienvenido, {user?.nombre} {user?.apellido_paterno}
                </Text>
              </VStack>
            </VStack>
            <VStack px="4" mb="5" space="9">
              <VStack space="3" bg={"primary.900"} px={5} py={5} shadow={2} borderRadius={16}>
                <HStack justifyContent="space-between">
                  <Heading size="sm" color="white" fontWeight="light">Tu Actual Invertido</Heading>
                  <Button variant="subtle" background="white">Invertir Ahora</Button>
                </HStack>
                <Heading textAlign="center" color="white">{renderMontoVendido()}</Heading>
              </VStack>
            </VStack>
            <Carousel
              // panGestureHandlerProps={{ activeOffsetXStart: 20 }}
              loop
              width={width / 1.5}
              height={height * 0.20}
              // defaultScrollOffsetValue={250}
              data={haciendas.data}
              style={{ width, marginLeft: 12 }}
              defaultIndex={0}
              renderItem={({ index, item }) => (
                <Pressable flex="1" onPress={() => navigation.navigate("Hacienda", { hacienda_id: item?._id })} >
                  <Box px="1" flex="1" borderRadius={16}>
                    <Box bg={{
                      linearGradient: {
                        colors: [Color(item.color).darken(0.2).hex(), item.color],
                        start: [0, 0],
                        end: [1, 0]
                      }
                    }} borderRadius={10} flex={1} width={"100%"}>
                      <VStack p={2}>
                        <Heading size={"sm"} color="white">{item.nombre}</Heading>
                        <Text color="white">{item.descripcion}</Text>
                      </VStack>
                      <Image alt={"Zeus Oro azul de los altos"} source={require("../../../assets/img/ZeusAgave.png")} resizeMode="contain" h={"20"} opacity={0.2} right={-85} bottom={0} />
                    </Box>
                  </Box>
                </Pressable>
              )}
            />
          </Stack>
          <Box mx={5} mt={4}>
            <Heading fontSize="lg">Ultimas Inversiones</Heading>
          </Box>
          {inversiones.data.map(({ _id, cantidad, monto_pagado, monto, estatus, hacienda_id, createdAt }) => <Pressable flex={1} onPress={()=>setInversionId(_id)}>

            <VStack key={_id} mx={5} my={4}>
              <HStack justifyContent={"space-between"}>
                <Text>Comprada {cantidad} planta{(cantidad > 1) ? "s" : ""}</Text>
                <Text >{monto_pagado?.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} / {monto?.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} </Text>
              </HStack>
              <HStack justifyContent={"space-between"} mt={1}>
                <Text fontSize={12}>{hacienda_id?.nombre}</Text>
                <HStack>
                  <Text fontSize={10} top={1}>{moment(createdAt).format("YYYY-MM-DD")}</Text>
                  {renderEstatusInversion(estatus)}
                </HStack>
              </HStack>
            </VStack>
          </Pressable>)}
        </ScrollView>

      </SafeAreaView>
      <Inversion
        inversion_id={inversionId}
        onClose={() => setInversionId(null)}
      />

    </Box>
  );
}
