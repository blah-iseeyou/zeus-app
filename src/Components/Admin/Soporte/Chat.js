import React, { useContext, useEffect, useState } from "react";
import { Dimensions, View } from "react-native";
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
  Input,
  Button,
} from "native-base";
import AntDesign from "react-native-vector-icons/AntDesign";
import moment from "moment";
import axios from "../../../Axios";
import Header from "../../Header";
import { SetUser, User } from "../../../Contexts/User";
import SocketContext, { SetSocketContext } from "../../../Contexts/Socket";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Chat({ route, navigation }) {
  const user = useContext(User);
  const socket = useContext(SocketContext);
  let [chat, setChat] = useState({
    page: 1,
    limit: 20,
    data: []
  },);

  let flatListRef = React.createRef();

  useEffect(() => {

  }, []);

  useEffect(() => {
    console.log("socket", socket)

    IO_connect(user?.cliente?._id);
    socket.on('connect', IO_connect)
    socket.on('sucessful', IO_loadMessages)



  }, [socket]);

  useEffect(() => {
    return () => {
      console.log("desconectando socket")
      socket.emit('/admin/cliente/leave', user?.cliente?._id);
    }
  }, []);

  const IO_connect = async (id) => {
    console.log('conectando a socket ora si', id)
    socket.emit("/admin/cliente/join", id);
  };

  const IO_error = (err) => {
    console.log("error", err);
  };

  const IO_loadMessages = (res => {

    console.log("res", res)



    let old = chat
    let data = (res.page == 1) ? res.data : [...res.data, ...old.data]

    let new_conversacion = {
      data: data,
      page: res.page,
      limit: res.limit,
      total: res.total
    }

    setChat(new_conversacion)
  })

  return (

    <Box variant={"layout"} flex="1">
      <SafeAreaView flex={1}>
        <Header />
        <Box style={{height:"50%"}}>
          <Heading fontSize="xl" p="4" pb="3">
            Chat de Soporte
          </Heading>
          <FlatList
            ref={flatListRef}
            data={chat.data}
            onContentSizeChange={() => flatListRef.current.scrollToEnd({ animated: true })}
            _contentContainerStyle={{
              marginX: 5,
            }}
            renderItem={({ item }) => (

              <Box
                borderBottomWidth="1"
                _dark={{ borderColor: "coolGray.500" }}
                borderColor="coolGray.300"
                pl={["0", "4"]}
                pr={["0", "5"]}
                mt="3"
              >


                <VStack>
                  <Text
                    _dark={{ color: "warmGray.50" }}
                    color="coolGray.800"
                    bold
                  >
                    {item.usuario ? `${item.usuario?.nombre ?? item.usuario?.nombres} escribió`: null}
                  </Text>
                  <Text
                    color="coolGray.600"
                    _dark={{ color: "warmGray.200" }}
                  >
                    {item.entrada}
                  </Text>
                  <Text
                  color="coolGray.400"
                  _dark={{ color: "warmGray.200" }}
                    textAlign={"right"}
                  >
                    {moment(item.created_at).format("LLL")}
                  </Text>
                </VStack>
               

              </Box>

            )}
            keyExtractor={(item) => item.id}
          />
          
        </Box>
        <View>
          <Text>asdasd</Text>
        </View>
      </SafeAreaView>
    </Box>
  );
}
