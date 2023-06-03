import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  VStack,
  useToast,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { login } from '../../Services/User';
import { useNavigate } from 'react-router-dom';

export const Login = () => {
  const [userData, setUserData] = useState({
    email: '',
    password: '',
  });
  const [show, setShow] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const handleShow = () => setShow(!show);

  const SubmitHandler = () => {
    console.log('SubmitHandler', userData);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!userData.email || !userData.password) {
      toast({
        title: 'Please fill all the fields',
        status: 'warning',
        duration: 2000,
        isClosable: true,
      });
      return;
    }
    if (!emailRegex.test(userData.email)) {
      toast({
        title: 'Enter a valid email',
        status: 'warning',
        duration: 2000,
        isClosable: true,
      });
      return;
    }
    login(userData)
      .then(data => {
        if (data.success) {
          toast({
            title: data.message,
            status: 'success',
            duration: 2000,
            isClosable: true,
          });
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
          navigate('/chat');
        } else {
          toast({
            title: data.message,
            status: 'error',
            duration: 2000,
            isClosable: true,
          });
        }
      })
      .catch(err => {
        // console.log(err);
        toast({
          title: 'Something went wrong',
          status: 'error',
          duration: 2000,
          isClosable: true,
        });
      });
  };

  return (
    <VStack spacing={4} color={'black'}>
      <FormControl id="email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          placeholder="Enter Email"
          onChange={e => setUserData({ ...userData, email: e.target.value })}
          borderColor={'black'}
        />
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? 'text' : 'password'}
            placeholder="Enter password"
            onChange={e =>
              setUserData({ ...userData, password: e.target.value })
            }
            borderColor={'black'}
          />
          <InputRightElement width="4.5rem" color={'black'}>
            <Button h="1.75rem" size="lg" onClick={handleShow}>
              <Text fontSize="xs" color={'black'}>
                {' '}
                {show ? 'Hide' : 'Show'}
              </Text>
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <Button
        colorScheme="blue"
        width={'100%'}
        style={{ marginTop: '15px' }}
        onClick={SubmitHandler}
      >
        Login
      </Button>
    </VStack>
  );
};
