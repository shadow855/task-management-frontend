import { Box, Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, Text, VStack, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import { ViewIcon } from '@chakra-ui/icons'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { URL } from "../App";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const toast = useToast();

    //function to show or hide password
    const handleClick = () => setShow(!show);

    const movetosignup = () => {
        navigate('/signup');
    }

    //function to login user
    const handleSignin = async () => {
        setLoading(true);

        if (!email || !password) {
            toast({
                title: "Please fill all the fields",
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'bottom',
            });
            setLoading(false);
            return;
        }

        try {
            const config = {
                headers: {
                    "Content-type": "application/json",
                },
            };

            const { data } = await axios.post(`${URL}/api/user/login`, {
                email,
                password
            }, config);

            // Store the token in local storage
            localStorage.setItem('token', data.token);

            toast({
                title: "Login Successful",
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: 'bottom',
            });

            setLoading(false);
            navigate('/dashboard'); //navigate to dashboard if logged in successfully
        } catch (error) {
            toast({
                title: error.response.data.message || "Error Occurred!",
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom',
            });
            setLoading(false);
        }
    };

    return (
        <VStack spacing={5}>
            <Box
                display='flex'
                flexDirection='column'
                justifyContent='center'
                alignItems='center'
                w={{ base: '300px', sm: '450px' }}
                mt={5}
            >
                <Text fontSize={38}>Login</Text>

                {/* email form control */}
                <FormControl isRequired>
                    <FormLabel>EMAIL:</FormLabel>
                    <Input
                        type='email'
                        placeholder='Enter Your Email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </FormControl>
                {/* password form control */}
                <FormControl isRequired mt={7}>
                    <FormLabel>PASSWORD:</FormLabel>
                    <InputGroup>
                        <Input
                            type={show ? 'text' : 'password'}
                            placeholder='Enter Your Password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <InputRightElement width='4rem'>

                            {/* button to show/hide password */}
                            <Button h='1.75rem' size='sm' onClick={handleClick}>
                                <ViewIcon w={4} h={4}>
                                    {show ? 'Hide' : 'Show'}
                                </ViewIcon>
                            </Button>
                        </InputRightElement>
                    </InputGroup>
                </FormControl>
                <Button
                    mt={7}
                    w='100%'
                    backgroundColor='#5D5D5D'
                    _hover={{
                        backgroundColor: '#333333'
                    }}
                    color='white'
                    mb={5}
                    onClick={handleSignin}
                    isLoading={loading}
                >
                    Sign In
                </Button>
                <Button
                    mb={16}
                    variant='solid'
                    colorScheme='red'
                    width='100%'
                    onClick={() => {
                        setEmail("shadow@gmail.com");
                        setPassword("shadow");
                    }}
                >
                    Get Guest User Credentials
                </Button>
                <Text>Or</Text>
                <Button
                    mt={3}
                    w='100%'
                    backgroundColor='#E7E0D6'
                    _hover={{
                        backgroundColor: '#c6b69f'
                    }}
                    onClick={movetosignup}
                >Create Account</Button>
            </Box>
        </VStack >
    )
}

export default Login