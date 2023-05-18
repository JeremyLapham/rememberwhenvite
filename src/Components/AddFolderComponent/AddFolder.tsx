import { useContext, useState } from 'react';
import CustomNavbar from '../navComponent/NavbarComponent';
import { Container, Row, Col, Form, Button, Modal } from 'react-bootstrap';
import heart from '../../assets/folderpic.png';
import { useNavigate } from 'react-router-dom';
import './AddFolder.css';
import { MyContext } from '../context';
import { Folder, updateFolder } from '../Services/DataService';
import swal from 'sweetalert';
import DesktopNav from '../DesktopNavComponent/DesktopNav';

export default function AddFolder() {
    const { setFromAddFolder, setSelectedFolder, folderEdit, isEditFolder } = useContext(MyContext);

    const [showModal, setShowModal] = useState(false);
    const [folderName, setFolderName] = useState(isEditFolder ? folderEdit.name : '');

    const navigate = useNavigate();

    const handleBackToHome = () => {
        navigate('/DashBoard')
    }

    const handleName = (e: { target: { value: string; }; }) => setFolderName(e.target.value);


    const handleFolder = async () => {
        const UserId = sessionStorage.getItem('UserId');
        if (folderName === '') {
            swal("Please enter a name for your folder");
        } else {
            let result = false;
            if (isEditFolder) {
                const fold = {
                    Id: folderEdit.id,
                    userId: UserId,
                    name: folderName,
                    isDeleted: false
                }
                setSelectedFolder(fold);
                result = await updateFolder(fold);
                setTimeout(() => {
                    navigate('/dashboard');
                }, 2000);
            } else {
                const fold = {
                    id: 0,
                    userId: UserId,
                    name: folderName,
                    isDeleted: false
                }
                setSelectedFolder(fold);
                setFromAddFolder(true);
                result = await Folder(fold);
                setTimeout(() => {
                    navigate('/dashboard');
                }, 2000);
            }
            if (result) {
                setShowModal(true);
            } else {
                alert('Something went wrong and your folder wasn\'t made or updated');
            }
        }
    }

    const handleClose = () => setShowModal(false);

    const [saveClick,setSaveClick] = useState(false);

    const handleSaveClick = () => {
        setSaveClick(true);
        setTimeout(() => {
            setSaveClick(false);
        }, 5000);
    }

    return (
        <Container fluid>
            <Row>
                <Modal className='modalBG' show={showModal} onHide={handleClose}>
                    <Modal.Body className='modalBody'>
                        <Row>
                            <Col className='d-flex justify-content-center'>
                                <p className='modalTxt'>Your folder was {isEditFolder ? 'edited' : 'added'}</p>
                            </Col>
                        </Row>
                    </Modal.Body>
                </Modal>
            </Row>
            <Row>
                <Col>
                    <CustomNavbar />
                    <DesktopNav />
                </Col>
            </Row>
            <Row>
                <Col className='d-flex justify-content-center'>
                    <h2 className='addFolderTxt '>add your <p style={{ color: '#848383' }} className='d-inline'>folder...</p></h2>
                </Col>
            </Row>
            <Row>
                <Col className='d-flex justify-content-center'>
                    <img className='folderIMG' src={heart} alt='big heart with string' />
                </Col>
            </Row>
            <Row>
                <Col className='d-flex justify-content-center'>
                    <Form>
                        <Form.Group className="mb-3" controlId="FolderName">
                            <Form.Label className='inputTxt'>Folder Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Folder Name"
                                className='inputFolder'
                                onChange={handleName}
                                value={folderName}
                            />
                        </Form.Group>
                    </Form>
                </Col>
            </Row>

            <Row>
                <Col className='d-flex justify-content-end'>
                    {isEditFolder ?
                        <Button onClick={() => { handleFolder(); setShowModal(true); }} className='addBtn' variant=''>Update</Button>
                        :
                        <Button onClick={() => { handleFolder(); handleSaveClick()}} className='addBtn' variant='' disabled={saveClick}>Add</Button>
                    }
                </Col>
                <Col className='d-flex justify-content-start'>
                    <Button onClick={handleBackToHome} className='cancelfolderBtn' variant=''>Cancel</Button>
                </Col>
            </Row>
        </Container>
    )
}
