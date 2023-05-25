import React, {
    useContext,
    useEffect,
    useState,
    useCallback,
    useMemo,
    useRef
} from "react";
import { Dimensions, View, StyleSheet} from "react-native"
import {
    HStack,
    VStack,
    Text,
    Box,
    Heading,
    Icon,
    FlatList,
    Spacer,
    Pressable,
    Button,
    Modal
} from "native-base";
import AntDesign from "react-native-vector-icons/AntDesign";
import moment from "moment"

import BottomSheet from '@gorhom/bottom-sheet';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { SafeAreaView } from "react-native-safe-area-context";

import axios from "../../../../Axios"
import Header from "../../../Header"
import { SetUser, User } from "../../../../Contexts/User"
import BottomSheetBeneficiario from './BottomSheetBeneficiario';

export default function SignIn({ route, navigation }) {
    const [beneficiarios, setBeneficiarios] = useState({
        data: [],
        page: 1,
        limit: 20,

        pages: 0,
        total: 0
    })

    const [beneficiario_id, setBeneficiarioId] = useState(null)

    useEffect(() => {
        getBeneficiarios()
    }, [])

    const getBeneficiarios = ({ page, limit } = beneficiarios) => {
        setBeneficiarios({ ...beneficiarios, page, limit })
        axios.get('/customer/beneficiarios', {
            params: {
                page, limit
            }
        })
            .then(({ data }) => {
                setBeneficiarios({
                    ...beneficiarios,
                    ...data
                })
            })
            .catch(error => {
                // message.error('Ocurrio un error al cargar datos')
            })
    }


    const deleteBeneficiario = (beneficiario_id) => {

        console.log('beneficiario_id', beneficiario_id);
        // return 
        axios.delete('/beneficiario/delete', {
            params: {
                beneficiario_id
            }
        })
            .then(({ data }) => {
                getBeneficiarios()
            })
            .catch(error => {
                // message.error('Ocurrio un error al cargar datos')
            })
    }

    return (
        <Box variant={"layout"} flex="1"  >
            <SafeAreaView flex={1}>
                <Header />
                <HStack justifyContent="space-between" p="4" pb="3">
                    <Heading fontSize="xl">
                        Beneficiarios
                    </Heading>
                    <Button w={10} h={10} borderRadius={100} onPress={() => setBeneficiarioId(true)}>+</Button>
                </HStack>
                <FlatList
                    data={beneficiarios.data}
                    _contentContainerStyle={{
                        marginX: 5
                    }}
                    renderItem={({ item }) => <Box  key={item?._id} borderBottomWidth="1" _dark={{ borderColor: "coolGray.500" }} borderColor="coolGray.300" pl={["0", "4"]} pr={["0", "5"]} mt="3">
                        <HStack space={[2, 3]} justifyContent="space-between" mb={1}>
                            <VStack flex={1}>
                                <Text _dark={{ color: "warmGray.50" }} color="coolGray.800" bold>{item.nombre}</Text>
                                <Text color="coolGray.600" _dark={{ color: "warmGray.200" }}>{item.cuenta} {item.banco} </Text>
                            </VStack>
                            <HStack>
                                <Button size="sm" leftIcon={<Icon as={AntDesign} name="edit" />} mr={1} onPress={() => setBeneficiarioId(item?._id)} />
                                <Button onPress={() => deleteBeneficiario(item?._id)} size="sm" bg="danger.500" leftIcon={<Icon as={AntDesign} name="delete" />} />
                            </HStack>
                        </HStack>
                    </Box>}
                    keyExtractor={item => item.id}
                />
            </SafeAreaView>

            <BottomSheetBeneficiario 
                beneficiario_id={beneficiario_id}
                onClose={() => {
                    setBeneficiarioId(null)
                    getBeneficiarios({page: 1})
                }}
            />
        </Box>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 24,
      backgroundColor: 'grey',
    },
    contentContainer: {
      flex: 1,
      alignItems: 'center',
    },
  })