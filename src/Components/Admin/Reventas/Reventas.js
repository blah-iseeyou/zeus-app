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
  AlertDialog
} from "native-base";
import { SafeAreaView } from "react-native-safe-area-context";

import AntDesign from "react-native-vector-icons/AntDesign";
import moment from "moment"
import Decimal from "decimal.js"

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

  const [isOpen, setIsOpen] = React.useState(false);

  const [isOpenReventa, setIsOpenReventa] = React.useState(false);

  const onClose = () => setIsOpen(false);
  const cancelRef = React.useRef(null);

  const [deleteReventaItem, setDeleteReventa] = React.useState(false);

  useEffect(() => {
    getReventas()
  }, [])


  const deleteReventa = () => {
    axios.delete('/reventa', { params: { id: deleteReventaItem._id } })
      .then((response) => {
        return toast.show({
          duration: 1000,
          render: () => {
            return <Box bg="red.500" px="2" py="1" rounded="sm" mb={5}>Reventa Eliminada</Box>;
          },
          top: 10
        })
      })
      .catch(error => {
        console.log('NO SE PUDO CARGAR', error);
        return toast.show({
          duration: 2500,
          render: () => {
            return <Box bg="red.500" px="2" py="1" rounded="sm" mb={5}>No fue posible obtener las reventas</Box>;
          },
          top: 10
        })
      })
      .finally(e => getReventas())
  }



  let getReventas = ({ page, limit, } = reventas) => {
    setLoading(true)
    console.log("PRINTING")
    setReventas({
      ...reventas,
      data: []
    })    
    axios.get('/customer/reventas', {
      params: {
        page,
        limit,
      }
    })
      .then(response => {
        setReventas({
          ...response.data,
          pages: response.data.totalPages
        })
      })
      .catch(error => {
        console.log(error)
      })
      .finally(() => setLoading(false))
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
          {(reventas.total < 1) ? <Box textAlign="center" w="100%" px={5} py={3}>
            No hay Reventas Registradas
          </Box> : null}
          {/* {loading ? <Spinner mt={20} size="lg" /> : null} */}
          {reventas.data?.map((item) => <VStack mt={3} mb={1} px={3} py={3} borderBottomColor="gray.200" borderBottomWidth={1}>
            <HStack justifyContent={"space-between"}>
              <Text>{moment(item.fecha).format('DD-MM-YYYY')}</Text>
              <Text>{item.cantidad_vendida} / {item.cantidad} planta{item.cantidad > 1 && 's'}</Text>
            </HStack>
            <HStack justifyContent={"space-between"} mt={1}>
              <Text fontSize={12}>{item.cantidad ?? 0} en total</Text>
              <Text fontSize={12}>{item.cantidad_restante ?? 0} para reventa</Text>
              <Text fontSize={12}>{item.cantidad_vendida ?? 0} vendidas</Text>
            </HStack>
            <HStack justifyContent={"space-between"} mt={1}>
              <Text fontSize={12}>
                Costo por Planta: ${
                  Decimal(item.precio_reventa).toFixed(2).toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  })
                }
              </Text>
              <Text fontSize={12}>
                Total: ${
                  Decimal(item.precio_reventa).mul(item.cantidad).toFixed(2).toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  })
                }
              </Text>
            </HStack>
            <HStack justifyContent={"center"} size={2} space={2} mt={2}>
              <Button size={'sm'} onPress={() => {
                console.log("TESTING")
                setIsOpenReventa(true)
                setReventaId(item._id)
              }}>Editar</Button>
              <Button
                size={'sm'}
                background={'red.500'}
                isDisabled={item.cantidad_vendida > 0}
                onPress={() => {
                  setIsOpen(true)
                  setDeleteReventa(item)
                }}
              >Eliminar</Button>
            </HStack>
          </VStack>)}
          {(reventas.pages > 0) ? <>
            <Button.Group isAttached mx={{ base: "auto" }} size="sm" mt={3}>
              <Button style={{ opacity: reventas.hasPrevPage ? undefined : 0.5 }} onPress={() => getReventas({ page: reventas.prevPage })} startIcon={<Icon as={AntDesign} name="left"></Icon>}>Anterior</Button>
              <Button style={{ opacity: reventas.hasNextPage ? undefined : 0.5 }} onPress={() => getReventas({ page: reventas.nextPage })} endIcon={<Icon as={AntDesign} name="right"></Icon>}>Siguiente</Button>
            </Button.Group>
            <Text textAlign={"center"} mt={3}>Página {reventas.page} de {reventas.pages}</Text>
          </> : null}
        </ScrollView>
      </SafeAreaView>
      <Reventa
        reventa_id={reventaId}
        onClose={() => {
          setReventaId(null)
          getReventas()
        }}
      />
      <AlertDialog
        leastDestructiveRef={cancelRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <AlertDialog.Content>
          <AlertDialog.CloseButton />
          <AlertDialog.Header>Elimina Reventa</AlertDialog.Header>
          <AlertDialog.Body>
            ¿Deseas eliminar esta reventa?
          </AlertDialog.Body>
          <AlertDialog.Footer>
            <Button.Group space={2}>
              <Button variant="unstyled" colorScheme="coolGray"
                onPress={onClose} ref={cancelRef}
              >
                Cancelar
              </Button>
              <Button
                colorScheme="danger" onPress={() => {
                  setIsOpen(false)
                  deleteReventa()
                }}
              >Eliminar</Button>
            </Button.Group>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>

      <Reventa
        isOpen={isOpenReventa}
        reventa_id={reventaId}
        onClose={() => {

          setIsOpenReventa(false)
          setReventaId(null)
          getReventas()
          // if (reventasRef.current)
          //   reventasRef.current.getReventas();

        }}
      />
    </Box>
  );
}
