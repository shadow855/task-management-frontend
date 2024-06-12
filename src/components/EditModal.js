import React, { useEffect, useState } from 'react'
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
    Radio,
    Stack,
    RadioGroup,
    Text,
} from '@chakra-ui/react'

const EditModal = ({ isOpen, onClose, onEdit, title: initialTitle, description: initialDescription, priority: initialPriority }) => {
    const [titleModalEdit, setTitleModalEdit] = useState(initialTitle);
    const [descriptionModalEdit, setDescriptionModalEdit] = useState(initialDescription);
    const [priorityModalEdit, setPriorityModalEdit] = useState(initialPriority);

    useEffect(() => {
        setTitleModalEdit(initialTitle);
        setDescriptionModalEdit(initialDescription);
        setPriorityModalEdit(initialPriority);
    }, [initialTitle, initialDescription, initialPriority]);

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Edit Task</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl isRequired>
                            <FormLabel>Title:</FormLabel>
                            <Input
                                type='name'
                                placeholder='Edit Title'
                                value={titleModalEdit}
                                onChange={(e) => setTitleModalEdit(e.target.value)}
                            />
                        </FormControl>
                        <FormControl mt={3} mb={3}>
                            <FormLabel>Description:</FormLabel>
                            <Input
                                type='name'
                                placeholder='Edit Description'
                                value={descriptionModalEdit}
                                onChange={(e) => setDescriptionModalEdit(e.target.value)}
                            />
                        </FormControl>
                        <RadioGroup value={priorityModalEdit} onChange={setPriorityModalEdit}>
                            <Stack spacing={3} direction='row'>
                                <Text>Priority: </Text>
                                <Radio value="low">Low</Radio>
                                <Radio value="medium">Medium</Radio>
                                <Radio value="high">High</Radio>
                            </Stack>
                        </RadioGroup>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={onClose} w={20}>
                            Close
                        </Button>
                        <Button colorScheme='green' w={20} onClick={() => onEdit(titleModalEdit, descriptionModalEdit, priorityModalEdit)}>Edit</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default EditModal

