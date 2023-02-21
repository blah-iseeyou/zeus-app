import React, { useContext, useEffect, useState, } from "react";
import { Dimensions, RefreshControl, } from "react-native"
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
import Inversion from "./Inversion"


export default function SignIn(props) {
  const user = useContext(User)

  const [inversiones, setInversiones] = useState({
    data: [],
    page: 1,
    limit: 20,

    pages: 0,
    total: 0
  })

  const [inversionId, setInversionId] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getInversiones()
  }, [])





  let getInversiones = ({ page, limit, } = inversiones) => {
    setLoading(true)
    axios.get('/customer/inversiones', {
      params: {
        page,
        limit,
      }
    })
      .then(response => {

        /*
        "hasNextPage": true,
        "hasPrevPage": false,
        "limit": 20, "nextPage": 2, 
        "page": 1, "pagingCounter": 1, "prevPage": null, 
        "total": 39, 
        "totalPages": 2} */

        console.log("response",)
        setInversiones({
          ...response.data.data,
          pages: response.data.data.totalPages
        })
      })
      .catch(error => {

      })
      .finally(() => setLoading(false))
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
        <ScrollView
          flex={1}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={() => getInversiones({ page: 1 })} />}>
          <Box mx={5} mt={4}>
            <Heading fontSize="lg">Inversiones</Heading>
            <Heading fontSize="sm">Lista de Inversiones Realizadas</Heading>
          </Box>
          {/* {loading ? <Spinner mt={20} size="lg" /> : null} */}
          {inversiones.data.map(({ _id, cantidad, folio, monto_pagado, monto, estatus, hacienda_id, createdAt }) => (<Pressable key={_id} flex={1} onPress={() => setInversionId(_id)}>
            {({
              isPressed
            }) => <Box flex={1} bg={isPressed ? "rgba(0,0,0,0.05)" : undefined}>
                <VStack mx={5} my={4} flex={1}>
                  <HStack justifyContent={"space-between"}>
                    <Text><Text fontStyle="italic" fontSize={"xs"}>{folio}</Text>  - {cantidad} planta{(cantidad > 1) ? "s" : ""}</Text>
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
              </Box>}
          </Pressable>))}
          {(inversiones.pages > 0) ? <>
            <Button.Group isAttached mx={{ base: "auto", md: 0 }} size="sm">
              <Button style={{ opacity: inversiones.hasPrevPage ? undefined : 0.5 }} onPress={() => getInversiones({ page: inversiones.prevPage })} startIcon={<Icon as={AntDesign} name="left"></Icon>}>Anterior</Button>
              <Button style={{ opacity: inversiones.hasNextPage ? undefined : 0.5 }} onPress={() => getInversiones({ page: inversiones.nextPage })} endIcon={<Icon as={AntDesign} name="right"></Icon>}>Siguiente</Button>
            </Button.Group>
            <Text textAlign={"center"} mt={3}>Página {inversiones.page} de {inversiones.pages}</Text>
          </> : null}

        </ScrollView>
      </SafeAreaView>

      <Inversion
        inversion_id={inversionId}
        onClose={() => setInversionId(null)}
      />
    </Box>
  );
}
