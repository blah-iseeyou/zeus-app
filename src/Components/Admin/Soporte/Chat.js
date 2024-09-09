import React, { useContext, useEffect, useState } from "react";
import { Dimensions, View, Keyboard, PlatformOSType } from "react-native";
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
  KeyboardAvoidingView,
} from "native-base";
import AntDesign from "react-native-vector-icons/AntDesign";
import Ionicons from "react-native-vector-icons/Ionicons";
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
  const [message, setMessage] = useState("");

  let flatListRef = React.createRef();

  const [keyboardShown, setKeyboardShown] = React.useState(false)

  React.useEffect(() => {
      const keyboardDidShowListener = Keyboard.addListener(
          "keyboardDidShow",
          () => {
              setKeyboardShown(true)
          }
      );
      const keyboardDidHideListener = Keyboard.addListener(
          "keyboardDidHide",
          () => {
              setKeyboardShown(false)
          }
      );

      return () => {
          keyboardDidHideListener.remove();
          keyboardDidShowListener.remove();
      };
  }, []);



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

  const handleChange = (e) => {
    setMessage(e);
  };

  const submit = () => {
    if (!user?.cliente?._id) {
      console.log("NO HAY CLIENTE_ID")
    }

    console.log("SUBMIT", message)



    if (!message) {
      console.log("NO HAY CONTENIDO")
      return
    }

    if (message && message.length > 0) {
      socket.emit('/admin/cliente/message/add', {
        id: user?.cliente?._id,
        entrada: message,
        usuario: user._id,
        cliente_id: user?.cliente?._id,
      })

      setMessage("")
    }
  }
  const IO_newMessage = (data) => {
    console.log("new message")
    setChat((prev) => {

      let newMessages = [...prev.data, data]

      return {
        ...prev,
        data: newMessages
      }

    }
    )
  }

  useEffect(() => {
    console.log("socket", socket)
    console.log('user', user)
    IO_connect(user?.cliente?._id);
    socket.on('connect', IO_connect)
    socket.on('sucessful', IO_loadMessages)
    socket.on('error', IO_error)
    socket.on('new_message', IO_newMessage)


  }, [socket]);

  return (

    <Box variant={"layout"} flex="1">
      <KeyboardAvoidingView flex={1} behavior='position'>

          <Header />
          <Box style={{ height: `${(keyboardShown && Platform.OS === "android") ? "80%" : "83%"}` }}>
            <Heading fontSize="xl" p="4" pb="3">
              Chat de Soporte
            </Heading>
            <View style={{ height: "100%" }}>
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
                      {item.usuario ? <HStack>
                        <Text
                          _dark={{ color: "warmGray.50" }}
                          color="coolGray.800"
                          bold
                        >
                          {item.usuario ? `${item.usuario?.nombre ?? item.usuario?.nombres} escribió` : null}
                        </Text>
                        <Spacer />
                        <Text
                          color="coolGray.400"
                          _dark={{ color: "warmGray.200" }}
                          textAlign={"right"}
                        >
                          {moment(item.createdAt).format("MM-DD-YYYY HH:mm")}
                        </Text>
                      </HStack> : null}


                      <Text
                        color={item.usuario ? "coolGray.600" : "coolGray.400"}
                        _dark={{ color: "warmGray.200" }}
                      >
                        {item.entrada}
                      </Text>

                    </VStack>


                  </Box>

                )}
                keyExtractor={(item) => item._id}
              />
            </View>
            <View style={{ marginTop: 15, marginLeft: 10, marginRight: 10 }}>
              <HStack>
                <Input
                  placeholder="Escribir..."
                  w="87%"
                  py="3"
                  px="4"
                  fontSize="md"
                  onChangeText={handleChange}
                  value={message}
                >

                </Input>
                <Spacer />
                <Button w={"13%"} onPress={submit}>
                  <Ionicons name="send" size={24} />
                </Button>
              </HStack>
            </View>

          </Box>

      </KeyboardAvoidingView>
    </Box>
  );
}
