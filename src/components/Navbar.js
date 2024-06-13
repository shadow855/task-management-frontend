import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Box, Icon, Text, Image, useBreakpointValue, useDisclosure } from '@chakra-ui/react'
import '../Css Folder/wave.css'
import { RxAvatar } from "react-icons/rx";
import LoginDetails from './LoginDetails';

const Navbar = () => {
    const location = useLocation();
    const { isOpen, onOpen, onClose } = useDisclosure();

    const showTextDash = useBreakpointValue({ base: false, md: true });

    return (
        <Box
            id='main-nav-box'
            display='flex'
            h={95}
        >
            <Box className="fog" />
            <Box
                flex={1}
                display='flex'
                alignItems='center'
            >
            </Box>
            <Box
                flex={3}
                display='flex'
                justifyContent='space-evenly'
                alignItems='center'
                textAlign='center'
            >
                <Box
                    display='flex'
                    alignItems='center'
                    justifyContent='center'
                    flexDirection={{ base: 'column', md: "row" }}
                    fontSize={{ base: '26px', sm: '34px', md: '38px' }}
                >
                    <Text>Task-Manager</Text>
                    {showTextDash && <Text>-</Text>}
                    <Text>Web-App</Text>
                </Box>
            </Box>
            <Box
                flex={1}
                display='flex'
                alignItems='center'
                justifyContent='center'
            >
                {location.pathname === '/dashboard' && (
                    <Icon as={RxAvatar} w={{ base: '30px', sm: '38px' }} h={{ base: '30px', sm: '38px' }} onClick={onOpen} />
                )}
            </Box>
            <LoginDetails
                isOpen={isOpen}
                onClose={onClose}
            />
        </Box >
    )
}

export default Navbar