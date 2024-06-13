import React, { useEffect, useRef, useState } from 'react'
import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, Button, Checkbox, FormControl, FormLabel, Icon, Input, InputGroup, InputRightElement, Radio, RadioGroup, Select, Spinner, Stack, Text, VStack, useBreakpointValue, useDisclosure, useToast } from '@chakra-ui/react'
import axios from 'axios';
import { URL } from "../App";
import { ArrowDownIcon, ArrowForwardIcon, ArrowUpIcon, DeleteIcon, EditIcon, SearchIcon } from '@chakra-ui/icons';
import AlertDialogBox from './AlertDialogBox';
import EditModal from './EditModal';


const Dashboard = () => {

    //states
    const [tasks, setTasks] = useState([]); //for the tasks
    const [title, setTitle] = useState(""); //for title of task
    const [description, setDescription] = useState("");//for description of task
    const [loading, setLoading] = useState(false); //for showing loading icon while doing something with api
    const [userName, setUserName] = useState(""); //for setting user name of looged in user
    const [deleteTaskId, setDeleteTaskId] = useState(null); //for getting task id which user want to delete
    const [editTaskId, setEditTaskId] = useState(null); //for getting task id which user want to edit
    const [valueFilter, setValueFilter] = useState(""); //for setting filter values to pending/completed
    const [search, setSearch] = useState(""); //for setting search text
    const [sortByDate, setSortByDate] = useState(""); //to manage sorting by date
    const [sortByPriority, setSortByPriority] = useState("");//to manage sorting by priority

    const [titleModalSend, setTitleModalSend] = useState("");
    const [descriptionModalSend, setDescriptionModalSend] = useState("");
    const [priorityModalSend, setPriorityModalSend] = useState('');

    const [isAlertDialogBoxOpen, setAlertDialogBoxOpen] = useState(false); //to manage opening/closing of Delete Task dialog Box
    const [isEditModalOpen, setEditModalOpen] = useState(false); //to manage opening/closing of Edit Task Modal

    const showTextWelcome = useBreakpointValue({ base: false, md: true }); //to check width of screen and show Text component accordingly

    const cancelRef = useRef();
    const toast = useToast();

    const token = localStorage.getItem('token'); //storing token in localStorage

    const config = {
        headers: {
            'Authorization': `Bearer ${token}`,
            "Content-type": "application/json",
        }
    };

    useEffect(() => {
        fetchTasks("", "", "", "");
    }, []);

    // for handling sorting by date
    const handleSortByDate = (sortByValue) => {
        setSortByDate(sortByValue);
    };

    // for handling sorting by priority
    const handleSortByPriority = (sortByValue) => {
        setSortByPriority(sortByValue);
    };

    useEffect(() => {
        fetchTasks(valueFilter, search, sortByDate, sortByPriority);
    }, [valueFilter, sortByDate, sortByPriority]);

    //function for fetching tasks based on filter/search/sorting
    const fetchTasks = async (filter = "", search = "", sortByDate = "", sortByPriority = "") => {
        try {
            const queryParams = [];
            if (filter) queryParams.push(`status=${filter}`);
            if (search) queryParams.push(`title=${search}`);
            if (sortByDate) queryParams.push(`${sortByDate}`);
            if (sortByPriority) queryParams.push(`${sortByPriority}`);
            const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';

            const response = await axios.get(`${URL}/api/task/getfilteredandsearchedtask${queryString}`, config);

            if (response.data.tasks.length === 0) {
                setTasks([]);
                setUserName(response.data.user);
                toast({
                    title: "No task found.", // if no tasks found show the toast
                    status: 'info',
                    duration: 5000,
                    isClosable: true,
                    position: 'bottom',
                });
            } else {
                //if tasks are present show tasks and name of user
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

    const handleSearchAndFilter = () => {
        fetchTasks(valueFilter, search, sortByDate, sortByPriority);
    };

    //for clearing filter/search/sort values
    const handleClearSearchFilterSort = () => {
        setValueFilter("");
        setSearch("");
        setSortByDate("");
        setSortByPriority("");
        fetchTasks("", "", "", "");
    };

    useEffect(() => {
        handleSearchAndFilter();
    }, [valueFilter]);

    // function to add the task
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
            fetchTasks(); // fetching all tasks again irrespective of any filter/sort/search after adding a task
            handleClearSearchFilterSort(); //calling clear function to reset any filter/sort/search
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

    //function to open modal for edit task
    const handleEditTask = async (task, id) => {
        setTitleModalSend(task.title);
        setDescriptionModalSend(task.description);
        setPriorityModalSend(task.priority);
        setEditTaskId(id);
        setEditModalOpen(true);
    };

    //function to edit task 
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
            fetchTasks(valueFilter, search, sortByDate, sortByPriority);
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

    //function to open delete alert dialog box
    const handleDeleteTask = (id) => {
        setDeleteTaskId(id);
        setAlertDialogBoxOpen(true);
    };

    //function to delete task
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

            fetchTasks(valueFilter, search, sortByDate, sortByPriority);
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

    //function to change status of task
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

            fetchTasks(valueFilter, search, sortByDate, sortByPriority);
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
                {/* check width of screen and show the texts accordingly */}
                {showTextWelcome ?
                    <Text fontSize={{ base: '25px', sm: '34px' }} mb={5} w={{ base: '', sm: '450px', md: '700px' }} textAlign='center'>Welcome: {userName}</Text>
                    : (
                        <Box display='flex' flexDirection='column' justifyContent='center' alignItems='center'>
                            <Text fontSize={{ base: '25px', sm: '34px' }}>Welcome</Text>
                            <Text fontSize={{ base: '25px', sm: '34px' }} mb={5}>{userName}</Text>
                        </Box>
                    )}

                {/* main box to display the contents */}
                <Box
                    backgroundColor="rgba(0, 0, 0, 0.7)"
                    backdropFilter="blur(3px)"
                    borderRadius="10px"
                    padding="20px"
                    color='white'
                    w={{ base: '', sm: '450px', md: '700px' }}
                >
                    {/* box for adding task */}
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

                    <Text fontSize={25} mt={5} mb={2}>Tasks:</Text>

                    {/* box to for filtering and searching */}
                    <Box
                        mb={5}
                        display='flex'
                        justifyContent='space-between'
                        alignItems={{ base: 'normal', md: 'center' }}
                        flexDirection={{ base: 'column', md: 'row' }}
                    >
                        <RadioGroup
                            value={valueFilter}
                            onChange={setValueFilter}
                            mr={5}
                            display='flex'
                            alignItems='center'
                            mb={{ base: '3', md: '0' }}
                        >
                            <Text mr={2}>Filter: </Text>
                            <Stack
                                spacing={3}
                                direction='row'
                                display='flex'
                                alignItems='center'
                            >
                                <Radio value="pending">Pending</Radio>
                                <Radio value="completed">Completed</Radio>
                            </Stack>
                        </RadioGroup>
                        <Box display='flex'>
                            <InputGroup mb={{ base: '3', md: '0' }}>
                                <Input
                                    type='name'
                                    placeholder='Search by Title'
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                                <InputRightElement>
                                    <Button onClick={handleSearchAndFilter}>
                                        <Icon
                                            as={SearchIcon}
                                            boxSize={5}
                                            ml={5}
                                            mr={5}
                                            cursor="pointer" />
                                    </Button>
                                </InputRightElement>
                            </InputGroup>

                            {/* clear button to reset all filter/search/sort values */}
                            <Button onClick={handleClearSearchFilterSort} ml={2}>Clear</Button>
                        </Box>
                    </Box>

                    {/* box to sort by date */}
                    <Box
                        display='flex'
                        justifyContent='space-between'
                        alignItems='center'
                        mb={5}
                    >
                        <Text>Sort By Date:</Text>
                        <Select
                            value={sortByDate}
                            onChange={(e) => handleSortByDate(e.target.value)}
                            color='black'
                            backgroundColor='white'
                            w={{ base: '140px', sm: '280px', md: "500px" }}
                        >
                            <option value="">Select</option>
                            <option value="sortField=createdAt&sortOrder=asc">By Date, Asc</option>
                            <option value="sortField=createdAt&sortOrder=desc">By Date, Desc</option>
                        </Select>
                    </Box>

                    {/* box to sort by priority */}
                    <Box
                        display='flex'
                        justifyContent='space-between'
                        alignItems='center'
                        mb={5}
                    >
                        <Text>Sort By Priority:</Text>
                        <Select
                            value={sortByPriority}
                            onChange={(e) => handleSortByPriority(e.target.value)}
                            color='black'
                            backgroundColor='white'
                            w={{ base: '140px', sm: '280px', md: "500px" }}
                        >
                            <option value="">Select</option>
                            <option value="priorityOrder=asc">By Priority, Asc</option>
                            <option value="priorityOrder=desc">By Priority, Desc</option>
                        </Select>
                    </Box>

                    {/* check if tasks are available, if yes show them, if not show spinner */}
                    {tasks ?
                        <Accordion allowMultiple>
                            {tasks.map((task, index) => (
                                <AccordionItem key={index}>
                                    <h2>
                                        <AccordionButton cursor='default' flexDirection={{ base: 'column', md: 'row' }}>

                                            {/* for showing task title/priority*/}
                                            <Box as='span' flex='1' textAlign='left' fontWeight='500' fontSize={20}>
                                                {index + 1}. {task.title}
                                            </Box>

                                            <Box display='flex' alignItems='center'>
                                                {/* for showing task priority */}
                                                <Box as='span' mr={5}>
                                                    {task.priority === 'high' && <ArrowUpIcon color="red.500" />}
                                                    {task.priority === 'medium' && <ArrowForwardIcon color="yellow.500" />}
                                                    {task.priority === 'low' && <ArrowDownIcon color="green.500" />}
                                                </Box>

                                                {/* for edit icon */}
                                                <Icon
                                                    as={EditIcon}
                                                    boxSize={5}
                                                    color="blue.500"
                                                    onClick={() => handleEditTask(task, task._id)}
                                                    cursor="pointer"
                                                />

                                                {/* for delete icon */}
                                                <Icon
                                                    as={DeleteIcon}
                                                    boxSize={5}
                                                    color="red.500"
                                                    ml={5}
                                                    mr={5}
                                                    onClick={() => handleDeleteTask(task._id)}
                                                    cursor="pointer"
                                                />
                                                {/* for setting status of task */}
                                                <Checkbox
                                                    colorScheme='green'
                                                    isChecked={task.status === 'completed'}
                                                    onChange={(e) => handleStatusChange(task._id, e.target.checked ? 'completed' : 'pending')}
                                                    mr={5}
                                                ></Checkbox>
                                                <AccordionIcon cursor='pointer' />
                                            </Box>
                                        </AccordionButton>
                                    </h2>
                                    {/* for showing description of task, if exit show it, if not then don't render accordion panel */}
                                    {task.description ?
                                        <AccordionPanel pb={4} pl={10} fontWeight='100' textAlign='justify'>
                                            {task.description}
                                        </AccordionPanel> : <></>}
                                </AccordionItem>
                            ))}
                        </Accordion>
                        :
                        <Box display='flex' justifyContent='center'>
                            <Spinner />
                        </Box>}
                </Box>
            </Box>

            {/* passing values to delete alert dialog box */}
            <AlertDialogBox
                isOpen={isAlertDialogBoxOpen}
                onClose={() => setAlertDialogBoxOpen(false)}
                cancelRef={cancelRef}
                onDelete={handleDeleteConfirmation}
            />

            {/* passing values to edit modal component */}
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
