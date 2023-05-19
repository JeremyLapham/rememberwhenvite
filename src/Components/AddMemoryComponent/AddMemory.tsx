import { useContext, useEffect, useState } from 'react';
import { Col, Container, Row, Button, Form, Modal } from 'react-bootstrap';
import './AddMemory.css';
import { useNavigate } from 'react-router-dom';
import CustomNavbar from '../navComponent/NavbarComponent';
import { addMemoryItem, getMemoryItemsByUserId, updateMemoryItem, getFolderByUserId } from '../Services/DataService';
import { MyContext } from '../context';
import swal from 'sweetalert';
import DesktopNav from '../DesktopNavComponent/DesktopNav';
// import AudioRecorder from './AudioRecording';

export default function AddMemory() {
    const { usersId, setSelectedMemory, isEditMemory, memoryEdit, setFolderId, setMemoryItems, folderId } = useContext(MyContext);

    const navigate = useNavigate()
    const [show, setShow] = useState(false);

    const [memoryImage, setMemoryImage] = useState(isEditMemory ? memoryEdit.image : '');
    const [memoryTitle, setMemoryTitle] = useState(isEditMemory ? memoryEdit.title : '');
    const [memoryDescription, setMemoryDescription] = useState(isEditMemory ? memoryEdit.description : '');
    const [memoryTags, setMemoryTags] = useState(isEditMemory ? memoryEdit.tags : '');
    const [memoryDate, setMemoryDate] = useState(isEditMemory ? memoryEdit.date : '');
    const [memoryId] = useState(isEditMemory ? memoryEdit.id : 0);
    const [folder, setFolder] = useState(0);
    const [folders, setFolders] = useState([]);

    // console.log(memoryEdit.image)

    const handleTitle = (e: { target: { value: string } }) => setMemoryTitle(e.target.value);
    const handleDescription = (e: { target: { value: string } }) => setMemoryDescription(e.target.value);
    const handleFolder = ({ target }: { target: { value: any } }) => {
        setFolderId(target.value);
        setFolder(target.value);
    };
    const handleTags = (e: { target: { value: string } }) => setMemoryTags(e.target.value);

    // const [formattedDate, setFormattedDate] = useState('');


    function formatDate(input: any) {
        const cleanedInput = input.replace(/\D/g, '');

        const day = cleanedInput.slice(0, 2);
        const month = cleanedInput.slice(2, 4);
        const year = cleanedInput.slice(4, 8);

        const formattedDate = [day, month, year].filter(Boolean).join('/');

        setMemoryDate(formattedDate);
    }

    // const handleDate = (e: { target: { value: string } }) => {
    //     // const formatDate = formatAsDate(e.target.value)
    //     setMemoryDate(e.target.value.substring(0, 10));
    // }


    const handleImage = (e: any) => {
        let file = e.target.files[0];
        const reader: any = new FileReader();
        reader.onloadend = () => {
            setMemoryImage(reader.result);
        }
        reader.readAsDataURL(file);
    }

    const handleSave = async () => {
        if (memoryImage === '' || memoryDate === '' || memoryTitle === '' || memoryDescription === '' || memoryTags === '' || folder === 0) {
            if (isEditMemory && folder === 0) {
                swal("Please check to make sure a folder has been selected or changed");
            } else {
                swal("Please make sure you enter in every field");
            }
            setSaveClick(false);
        } else {
            let item = {
                Id: memoryId,
                Userid: usersId,
                FolderId: folderId,
                title: memoryTitle,
                image: memoryImage,
                description: memoryDescription,
                date: memoryDate,
                tags: memoryTags,
                isPublished: true,
                isDeleted: false
            }
            setSelectedMemory(item);
            let result = false;
            if (isEditMemory) {
                result = await updateMemoryItem(item);
                setTimeout(() => {
                    navigate('/memory')
                }, 500);
            } else {
                result = await addMemoryItem(item);
            }
            setShow(true);

            if (result) {
                let userMemoryItems = await getMemoryItemsByUserId(usersId);
                setMemoryItems(userMemoryItems);
            } else {
                alert(`Memory was not ${isEditMemory ? 'Updated' : 'Added'}`)
            }
        }
    }

    useEffect(() => {
        sessionStorage.removeItem('Memory');
        const GetFolders = async () => {
            const UserId = sessionStorage.getItem('UserId');
            if (UserId !== null) {
                let displayFolder = await getFolderByUserId(parseInt(UserId));
                setFolders(displayFolder);
                setFolderId(displayFolder.id);
            }
        }
        GetFolders()
    }, []);

    const handleClose = () => setShow(false);

    const handleViewMemory = async () => {
        navigate('/memory');
    }

    const [saveClick, setSaveClick] = useState(false);

    const handleSaveClick = () => {
        setSaveClick(true);
        setTimeout(() => {
            setSaveClick(false);
        }, 5000);
    }

    return (
        <Container fluid>
            {/* <AudioRecorder /> */}
            <Row>
                <Modal className='modalBG' show={show} onHide={handleClose} backdrop="static" keyboard={false}>
                    <Modal.Body className={isEditMemory ? `modalBodyUpdate` : `modalBody`}>
                        <Row>
                            <Col className='d-flex justify-content-center'>
                                {isEditMemory ?
                                    <p className='modalTxt'>Do you wish to save the changes to your memory?</p>
                                    :
                                    <p className='modalTxt'>Your memory was added!</p>
                                }
                            </Col>
                        </Row>
                        <Row>
                            <Col className='d-flex justify-content-center'>
                                {isEditMemory ?
                                    <Row className='d-flex justify-content-center'>
                                        <Col>
                                            <Button onClick={() => {
                                                handleSave();
                                            }} className='changeBtn' variant=''>Change</Button>
                                        </Col>
                                        <Col>
                                            <Button onClick={() => { setShow(false); }} className='cancelBtn' variant=''>Cancel</Button>
                                        </Col>
                                    </Row>
                                    :
                                    <Button className='viewBtn' variant="" onClick={handleViewMemory}>View</Button>
                                }
                            </Col>
                        </Row>
                    </Modal.Body>
                </Modal>
            </Row>
            <CustomNavbar />
            <DesktopNav />
            <Row>
                <Col className='d-flex justify-content-center'>
                    <h2 style={{ margin: '1rem 0' }}>add your <span style={{ color: '#848383' }}>memory...</span></h2>
                </Col>
            </Row>
            <Row className='desktopInfoRow'>
                <Col md={4} lg={4} className='firstInfoCol'>
                    <Row>
                        <Col>
                            <Form.Group className="mb-3 d-flex flex-column align-items-center" controlId="Image">
                                <Form.Label className='addImgTxt'>Add image</Form.Label>
                                <Button style={{ position: 'relative' }} id='custom-input' className='selectedImgBtn'>
                                    {memoryImage && <img className='selectedImg' src={memoryImage || URL.createObjectURL(memoryImage)} alt="Selected image" />}
                                    <Form.Control className='input1' onChange={handleImage} type="file" accept='image/png, image/jpg, image/jpeg' placeholder="Enter an image" />
                                </Button>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Group className="mb-3 d-flex flex-column align-items-center">
                                <Form.Label className='addHashtagTxt'>Hashtags</Form.Label>
                                <Form.Control className='textInputs' type='text' placeholder='#Example, #Example' onChange={handleTags} value={memoryTags} />
                            </Form.Group>
                        </Col>
                    </Row>
                </Col>
                <Col md={4} lg={4} className='secondInfoCol'>
                    <Row>
                        <Col>
                            <Form.Group className="mb-3 d-flex flex-column align-items-center">
                                <Form.Label className='addFolderInputTxt'>Folder</Form.Label>
                                <Form.Select className='textInputs' onChange={handleFolder} value={folderId}>
                                    <option hidden>Folder</option>
                                    {folders.map((option: any, idx: number) => {
                                        return (
                                            <option key={idx} value={option.id}>{option.name}</option>
                                        );
                                    })}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Group className="mb-3 d-flex flex-column align-items-center">
                                <Form.Label className='addMemoryTxt'>Memory Title</Form.Label>
                                <Form.Control className='textInputs' type='text' placeholder='Memory Title' onChange={handleTitle} value={memoryTitle} />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Group className="mb-3 d-flex flex-column align-items-center">
                                <Form.Label className='addDateTxt'>Date</Form.Label>
                                <Form.Control className='textInputs' type='text' placeholder='MM/DD/YYYY or DD/MM/YYYY' onChange={(e) => formatDate(e.target.value)} value={memoryDate} />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Group className="mb-3 d-flex flex-column align-items-center">
                                <Form.Label className='addDescriptionTxt'>Memory Description</Form.Label>
                                <textarea style={{ minHeight: '130px' }} className='textInputs' placeholder='Memory Description' onChange={handleDescription} value={memoryDescription} />
                            </Form.Group>
                        </Col>
                    </Row>
                </Col>
                <Row className='desktopAddRow'>
                    <Col className='d-flex justify-content-end'>
                        {isEditMemory ?
                            <Button onClick={() => { setShow(true); }} className='addBtn' variant=''>Update</Button>
                            :
                            <Button onClick={() => { handleSave(); handleSaveClick() }} className='addBtn' variant='' disabled={saveClick}>Add</Button>
                        }
                    </Col>
                    <Col className='d-flex justify-content-start'>
                        <Button onClick={() => navigate('/dashboard')} className='addCancelBtn' variant=''>Cancel</Button>
                    </Col>
                </Row>
            </Row>
        </Container>
    );
}
