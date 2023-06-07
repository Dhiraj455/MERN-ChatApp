import React, { useEffect } from 'react';
import { ChatState } from '../Context/chatProvider';
import { Box } from '@chakra-ui/react';
import { SideDrawer } from '../Components/Miscellaneous/SideDrawer';
import { MyChats } from '../Components/MyChats';
import { ChatBox } from '../Components/ChatBox';
import { useNavigate } from 'react-router';

export const Chat = () => {
  const navigate = useNavigate();
  const { user } = ChatState();
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      navigate('/');
    }
  }, [navigate]);
  return (
    <div style={{ width: '100%' }}>
      {user && <SideDrawer />}
      <Box
        display={{ base: 'none', md: 'flex' }}
        justifyContent="space-between"
        w={'100%'}
        h="91.5vh"
        p="10px"
      >
        {user && <MyChats />}
        {user && <ChatBox />}
      </Box>
    </div>
  );
};
