import React, { useContext, useEffect, useState, useRef } from "react";
import { Dimensions, View, Keyboard, Platform, ActivityIndicator } from "react-native";
import { HStack, VStack, Text, Box, Heading, FlatList, Spacer, Button, KeyboardAvoidingView } from "native-base";
import moment from "moment";
import Ionicons from "react-native-vector-icons/Ionicons";

//componentes
import Header from "../../Header";
import { Input } from "../../Widgets/Input";
import { User } from "../../../Contexts/User";
import SocketContext from "../../../Contexts/Socket";
import MessageList from "./MessageList";

export default function Chat({ route, navigation }) {

	const user = useContext(User);
	const socket = useContext(SocketContext);

	const [message, setMessage] = useState("");
	const [loading, setLoading] = useState(false)
	const [keyboardShown, setKeyboardShown] = useState(false);
	const [isLoadingMore, setIsLoadingMore] = useState(false);

	const [chat, setChat] = useState({
		page: 1,
		limit: 20,
		data: [],
	});

	const flatListRef = useRef();

	// Manejar eventos del teclado
	useEffect(() => {
		const keyboardDidShowListener = Keyboard.addListener("keyboardDidShow", () =>
			setKeyboardShown(true)
		);
		const keyboardDidHideListener = Keyboard.addListener("keyboardDidHide", () =>
			setKeyboardShown(false)
		);

		return () => {
			keyboardDidHideListener.remove();
			keyboardDidShowListener.remove();
		};
	}, []);

	// Manejo del socket
	useEffect(() => {
		if (!socket || !user?.cliente?._id) return;

		setLoading(true);
		socket.emit("/admin/cliente/join", user.cliente._id);

		const handleLoadMessages = (res) => {
			console.log("res", res.data);
            setChat((prevChat) => ({
                ...prevChat,
                data: res.page === 1 ? res.data : [...res.data, ...prevChat.data],
                page: res.page,
                total: res.total,
            }));
            setLoading(false);
        };

		const handleNewMessage = (data) => {
            setChat((prev) => ({
                ...prev,
                data: [...prev.data, data],
            }));
        };

		socket.on("sucessful", handleLoadMessages);
		socket.on("new_message", handleNewMessage);
		socket.on("connect_error", (err) => {
            console.error("Error de conexión:", err);
            setLoading(false);
        });

		return () => {
			console.log("Desconectando del socket...");
			socket.emit("/admin/cliente/leave", user?.cliente?._id);
			socket.off("sucessful", handleLoadMessages);
			socket.off("new_message", handleNewMessage);
		};
	}, [socket, user?.cliente?._id]);



	// Manejar el cambio en el campo de entrada
	const handleChange = (text) => {
		console.log("text", text);
		setMessage(text)
	};

	// Enviar un mensaje
	const submit = () => {
		if (!message || !user?.cliente?._id) {
			console.log("No se puede enviar un mensaje vacío o sin cliente asociado");
			return;
		}

		const newMessage = {
			id: user.cliente._id,
			entrada: message,
			usuario: user._id,
			cliente_id: user.cliente._id,
		};

		socket.emit("/admin/cliente/message/add", newMessage);
		setMessage("");
	};

	return (
		<Box flex="1" variant="layout">
			<KeyboardAvoidingView flex={1} behavior={Platform.OS === "ios" ? "padding" : "height"} pt="5">
                <Header />
                <Box style={{ height: keyboardShown && Platform.OS === "android" ? "80%" : "89%" }}>
                    <Heading fontSize="xl" p="4" pb="3">
                        Chat de Soporte
                    </Heading>
                    {loading ? ( // Mostrar el indicador de carga
                        <ActivityIndicator size="large" color="#6200EE" style={{ marginTop: 20 }} />
                    ) : ( null )}
                    <MessageList data={chat.data}/>
                    <HStack mt="3" mx="3">
                        <Input
                            placeholder="Escribir..."
                            flex={1}
                            py="3"
                            px="4"
                            fontSize="md"
                            onChangeText={handleChange}
                            value={message}
                        />
                        <Button ml="2" onPress={submit}>
                            <Ionicons name="send" size={24} color="white" />
                        </Button>
                    </HStack>
                </Box>
            </KeyboardAvoidingView>
		</Box>
	);
}
