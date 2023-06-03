import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  VStack,
} from '@chakra-ui/react';
import React, { useState } from 'react';

export const Signup = () => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
    pic: '',
  });
  const [show, setShow] = useState(false);

  const handleShow = () => setShow(!show);

  const postDetails = pics => {
    if (pics) {
      setUserData({ ...userData, pic: pics });
    }
  };

  const SubmitHandler = () => {
    console.log(userData);
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
