import { Box, Container, Text } from '@chakra-ui/react';
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { Login } from '../Components/Authentication/Login';
import { Signup } from '../Components/Authentication/Signup';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      navigate('/chat');
    }
  }, [navigate]);
  
  return (
    <Container maxW="container.xl" centerContent>
      <Box
        display={{ base: 'flex', md: 'flex' }}
        justifyContent="center"
        p={3}
        bg={'white'}
        w="100%"
        m={'40px 0 15px 0'}
        borderRadius={'lg'}
        borderWidth={'1px'}
      >
        <Text
          fontSize="xl"
          fontWeight="bold"
          textAlign="center"
          color={'black'}
        >
          Chat App
        </Text>
      </Box>
      <Box
        bg="white"
        p={4}
        w={'100%'}
        borderRadius={'lg'}
        borderWidth={'1px'}
        color={'black'}
      >
        <Tabs variant="soft-rounded">
          <TabList mb={'1em'}>
            <Tab w={'50%'}>Login</Tab>
            <Tab w={'50%'}>Signup</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Signup />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default Home;
