import React, { useContext, useEffect, useRef } from "react";
import { FlatList, Box, VStack, HStack, Text, Spacer } from "native-base";
import moment from "moment";
import { User } from "../../../Contexts/User";

const RenderMessage = React.memo(({ item, isCurrentUser }) => (
    <Box borderBottomWidth="1" borderColor="coolGray.300" mt="3" p="2">
        <VStack>
            <HStack>
                <Text bold color={isCurrentUser ? "coolGray.800" : "#2dda93"}>
                    {isCurrentUser ? item.usuario?.nombre : "SOPORTE"}:
                </Text>
                <Spacer />
                <Text color="coolGray.400">{moment(item.createdAt).format("MM-DD-YYYY HH:mm")}</Text>
            </HStack>
            <Text color={isCurrentUser ? "coolGray.600" : "coolGray.400"}>{item.entrada}</Text>
        </VStack>
    </Box>
));

const Chat = React.memo(({ data }) => {
    const user = useContext(User);
    const flatListRef = useRef();

    useEffect(() => {
        if (data.length > 0) {
            flatListRef.current?.scrollToEnd({ animated: true });
        }
    }, [data]);

    return (
        <FlatList
            ref={flatListRef}
            data={data}
            renderItem={({ item }) => (
                <RenderMessage item={item} isCurrentUser={item.usuario?._id === user?._id} />
            )}
            keyExtractor={(item) => item._id}
            contentContainerStyle={{ padding: 5 }}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            windowSize={5}
            removeClippedSubviews={true}
        />
    );
});

export default Chat;
