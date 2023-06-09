import {
  Avatar,
  Box,
  Button,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text,
  Tooltip,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Input,
  useToast,
  Spinner,
} from '@chakra-ui/react';
import { BellIcon, ChevronDownIcon } from '@chakra-ui/icons';
import React, { useState } from 'react';
import { ChatState } from '../../Context/chatProvider';
import { ProfileModal } from './ProfileModal';
import { ColorModeSwitcher } from '../../ColorModeSwitcher';
import { useNavigate } from 'react-router';
import { getUsers } from '../../Services/User';
import { ChatLoading } from '../ChatLoading';
import UserListItem from '../UserAvatar/UserListItem';
import { accessChat } from '../../Services/Chat';

export const SideDrawer = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

  const { user, selectedChat, chats, setSelectedChat, setChats } = ChatState();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const onLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const handleSearch = () => {
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
        setSearchResults(res.data);
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

  const accessChats = async userId => {
    console.log(userId);
    try {
      setLoadingChat(true);
      accessChat({ userId: userId }).then(res => {
        setSelectedChat(res.chat);
        if (!chats.find(c => c._id === res.chat._id))
          setChats([res.chats, ...chats]);
        setLoadingChat(false);
        onClose();
      });
    } catch (error) {
      toast({
        title: 'Error Fetching',
        description: 'Failed to access chat',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'bottom-left',
      });
      setLoadingChat(false);
    }
  };

  return (
    <>
      <Box
        display={{ base: 'flex', md: 'flex' }}
        alignItems={'center'}
        justifyContent="space-between"
        w={'100%'}
        bg={'white'}
        p="5px 10px"
        borderWidth={'5px'}
      >
        <Tooltip label="Search" hasArrow placement="bottom-end">
          <Button variant={'ghost'} color={'black'} onClick={onOpen}>
            <i className="fas fa-search"></i>
            <Text display={{ base: 'none', md: 'flex' }} px={4}>
              Search
            </Text>
          </Button>
        </Tooltip>

        <Text color={'black'} fontFamily={'Work Sans'} fontSize={'2xl'}>
          Chat App
        </Text>

        <div>
          <Menu>
            <MenuButton p={1} color={'black'}>
              <BellIcon fontSize={'2xl'} m={1} />
            </MenuButton>
            <MenuList>
              <MenuItem>Download</MenuItem>
              <MenuItem>Create a Copy</MenuItem>
              <MenuItem>Mark as Draft</MenuItem>
              <MenuItem>Delete</MenuItem>
              <MenuItem>Attend a Workshop</MenuItem>
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton
              as={Button}
              rightIcon={<ChevronDownIcon />}
              p={1}
              color={'black'}
            >
              <Avatar
                size={'sm'}
                cursor={'pointer'}
                name={user.name}
                src={user.pic}
              ></Avatar>
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>
              <MenuDivider />
              <MenuItem onClick={onLogout}>Logout</MenuItem>
            </MenuList>
          </Menu>
          <ColorModeSwitcher justifySelf="flex-end" />
        </div>
      </Box>

      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Search User</DrawerHeader>
          <DrawerBody>
            <Box display={{ base: 'flex' }} pb={2}>
              <Input
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResults?.map(user => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChats(user._id)}
                />
              ))
            )}
            {loadingChat ? <Spinner ml={'auto'} display={'flex'} /> : null}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};
