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
import { register } from '../../Services/User';

export const Signup = () => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
    pic: '',
  });
  const [show, setShow] = useState(false);
  const toast = useToast();

  const handleShow = () => setShow(!show);

  const postDetails = pics => {
    if (pics) {
      setUserData({ ...userData, pic: pics });
    }
  };

  const SubmitHandler = () => {
    const form = new FormData();

    form.append('name', userData.name);
    form.append('email', userData.email);
    form.append('password', userData.password);
    form.append('pic', userData.pic);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!userData.name || !userData.email || !userData.password) {
      toast({
        title: 'Please fill all the fields',
        status: 'warning',
        duration: 2000,
        isClosable: true,
      });
      return;
    } else if (!emailRegex.test(userData.email)) {
      toast({
        title: 'Enter a valid email',
        status: 'warning',
        duration: 2000,
        isClosable: true,
      });
      return;
    }
    register(form)
      .then(data => {
        // console.log(data);
        if (data.success) {
          toast({
            title: data.message,
            status: 'success',
            duration: 2000,
            isClosable: true,
          });
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
      <FormControl id="firstName" isRequired>
        <FormLabel>Username</FormLabel>
        <Input
          placeholder="Enter Username"
          onChange={e => setUserData({ ...userData, name: e.target.value })}
          borderColor={'black'}
        />
      </FormControl>
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
      <FormControl id="profilepic">
        <FormLabel>Upload Profile Picture</FormLabel>
        <Input
          type="file"
          p={1.5}
          accept="image/*"
          onChange={e => postDetails(e.target.files[0])}
        />
      </FormControl>
      <Button
        colorScheme="blue"
        width={'100%'}
        style={{ marginTop: '15px' }}
        onClick={SubmitHandler}
      >
        Sign Up
      </Button>
    </VStack>
  );
};
