// component to show logged in user detail and edit it or logout the user

import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    FormControl,
    FormLabel,
    Input,
    Text,
    Box,
    InputGroup,
    InputRightElement,
    useToast,
} from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { URL } from "../App";
import axios from 'axios';
import { ViewIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';

const LoginDetails = ({ isOpen, onClose }) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [show, setShow] = useState(false);

    const toast = useToast();
    const navigate = useNavigate();

    const token = localStorage.getItem('token');

    const config = {
        headers: {
            'Authorization': `Bearer ${token}`,
            "Content-type": "application/json",
        }
    };

    const handleClick = () => setShow(!show);
    useEffect(() => {
        fetchLoggedInUserDetails();
    }, [])


    //function to fetch name/email of logged in user
    const fetchLoggedInUserDetails = async () => {
        try {
            const { data } = await axios.get(`${URL}/api/user/loggeduserdetails`, config);
            setName(data.name);
            setEmail(data.email);
        } catch (error) {
            console.error("Error fetching user details:", error);
        }
    };

    //function to edit name/password of loggedin user
    const editUser = async () => {
        try {
            await axios.put(`${URL}/api/user/login/update`, { name, password }, config);

            toast({
                title: 'User Details Updated Successfully',
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: 'bottom',
            });

            setPassword("");
            onClose();
            localStorage.removeItem('token'); // remove the token from local storage
            navigate('/login');
        } catch (error) {
            toast({
                title: error.response.data.message || 'Error Occurred!',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom',
            });
        }
    };

    //function to handle logout and remove token from local storage after log out
    const logOutUser = () => {
        toast({
            title: 'Logged Out Successfully',
            status: 'success',
            duration: 5000,
            isClosable: true,
            position: 'bottom',
        });
        localStorage.removeItem('token');
        onClose();
        navigate('/login');

    }

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>User Details</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>

                        {/* form control for name */}
                        <FormControl>
                            <FormLabel mt={1.5}>Name:</FormLabel>
                            <Input
                                type='name'
                                placeholder='Edit Title'
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />

                            {/* form control for email */}
                        </FormControl>
                        <FormControl mt={5}>
                            <Text mb={2}>Email:</Text>
                            <Box
                                border="1px solid"
                                borderColor="inherit"
                                padding="0.75rem 1rem"
                                borderRadius="0.375rem"
                                backgroundColor="inherit"
                            >
                                {email}
                            </Box>

                            {/* form control for password */}
                        </FormControl>
                        <FormControl mt={5}>
                            <FormLabel>Password:</FormLabel>
                            <InputGroup>
                                <Input
                                    type={show ? 'text' : 'password'}
                                    placeholder='Enter Your Password'
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <InputRightElement width='4rem'>

                                    {/* buttton to show/hide password */}
                                    <Button h='1.75rem' size='sm' onClick={handleClick}>
                                        <ViewIcon w={4} h={4}>
                                            {show ? 'Hide' : 'Show'}
                                        </ViewIcon>
                                    </Button>
                                </InputRightElement>
                            </InputGroup>
                        </FormControl>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={onClose} w={20}>
                            Close
                        </Button>
                        <Button colorScheme='green' w={20} mr={3} onClick={editUser}>Edit</Button>
                        <Button colorScheme='red' w={20} onClick={logOutUser}>LogOut</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal >
        </>
    )
}

export default LoginDetails