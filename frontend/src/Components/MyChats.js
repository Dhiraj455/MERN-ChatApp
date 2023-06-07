import React, { useEffect, useState } from 'react';
import { ChatState } from '../Context/chatProvider';
import { Box, Button, Stack, Text, useToast } from '@chakra-ui/react';
import { getChats } from '../Services/Chat';
import { AddIcon } from '@chakra-ui/icons';
import { ChatLoading } from './ChatLoading';
import { getSender } from '../Config/ChatLogic';

export const MyChats = () => {
  const [loggedUser, setLoggedUser] = useState();
  const { user, selectedChat, chats, setSelectedChat, setChats } = ChatState();
  const toast = useToast();

  const fetchChats = () => {
    try {
      getChats().then(res => {
        setChats(res.data);
        console.log(res.data);
      });
    } catch (err) {
      toast({
        title: 'Error Occured',
        description: 'Failed to fetch chats',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'bottom-left',
      });
    }
  };

  useEffect(() => {
    fetchChats();
    setLoggedUser(JSON.parse(localStorage.getItem('user')));
  }, []);

  return (
    <>
      <Box
        display={{ base: selectedChat ? 'none' : 'flex', md: 'flex' }}
        flexDir="column"
        alignItems="center"
        p={3}
        bg="white"
        w={{ base: '100%', md: '31%' }}
        borderRadius="lg"
        borderWidth="1px"
        color={'black'}
      >
        <Box
          pb={3}
          px={3}
          fontSize={{ base: '28px', md: '30px' }}
          fontFamily="Work sans"
          display={{ base: 'flex' }}
          w="100%"
          justifyContent="space-between"
          alignItems="center"
        >
          MyChats
          <Button
            display={{ base: 'flex' }}
            fontSize={{ base: '17px', md: '10px', lg: '17px' }}
            rightIcon={<AddIcon />}
            color={'black'}
          >
            New Group Chat
          </Button>
        </Box>
        <Box
          display={{ base: 'flex' }}
          flexDir="column"
          p={3}
          bg="#F8F8F8"
          w="100%"
          h="100%"
          borderRadius="lg"
          overflowY="hidden"
        >
          {chats ? (
            <Stack overflowY="scroll">
              {chats.map(chat => (
                <Box
                  onClick={() => setSelectedChat(chat)}
                  cursor="pointer"
                  bg={selectedChat === chat ? '#38B2AC' : '#E8E8E8'}
                  color={selectedChat === chat ? 'white' : 'black'}
                  px={3}
                  py={2}
                  borderRadius="lg"
                  key={chat._id}
                >
                  <Text>
                    {!chat.isGroupChat
                      ? getSender(loggedUser, chat.users)
                      : chat.chatName}
                  </Text>
                  {chat.latestMessage && (
                    <Text fontSize="xs">
                      <b>{chat.latestMessage.sender.name} : </b>
                      {chat.latestMessage.content.length > 50
                        ? chat.latestMessage.content.substring(0, 51) + '...'
                        : chat.latestMessage.content}
                    </Text>
                  )}
                </Box>
              ))}
            </Stack>
          ) : (
            <ChatLoading />
          )}
        </Box>
      </Box>
    </>
  );
};
