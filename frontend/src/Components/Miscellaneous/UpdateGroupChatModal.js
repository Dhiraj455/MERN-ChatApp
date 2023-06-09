import { ViewIcon } from '@chakra-ui/icons';
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
  IconButton,
  Spinner,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { getUsers } from '../../Services/User';
import { ChatState } from '../../Context/chatProvider';
import UserBadgeItem from '../UserAvatar/UserBadgeItem';
import UserListItem from '../UserAvatar/UserListItem';
import { addmember, removeMember, renameGroup } from '../../Services/Chat';

export const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState();
  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameloading, setRenameLoading] = useState(false);
  const toast = useToast();

  const { selectedChat, setSelectedChat, user } = ChatState();

  const handleRemove = user1 => {
    if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
      toast({
        title: 'Only admins can remove someone!',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
      return;
    }

    try {
      setLoading(true);
      removeMember({ chatId: selectedChat._id, userId: user1._id }).then(
        res => {
          user1._id === user._id
            ? setSelectedChat()
            : setSelectedChat(res.data);
          setFetchAgain(!fetchAgain);
          setLoading(false);
        }
      );
    } catch (error) {
      toast({
        title: 'Error Occured',
        description: 'Failed to remove user from group',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top-left',
      });
      setLoading(false);
    }
  };

  const handleRename = () => {
    if (!groupChatName) return;

    try {
      setRenameLoading(true);
      renameGroup({ chatId: selectedChat._id, chatName: groupChatName }).then(
        res => {
          setSelectedChat(res.data);
          setFetchAgain(!fetchAgain);
          setRenameLoading(false);
        }
      );
    } catch (error) {
      toast({
        title: 'Error Occured',
        description: 'Failed to rename group',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top-left',
      });
      setRenameLoading(false);
    }
  };

  const handleAddUser = user1 => {
    console.log(selectedChat);
    if (selectedChat.users.find(u => u._id === user1._id)) {
      toast({
        title: 'User already in group',
        status: 'warning',
        duration: 3000,
        isClosable: true,
        position: 'top-left',
      });
      return;
    }

    if (selectedChat.groupAdmin._id !== user._id) {
      toast({
        title: 'Only admins can add someone!',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
      return;
    }

    try {
      setLoading(true);
      addmember({ chatId: selectedChat._id, userId: user1._id }).then(res => {
        setSelectedChat(res.data);
        setFetchAgain(!fetchAgain);
        setLoading(false);
      });
    } catch (error) {
      toast({
        title: 'Error Occured',
        description: 'Failed to add user to group',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top-left',
      });
      setLoading(false);
    }
  };

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

  return (
    <>
      <IconButton
        d={{ base: 'flex' }}
        icon={<ViewIcon />}
        color={'black'}
        onClick={onOpen}
      />

      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="35px"
            fontFamily="Work sans"
            display={{ base: 'flex' }}
            justifyContent="center"
          >
            {selectedChat.chatName}
          </ModalHeader>

          <ModalCloseButton />
          <ModalBody
            display={{ base: 'flex' }}
            flexDir="column"
            alignItems="center"
          >
            <Box w="100%" display={{ base: 'flex' }} flexWrap="wrap" pb={3}>
              {selectedChat.users.map(u => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  admin={selectedChat.groupAdmin}
                  handleFunction={() => handleRemove(u)}
                />
              ))}
            </Box>
            <FormControl display={{ base: 'flex' }}>
              <Input
                placeholder="Chat Name"
                mb={3}
                value={groupChatName}
                onChange={e => setGroupChatName(e.target.value)}
              />
              <Button
                variant="solid"
                colorScheme="teal"
                ml={1}
                isLoading={renameloading}
                onClick={handleRename}
              >
                Update
              </Button>
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add User to group"
                mb={1}
                onChange={e => handleSearch(e.target.value)}
              />
            </FormControl>

            {loading ? (
              <Spinner size="lg" />
            ) : (
              searchResult?.map(user => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleAddUser(user)}
                />
              ))
            )}
          </ModalBody>
          <ModalFooter>
            <Button onClick={() => handleRemove(user)} colorScheme="red">
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
