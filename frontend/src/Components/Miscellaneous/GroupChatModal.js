import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  FormControl,
  Input,
  useToast,
  Box,
} from '@chakra-ui/react';
import UserListItem from '../UserAvatar/UserListItem';
import { ChatState } from '../../Context/chatProvider';
import { getUsers } from '../../Services/User';
import UserBadgeItem from '../UserAvatar/UserBadgeItem';
import { createGroup } from '../../Services/Chat';

export const GroupChatModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const { user, chats, setChats } = ChatState();

  const handleSearch = search => {
    if (!search) {
      toast({
        title: 'Please enter a search query',
        status: 'warning',
        duration: 3000,
        isClosable: true,
        position: 'top-left',
      });
    }

    try {
      setLoading(true);
      getUsers(search).then(res => {
        setSearchResult(res.data);
        console.log(res.data);
        setLoading(false);
      });
    } catch (error) {
      toast({
        title: 'Error Occured',
        description: 'Failed to search users',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top-left',
      });
    }
  };

  const handleSubmit = () => {
    if (!groupChatName || !selectedUsers) {
      toast({
        title: 'Please enter a chat name and select atleast one user',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
      return;
    }

    const users = selectedUsers.map(u => u._id);

    createGroup({ users, groupName: groupChatName }).then(res => {
      if (res.success) {
        setChats([...chats, res.chat]);
        setSelectedUsers([]);
        onClose();
        toast({
          title: 'Group created',
          status: 'success',
          duration: 2000,
          isClosable: true,
          position: 'top',
        });
      } else {
        toast({
          title: 'Error Occured',
          description: res.errMessage,
          status: 'error',
          duration: 2000,
          isClosable: true,
          position: 'top',
        });
      }
    });
  };

  const handleGroup = user => {
    if (selectedUsers.includes(user)) {
      toast({
        title: 'User already added',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
      return;
    }

    setSelectedUsers([...selectedUsers, user]);
  };

  const handleDelete = user => {
    setSelectedUsers(selectedUsers.filter(u => u._id !== user._id));
  };

  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="35px"
            fontFamily="Work sans"
            d="flex"
            justifyContent="center"
          >
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody d="flex" flexDir="column" alignItems="center">
            <FormControl>
              <Input
                placeholder="Chat Name"
                mb={3}
                onChange={e => setGroupChatName(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add Users eg: John, Piyush, Jane"
                mb={1}
                onChange={e => handleSearch(e.target.value)}
              />
            </FormControl>
            <Box w="100%" d="flex" flexWrap="wrap">
              {selectedUsers.map(u => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  handleFunction={() => handleDelete(u)}
                />
              ))}
            </Box>
            {loading ? (
              // <ChatLoading />
              <div>Loading...</div>
            ) : (
              searchResult
                ?.slice(0, 4)
                .map(user => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleGroup(user)}
                  />
                ))
            )}
          </ModalBody>
          <ModalFooter>
            <Button onClick={handleSubmit} colorScheme="blue">
              Create Chat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
