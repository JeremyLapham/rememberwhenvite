import { useContext, useEffect, useState } from 'react';
import './ShownMemory.css';
import CustomNavbar from '../navComponent/NavbarComponent';
import { Button, Col, Container, Modal, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import elephantLogo from '../../assets/elephantLogo.svg';
import { useNavigate } from 'react-router-dom';
import { MyContext } from '../context';
import { DeleteMemory } from '../../Services/DataService';
import DesktopNav from '../DesktopNavComponent/DesktopNav';

export default function ShownMemory() {
    const userData = useContext(MyContext);

    const [show, setShow] = useState(false);
    const [showImg, setShowImg] = useState(false);

    const handleClose = () => setShow(false);
    const handleCloseImg = () => setShowImg(false);

    const navigate = useNavigate();

    const handleBackButtonClick = () => {
        navigate('/dashboard');
        userData.setFromAddMemory(false)
    };

    useEffect(() => {
        const Memory = sessionStorage.getItem('Memory');
        if (Memory) {
            userData.setSelectedMemory(JSON.parse(Memory));
        } else {
            sessionStorage.setItem('Memory', JSON.stringify(userData.selectedMemory));
            userData.setSelectedMemory(userData.selectedMemory);
        }
    }, []);

    const handleEditMemory = () => {
        userData.setIsMemoryEdit(true);
        userData.setMemoryEdit({
            title: userData.selectedMemory.title,
            id: userData.selectedMemory.id,
            image: userData.selectedMemory.image,
            tags: userData.selectedMemory.tags,
            description: userData.selectedMemory.description,
            date: userData.selectedMemory.date,
            audio: userData.selectedMemory.audio

        });
        setTimeout(() => {
            navigate('/addMemory');
        }, 500);
    }

    const handleDeleteMemory = async () => {
        await DeleteMemory(userData.selectedMemory);
        navigate("/Dashboard");
    }

    return (
        <Container fluid>
            <Row>
                <Modal className='modalBG' show={show} onHide={handleClose}>
                    <Modal.Body className='modalBody'>
                        <Row>
                            <Col className='d-flex justify-content-center'>
                                <p className='modalTxt'>Are you sure you want to delete this memory?</p>
                            </Col>
                        </Row>
                        <Row>

                            <Col className='d-flex justify-content-center'>
                                <Button className='confirmDeleteBtn' variant="" onClick={handleDeleteMemory}>
                                    Delete
                                </Button>
                            </Col>
                            <Col className='d-flex justify-content-center'>
                                <Button className='cancelDelete' variant="" onClick={handleClose}>
                                    Cancel
                                </Button>
                            </Col>
                        </Row>
                    </Modal.Body>
                </Modal>

                <Modal contentClassName="custom-modal-content" show={showImg} onHide={handleCloseImg}>
                    <Modal.Body className='imgModal'>
                        <img className='memoryImgModal' src={userData.selectedMemory.image} alt='the picture of the memory that was selected' />
                    </Modal.Body>
                </Modal>
            </Row>
            <CustomNavbar folderSize={userData.folders.length} />
            <DesktopNav folderSize={userData.folders.length} />
            <Row>
                <Row>
                    <Col className='text-center'>
                        <h1 className='memoryRemember'>remember...</h1>
                    </Col>
                </Row>
                <Row>
                    <Col className='text-center'>
                        <h5 className='memoryName'>{userData.selectedMemory.title}</h5>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <img className='phantLogo' src={elephantLogo} alt='Elephant logo but now hes in the memory that you clicked and is watching your every move' />
                    </Col>
                </Row>
                <Col lg={6} md={6} xs={12} className='imgCol'>
                    <Row>
                        <Col className='d-flex justify-content-center'>
                            <OverlayTrigger
                                placement='top'
                                overlay={
                                    <Tooltip id={`tooltip-top`}>
                                        Click to enlarge
                                    </Tooltip>
                                }>

                                <Button variant='' onClick={() => setShowImg(true)}>
                                    <img className='memoryImg' src={userData.selectedMemory.image} alt='the picture of the memory that was selected' />
                                </Button>
                            </OverlayTrigger>
                        </Col>
                    </Row>
                </Col>
                <Col lg={6} md={6} xs={12} className='infoBoxes'>
                    <Row>
                        <Col>
                            <div className="audio-player">
                                <audio src={userData.selectedMemory.audio} controls></audio>
                                <a download href={userData.selectedMemory.audio}>
                                    Download Recording
                                </a>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col className='d-flex justify-content-center'>
                            <div className='displayHashtags'>
                                <h2 className='hashtags'>{userData.selectedMemory.tags}</h2>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col className='d-flex justify-content-center'>
                            <div className='description'>
                                <h2 className='memoryDesTxt text-center'>{userData.selectedMemory.description}</h2>
                                <h2 className='memoryDesDate text-center'>{userData.selectedMemory.date}</h2>
                            </div>
                        </Col>
                    </Row>
                </Col>
                <Row className='rowMargin'>
                    <Col lg={3} md={0} xs={0} className='d-flex justify-content-center'>
                        <Button onClick={handleBackButtonClick} className='backBtnDesktop' variant=''>Back</Button>
                    </Col>
                    <Col lg={3} md={3} xs={4} className='d-flex justify-content-center'>
                        <Button onClick={handleEditMemory} className='editBtn' variant='' disabled={userData.fromAddMemory}>Edit</Button>
                    </Col>
                    <Col lg={3} md={3} xs={4} className='d-flex justify-content-center'>
                        <Button onClick={() => { setShow(true); }} className='deleteBtn' variant=''>Delete</Button>
                    </Col>
                    <Col lg={3} md={3} xs={4} className='d-flex justify-content-center'>
                        <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Feature in development</Tooltip>}>
                            <span className="d-inline-block">
                                <Button disabled style={{ pointerEvents: 'none' }} className='shareBtn' variant=''>Share</Button>
                            </span>
                        </OverlayTrigger>
                    </Col>
                </Row>
                <Row style={{ padding: 0, margin: 0 }}>
                    <Col className='d-flex justify-content-center'>
                        <Button onClick={handleBackButtonClick} className='backBtnMobile' variant=''>Back</Button>
                    </Col>
                </Row>
            </Row>
        </Container>
    )
}
