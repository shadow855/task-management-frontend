import { Box, Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, Text, VStack, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import { ViewIcon } from '@chakra-ui/icons'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { URL } from "../App";

const Signup = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmpassword, setConfirmpassword] = useState("")
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate();
    const toast = useToast();

    const handleClickPassword = () => setShowPassword(!showPassword);
    const handleClickConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

    const handleSignup = async () => {
        setLoading(true);

        if (!name || !email || !password || !confirmpassword) {
            toast({
                title: "Please fill all the fields",
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'bottom',
            });
            setLoading(false)
            return;
        }

        if (password !== confirmpassword) {
            toast({
                title: "Passwords do not Match",
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

            const { data } = await axios.post(`${URL}/api/user/register`, {
                name,
                email,
                password
            }, config);

            toast({
                title: "Registration Successful",
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: 'bottom',
            });

            setLoading(false);
            navigate('/login');
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
                // border='1px solid red'
                display='flex'
                flexDirection='column'
                justifyContent='center'
                alignItems='center'
                w={{ base: '300px', sm: '450px' }}
                mt={5}
            >
                <Text fontSize={38}>Create Account</Text>
                <FormControl isRequired>
                    <FormLabel>NAME:</FormLabel>
                    <Input
                        type='name'
                        placeholder='Enter Your Name'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </FormControl>
                <FormControl isRequired mt={7}>
                    <FormLabel>EMAIL:</FormLabel>
                    <Input
                        type='email'
                        placeholder='Enter Your First Name'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </FormControl>

                <FormControl isRequired mt={7}>
                    <FormLabel>PASSWORD:</FormLabel>
                    <InputGroup>
                        <Input
                            type={showPassword ? 'text' : 'password'}
                            placeholder='Enter Your Password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <InputRightElement width='4rem'>
                            <Button h='1.75rem' size='sm' onClick={handleClickPassword}>
                                <ViewIcon w={4} h={4}>
                                    {showPassword ? 'Hide' : 'Show'}
                                </ViewIcon>
                            </Button>
                        </InputRightElement>
                    </InputGroup>
                </FormControl>

                <FormControl isRequired mt={7}>
                    <FormLabel>CONFIRM PASSWORD:</FormLabel>
                    <InputGroup>
                        <Input
                            type={showConfirmPassword ? 'text' : 'password'}
                            placeholder='Confirm Password'
                            value={confirmpassword}
                            onChange={(e) => setConfirmpassword(e.target.value)}
                        />
                        <InputRightElement width='4rem'>
                            <Button h='1.75rem' size='sm' onClick={handleClickConfirmPassword}>
                                <ViewIcon w={4} h={4}>
                                    {showConfirmPassword ? 'Hide' : 'Show'}
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
                    onClick={handleSignup}
                    isLoading={loading}
                >
                    Create
                </Button>
            </Box>
        </VStack >
    )
}

export default Signup