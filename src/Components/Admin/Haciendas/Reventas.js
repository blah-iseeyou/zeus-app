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
  Spinner,
  useToast
} from "native-base";

import AntDesign from "react-native-vector-icons/AntDesign";
import moment from "moment"

import axios from "../../../Axios"
import User from "../../../Contexts/User"
import ModalInversion from "../Comprar/ModalInversion";


export default function Reventas(props) {
  const user = useContext(User)

  const [reventas, setReventas] = useState({
    data: [],
    page: 1,
    limit: 20,

    pages: 0,
    total: 0
  })

  const toast = useToast()
  const [reventaId, setReventaId] = useState(null)
  const [loading, setLoading] = useState(false)

  const [visibleInversion, setVisibleInversion] = useState(false)


  useEffect(() => {
    if (props.hacienda_id) getReventas()
  }, [props.hacienda_id])


  let getReventas = ({ page, limit, } = reventas) => {
    setLoading(true)
    axios.get('/customer/reventas', {
      params: {
        page,
        limit,
        hacienda_id: props.hacienda_id
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
      3: <Text borderRadius={100} bg={"blue.400"} color="white" px={3} right={-8}>Requiere Modificación</Text>,
    }

    return estatus != undefined ? steps[estatus] : 'N/A'

  }

  return (
    <>
      <HStack mx={5} mt={4} justifyContent={"center"}>
        <Heading fontSize="lg" marginBottom={4}>Disponibles de otros clientes</Heading>
      </HStack>
      {reventas?.data?.map(({ _id, cantidad, folio, precio_reventa, moneda, estatus, cliente_name, hacienda_id, createdAt, usuario_id, ...data }) => (
        <Box flex={1} style={{ backgroundColor: "white", borderRadius: 12, marginBottom: 12, paddingLeft: 8, paddingRight: 8 }}>
          <VStack my={4} flex={1}>
            <HStack justifyContent={"center"}>
              <Text>{cliente_name} {estatus === 2 ? "vendió" : "vende"} {cantidad} Planta(s)</Text>
            </HStack>
            <HStack justifyContent={"space-between"} mt={2}>
              <VStack justifyContent={"center"} flex={1} alignContent={"center"}>
                <HStack justifyContent={"center"}>
                  <Text fontSize="xs">{precio_reventa?.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} {moneda} </Text>
                </HStack>
              </VStack>
              <VStack justifyContent={"center"} flex={1} alignContent={"center"}>
                <HStack justifyContent={"center"}>
                  <Text fontSize="xs">{moment(createdAt).format("YYYY-MM-DD")}</Text>
                </HStack>
              </VStack>
              <HStack>
                <Button
                  isDisabled={estatus !== 1 || user?._id == usuario_id}
                  onPress={() => {
                    if (estatus !== 1 || user?._id == usuario_id) {
                      return toast.show({
                        duration: 2500,
                        render: () => {
                          return <Box bg="blue.500" px="2" py="1" rounded="sm" mb={5}>No es posible invertir en esta reventa</Box>;
                        },
                        top: 10
                      })
                    }
                    setReventaId(_id)
                    setVisibleInversion(true)
                  }}

                  borderWidth="2" background="white" _text={{ color: "black", fontSize: "xs" }}>
                  <HStack>
                    <Icon as={AntDesign} name="shoppingcart"></Icon>
                    <Text
                      fontSize={"xs"}
                      ml={2}>
                      COMPRAR
                    </Text>
                  </HStack>
                </Button>
              </HStack>
            </HStack>
          </VStack>
        </Box>
        // <Pressable
        //   key={_id}
        //   flex={1}
        // 
        // >
        //   {({ isPressed }) => }
        // </Pressable>
      ))}
      {(reventas.pages > 0) ? <>
        <Button.Group isAttached size="sm">
          <Button style={{ opacity: reventas.hasPrevPage ? undefined : 0.5 }} onPress={() => getReventas({ page: reventas.prevPage })} startIcon={<Icon as={AntDesign} name="left"></Icon>}>Anterior</Button>
          <Button style={{ opacity: reventas.hasNextPage ? undefined : 0.5 }} onPress={() => getReventas({ page: reventas.nextPage })} endIcon={<Icon as={AntDesign} name="right"></Icon>}>Siguiente</Button>
        </Button.Group>
        <Text textAlign={"center"} mt={3}>Página {reventas.page} de {reventas.pages}</Text>
      </> : null}
      <ModalInversion
        isOpen={visibleInversion}
        reventa_id={reventaId}
        hacienda_id={props.hacienda_id}
        
        onClose={() => {
          setReventaId(undefined)
          getReventas()
          setVisibleInversion(false)
        }}
      />
    </>
  );
}
