import React, { useEffect, useRef, useState } from 'react'
import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, Button, Checkbox, FormControl, FormLabel, Icon, IconButton, Input, InputGroup, InputRightElement, Text, VStack, useDisclosure, useToast } from '@chakra-ui/react'
import axios from 'axios';
import { URL } from "../App";
import { ArrowDownIcon, ArrowForwardIcon, ArrowUpIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons';
import AlertDialogBox from './AlertDialogBox';
import EditModal from './EditModal';


const Dashboard = () => {
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState("");
    const [loading, setLoading] = useState(false);
    const [userName, setUserName] = useState("");
    const [deleteTaskId, setDeleteTaskId] = useState(null);
    const [editTaskId, setEditTaskId] = useState(null);

    const [titleModalSend, setTitleModalSend] = useState("");
    const [descriptionModalSend, setDescriptionModalSend] = useState("");
    const [priorityModalSend, setPriorityModalSend] = useState('');

    const [isAlertDialogBoxOpen, setAlertDialogBoxOpen] = useState(false);
    const [isEditModalOpen, setEditModalOpen] = useState(false);

    const { isOpen, onOpen, onClose } = useDisclosure();

    const cancelRef = useRef();
    const toast = useToast();

    const token = localStorage.getItem('token');

    const config = {
        headers: {
            'Authorization': `Bearer ${token}`,
            "Content-type": "application/json",
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const response = await axios.get(`${URL}/api/task/gettasks`, config);

            if (response.data.tasks.length === 0) {
                setTasks([]);
                setUserName(response.data.user);
                toast({
                    title: "No task found.",
                    status: 'info',
                    duration: 5000,
                    isClosable: true,
                    position: 'bottom',
                });
            } else {
                setTasks(response.data.tasks);
                setUserName(response.data.user);
            }

        } catch (error) {
            console.error("Error fetching tasks:", error);
            toast({
                title: "Error fetching tasks",
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom',
            });
        }
    };

    const handleAdd = async () => {
        setLoading(true);

        if (!title) {
            toast({
                title: "Please add the Title",
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'bottom',
            });
            setLoading(false);
            return;
        }

        try {

            const { data } = await axios.post(`${URL}/api/task/createtask`, {
                title,
                description
            }, config);

            toast({
                title: "Task Added Successfully",
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: 'bottom',
            });

            setLoading(false);
            setTitle("");
            setDescription("");
            fetchTasks();
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

    const handleEditTask = async (task, id) => {
        setTitleModalSend(task.title);
        setDescriptionModalSend(task.description);
        setPriorityModalSend(task.priority);
        setEditTaskId(id);
        setEditModalOpen(true);
    };

    const handleEditConfirmation = async (updatedTitle, updatedDescription, updatedPriority) => {
        try {
            await axios.put(
                `${URL}/api/task/updatetask/${editTaskId}`,
                { title: updatedTitle, description: updatedDescription, priority: updatedPriority },
                config
            );
            toast({
                title: 'Task Updated Successfully',
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: 'bottom',
            });
            fetchTasks();
        } catch (error) {
            toast({
                title: error.response.data.message || 'Error Occurred!',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom',
            });
        } finally {
            setEditModalOpen(false);
        }
    };


    const handleDeleteTask = (id) => {
        setDeleteTaskId(id);
        setAlertDialogBoxOpen(true);
    };

    const handleDeleteConfirmation = async () => {
        try {
            await axios.delete(`${URL}/api/task/deletetask/${deleteTaskId}`, config);
            setDeleteTaskId(null);
            toast({
                title: 'Task Deleted Successfully',
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: 'bottom',
            });

            fetchTasks();
        } catch (error) {
            toast({
                title: error.response.data.message || 'Error Occurred!',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom',
            });
        } finally {
            setAlertDialogBoxOpen(false);
        }
    };

    const handleStatusChange = async (id, status) => {
        try {
            await axios.put(`${URL}/api/task/taskstatus/${id}`, { status }, config);
            toast({
                title: 'Status Updated Successfully',
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: 'bottom',
            });

            fetchTasks();
        } catch (error) {
            console.error('Error updating task status:', error);
            toast({
                title: 'Error updating task status',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom',
            });
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
                <Text fontSize={38} >Task-Manager-Web-App</Text>
                <Text fontSize={34} mb={5} >Welcome: {userName}</Text>
                <Box
                    backgroundColor="rgba(0, 0, 0, 0.7)"
                    backdropFilter="blur(3px)"
                    borderRadius="10px"
                    padding="20px"
                    color='white'
                    w={600}
                >
                    <Box
                        display='flex'
                        flexDirection='column'
                        justifyContent='center'
                        alignItems='center'
                    >
                        <FormControl isRequired>
                            <FormLabel>TITLE:</FormLabel>
                            <Input
                                type='name'
                                placeholder='Add Title'
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </FormControl>
                        <FormControl mt={3}>
                            <FormLabel>DESCRIPTION:</FormLabel>
                            <Input
                                type='name'
                                placeholder='Add Description'
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </FormControl>
                        <Button
                            mt={5}
                            w='30%'
                            backgroundColor='#5D5D5D'
                            _hover={{
                                backgroundColor: '#333333'
                            }}
                            color='white'
                            onClick={handleAdd}
                            isLoading={loading}
                        >
                            Add Task
                        </Button>
                    </Box>
                    <Text fontSize={25} mt={5} mb={5}>Tasks:</Text>

                    <Accordion allowMultiple>
                        {tasks.map((task, index) => (
                            <AccordionItem key={index}>
                                <h2>
                                    <AccordionButton cursor='default'>
                                        <Box as='span' flex='1' textAlign='left' fontWeight='500' fontSize={20}>
                                            {index + 1}. {task.title}
                                        </Box>
                                        <Box as='span' mr={5}>
                                            {task.priority === 'high' && <ArrowUpIcon color="red.500" />}
                                            {task.priority === 'medium' && <ArrowForwardIcon color="yellow.500" />}
                                            {task.priority === 'low' && <ArrowDownIcon color="green.500" />}
                                        </Box>
                                        <Icon
                                            as={EditIcon}
                                            boxSize={5}
                                            color="blue.500"
                                            onClick={() => handleEditTask(task, task._id)}
                                            cursor="pointer"
                                        />
                                        <Icon
                                            as={DeleteIcon}
                                            boxSize={5}
                                            color="red.500"
                                            ml={5}
                                            mr={5}
                                            onClick={() => handleDeleteTask(task._id)}
                                            cursor="pointer"
                                        />
                                        <Checkbox
                                            colorScheme='green'
                                            isChecked={task.status === 'completed'}
                                            onChange={(e) => handleStatusChange(task._id, e.target.checked ? 'completed' : 'pending')}
                                            mr={5}
                                        ></Checkbox>
                                        <AccordionIcon cursor='pointer' />
                                    </AccordionButton>
                                </h2>
                                {task.description ?
                                    <AccordionPanel pb={4} pl={10} fontWeight='100' textAlign='justify'>
                                        {task.description}
                                    </AccordionPanel> : <></>}
                            </AccordionItem>
                        ))}
                    </Accordion>
                </Box>
            </Box>
            <AlertDialogBox
                isOpen={isAlertDialogBoxOpen}
                onClose={() => setAlertDialogBoxOpen(false)}
                cancelRef={cancelRef}
                onDelete={handleDeleteConfirmation}
            />

            <EditModal
                isOpen={isEditModalOpen}
                onClose={() => setEditModalOpen(false)}
                onEdit={handleEditConfirmation}
                title={titleModalSend}
                description={descriptionModalSend}
                priority={priorityModalSend}
            />
        </VStack >
    );
};

export default Dashboard
