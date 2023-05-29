import { useContext, useEffect, useState } from 'react';
import { Col, Container, Row, Button, Form, Modal } from 'react-bootstrap';
import './AddMemory.css';
import { useNavigate } from 'react-router-dom';
import CustomNavbar from '../navComponent/NavbarComponent';
import { addMemoryItem, updateMemoryItem, getFolderByUserId } from '../Services/DataService';
import { MyContext } from '../context';
import swal from 'sweetalert';
import DesktopNav from '../DesktopNavComponent/DesktopNav';
import AudioRecorder from './AudioRecording';

export default function AddMemory() {
    const userData = useContext(MyContext);

    
    const navigate = useNavigate()
    const [show, setShow] = useState(false);
    
    const [memoryImage, setMemoryImage] = useState(userData.isEditMemory ? userData.memoryEdit.image : '');
    const [memoryTitle, setMemoryTitle] = useState(userData.isEditMemory ? userData.memoryEdit.title : '');
    const [memoryDescription, setMemoryDescription] = useState(userData.isEditMemory ? userData.memoryEdit.description : '');
    const [memoryTags, setMemoryTags] = useState(userData.isEditMemory ? userData.memoryEdit.tags : '');
    const [memoryDate, setMemoryDate] = useState(userData.isEditMemory ? userData.memoryEdit.date : '');
    const [memoryId] = useState(userData.isEditMemory ? userData.memoryEdit.id : 0);
    const [userAudio, setUserAudio] = useState(userData.isEditMemory ? userData.memoryEdit.audio : '');
    const [folder, setFolder] = useState(0);
    const [folders, setFolders] = useState([]);
    
    const handleTitle = (e: { target: { value: string } }) => setMemoryTitle(e.target.value);
    const handleDescription = (e: { target: { value: string } }) => setMemoryDescription(e.target.value);
    const handleFolder = ({ target }: { target: { value: any } }) => {
        userData.setFolderId(target.value);
        setFolder(target.value);
    };

    function formatDate(input: any) {
        const cleanedInput = input.replace(/\D/g, '');

        const day = cleanedInput.slice(0, 2);
        const month = cleanedInput.slice(2, 4);
        const year = cleanedInput.slice(4, 8);

        const formattedDate = [day, month, year].filter(Boolean).join('/');

        setMemoryDate(formattedDate);
    }

    function formattedHashtag(input: any) {
        const cleanedInput = input.replace(/\s/g, ' ');

        setMemoryTags(cleanedInput.substring(0, 25));
    }


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
            if (userData.isEditMemory && folder === 0) {
                swal("Please check to make sure a folder has been selected or changed");
            } else {
                swal("Please make sure you enter in every field");
            }
            setSaveClick(false);
        } else {
            let item = {
                Id: memoryId,
                Userid: userData.usersId,
                FolderId: userData.folderId,
                title: memoryTitle,
                image: memoryImage,
                description: memoryDescription,
                date: memoryDate,
                tags: memoryTags,
                audio: userAudio,
                isPublished: true,
                isDeleted: false
            }
            userData.setSelectedMemory(item);
            let result = false;
            if (userData.isEditMemory) {
                result = await updateMemoryItem(item);
                setTimeout(() => {
                    navigate('/dashboard')
                }, 500);
            } else {
                console.log(Audio)
                userData.setFromAddMemory(true)
                result = await addMemoryItem(item);
            }
            setShow(true);

            if (result === false) {
                alert(`Memory was not ${userData.isEditMemory ? 'Updated' : 'Added'}`);
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
                userData.setFolderId(displayFolder.id);
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

    const handleInputFocus = () => {
        if (!memoryTags.startsWith('#')) {
            setMemoryTags('#' + memoryTags);
        }
    };

    const handleKeyDown = (e: any) => {
        if (e.keyCode === 32) {
            e.preventDefault();
            setMemoryTags((prevValue: any) => (prevValue + ' #').substring(0, 25));
        } else if (e.keyCode === 51) {
            setMemoryTags((prevValue: any) => (prevValue + ' ').substring(0, 25));
        }
    };

    return (
        <Container fluid>
            <Row>
                <Modal className='modalBG' show={show} onHide={handleClose} backdrop="static" keyboard={false}>
                    <Modal.Body className={userData.isEditMemory ? `modalBodyUpdate` : `modalBody`}>
                        <Row>
                            <Col className='d-flex justify-content-center'>
                                {userData.isEditMemory ?
                                    <p className='modalTxt'>Do you wish to save the changes to your memory?</p>
                                    :
                                    <p className='modalTxt'>Your memory was added!</p>
                                }
                            </Col>
                        </Row>
                        <Row>
                            <Col className='d-flex justify-content-center'>
                                {userData.isEditMemory ?
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
            <CustomNavbar folderSize={userData.folders.length} />
            <DesktopNav folderSize={userData.folders.length} />
            <Row>
                <Col className='d-flex justify-content-center'>
                    <h2 className='addMemoryTitle' style={{ margin: '1rem 0' }}>Add your <span style={{ color: '#848383' }}>memory...</span></h2>
                </Col>
            </Row>
            <Row className='desktopInfoRow'>
                <Col md={6} lg={4} className='firstInfoCol'>
                    <Row>
                        <Col>
                            <Form.Group className="mb-3 d-flex flex-column align-items-center" controlId="Image">
                                <Form.Label className='addImgTxt'>Add image</Form.Label>
                                <Button style={{ position: 'relative' }} id='custom-input' className='selectedImgBtn'>
                                    {memoryImage && <img className='selectedImg' src={memoryImage || URL.createObjectURL(memoryImage)} alt="Selected image" />}
                                    <Form.Control className='input1' onChange={handleImage} type="file" accept='image/png, image/jpg' placeholder="Enter an image" />
                                </Button>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Row>
                                <Col>
                                    <Form.Group className="mb-3 d-flex flex-column align-items-center">
                                        <Form.Label className='addFolderInputTxt'>Audio Recording</Form.Label>
                                        <AudioRecorder setaudio={setUserAudio} audio={userAudio}/>
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Group className="mb-3 d-flex flex-column align-items-center">
                                <Form.Label className='addHashtagTxt'>Hashtags</Form.Label>
                                <Form.Control
                                    className='textInputs'
                                    type='text'
                                    placeholder='#Example, #Example'
                                    onChange={(e) => formattedHashtag(e.target.value)}
                                    onFocus={handleInputFocus}
                                    onKeyDown={handleKeyDown}
                                    value={memoryTags} />
                            </Form.Group>
                        </Col>
                    </Row>
                </Col>
                <Col md={6} lg={4} className='secondInfoCol'>
                    <Row>
                        <Col>
                            <Form.Group className="mb-3 d-flex flex-column align-items-center">
                                <Form.Label className='addFolderInputTxt'>Folder</Form.Label>
                                <Form.Select className='textInputs' onChange={handleFolder} value={userData.folderId}>
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
                                <Form.Control className='textInputs' type='text' placeholder='MM/DD/YYYY' onChange={(e) => formatDate(e.target.value)} value={memoryDate} />
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
                        {userData.isEditMemory ?
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
