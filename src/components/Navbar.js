import React from 'react'
import { Link } from 'react-router-dom'
import { Box, Icon, Text, Image, useBreakpointValue } from '@chakra-ui/react'
import '../Css Folder/wave.css'

const Navbar = () => {
    return (
        <Box
            id='main-nav-box'
            display='flex'
            h={95}
            border='1px solid red'
        >
            <Box className="fog" />
            <Box
                flex={1}
                display='flex'
                alignItems='center'
                border='1px solid red'
            >
            </Box>
            <Box
                flex={3}
                display='flex'
                justifyContent='space-evenly'
                alignItems='center'
                textAlign='center'
                border='1px solid red'
            >
                <Text
                    display='flex' alignItems='center'
                    justifyContent='center'
                    fontSize={30}
                >
                    Dashboard
                </Text>
            </Box>
            <Box
                flex={1}
                display='flex'
                alignItems='center'
                justifyContent='flex-end'
                border='1px solid red'
            >
            </Box>
        </Box >
    )
}

export default Navbar