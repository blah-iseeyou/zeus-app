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
import { SafeAreaView } from "react-native-safe-area-context";

import AntDesign from "react-native-vector-icons/AntDesign";
import moment from "moment"

import axios from "../../../Axios"
import User from "../../../Contexts/User"

import Header from "../../Header"
import Reventa from "./Reventa";
// import Reventa from "./Reventa"


export default function Reventas(props) {
  const user = useContext(User)

  const [reventas, setReventas] = useState({
    data: [],
    page: 1,
    limit: 20,

    pages: 0,
    total: 0
  })

  const [reventaId, setReventaId] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getReventas()
  }, [])





  let getReventas = ({ page, limit, } = reventas) => {
    setLoading(true)
    axios.get('/customer/reventas', {
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

        console.log("response", response.data)
        setReventas({
          ...response.data,
          pages: response.data.totalPages
        })
      })
      .catch(error => {

      })
      .finally(() => setLoading(false))
  }

  /**
 * @param {*} estatus
 * @description Renderiza el Tag con el estatus de la reventas
 */
  const renderEstatusReventa = (estatus = 0) => {

    let steps = {
      0: <Text borderRadius={100} bg={"red.400"} color="white" px={3} right={-8}>Cancelada</Text>,
      1: <Text borderRadius={100} bg={"yellow.400"} color="white" px={3} right={-8}>En proceso</Text>,
      2: <Text borderRadius={100} bg={"green.500"} color="white" px={3} right={-8}>Vendida</Text>,
      4: <Text borderRadius={100} bg={"blue.400"} color="white" px={3} right={-8}>Requiere Modificación</Text>,
    }

    return estatus != undefined ? steps[estatus] : 'N/A'

  }

  return (
    <Box variant={"layout"} flex="1"  >
      <SafeAreaView flex={1}>
        <Header />
        <ScrollView
          flex={1}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={() => getReventas({ page: 1 })} />}>
          <Box mx={5} mt={4}>
            <Heading fontSize="lg">Reventas</Heading>
            <Heading fontSize="sm">Lista de Reventas Realizadas</Heading>
          </Box>
          {/* {loading ? <Spinner mt={20} size="lg" /> : null} */}
          {reventas?.data?.map(({ _id, cantidad, folio, precio_reventa, moneda, estatus, hacienda_id, createdAt }) => (<Pressable key={_id} flex={1} onPress={() => setReventaId(_id)}>
            {({
              isPressed
            }) => <Box flex={1} bg={isPressed ? "rgba(0,0,0,0.05)" : undefined}>
                <VStack mx={5} my={4} flex={1}>
                  <HStack justifyContent={"space-between"}>
                    <Text><Text fontStyle="italic" fontSize={"xs"}>{folio}</Text>  - {cantidad} planta{(cantidad > 1) ? "s" : ""}</Text>
                    <Text >{precio_reventa?.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} {moneda} </Text>
                  </HStack>
                  <HStack justifyContent={"space-between"} mt={1}>
                    <Text fontSize={12}>{hacienda_id?.nombre}</Text>
                    <HStack>
                      <Text fontSize={10} top={1}>{moment(createdAt).format("YYYY-MM-DD")}</Text>
                      {renderEstatusReventa(estatus)}
                    </HStack>
                  </HStack>
                </VStack>
              </Box>}
          </Pressable>))}
          {(reventas.pages > 0) ? <>
            <Button.Group isAttached mx={{ base: "auto" }} size="sm">
              <Button style={{ opacity: reventas.hasPrevPage ? undefined : 0.5 }} onPress={() => getReventas({ page: reventas.prevPage })} startIcon={<Icon as={AntDesign} name="left"></Icon>}>Anterior</Button>
              <Button style={{ opacity: reventas.hasNextPage ? undefined : 0.5 }} onPress={() => getReventas({ page: reventas.nextPage })} endIcon={<Icon as={AntDesign} name="right"></Icon>}>Siguiente</Button>
            </Button.Group>
            <Text textAlign={"center"} mt={3}>Página {reventas.page} de {reventas.pages}</Text>
          </> : null}

        </ScrollView>
      </SafeAreaView>

      <Reventa
        reventa_id={reventaId}
        onClose={() => setReventaId(null)}
      />
    </Box>
  );
}
