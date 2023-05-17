import { useContext, useEffect, useState } from 'react';
import CustomNavbar from '../navComponent/NavbarComponent';
import { Col, Container, Row, Button, Modal, OverlayTrigger, Tooltip } from 'react-bootstrap';
import heart from '../../assets/folderpic.png';
import { useNavigate } from 'react-router-dom';
import './ClickedFolder.css';
import { IoAddSharp } from 'react-icons/io5';
import { MyContext } from '../context';
import { DeleteFolder, getMemoryByFolderId } from '../Services/DataService';
import DesktopNav from '../DesktopNavComponent/DesktopNav';

export default function ClickedFolder() {
    const { folderName, selectedFolder, setSelectedMemory, setFolderEdit, setIsEditFolder, setIsMemoryEdit, fromAddFolder } = useContext(MyContext);

    const [memoryItem, setMemoryItem] = useState([]);

    useEffect(() => {
        const GetMemories = async () => {
            let memory = await getMemoryByFolderId(selectedFolder.id);
            setMemoryItem(memory);
        }
        GetMemories()
    }, []);

    const navigate = useNavigate();

    const handleClickedMemory = (memory: any) => {
        setSelectedMemory(memory);
        navigate('/memory');
    }

    const handleEditFolder = () => {
        setFolderEdit({
            name: folderName,
            id: selectedFolder.id
        });
        setIsEditFolder(true);
        setTimeout(() => {
            navigate('/addfolder');
        }, 500);
    }
    const handleDeleteFolder = async () => {
        await DeleteFolder(selectedFolder);
        navigate('/dashboard');
    }
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);

    return (
        <Container fluid>
            <Row>
                <Modal className='modalBG' show={show} onHide={handleClose}>
                    <Modal.Body className='modalBody'>
                        <Row>
                            <Col className='d-flex justify-content-center'>
                                <p className='modalTxt'>Are you sure you want to delete this folder?</p>
                            </Col>
                        </Row>
                        <Row>
                            <Col className='d-flex justify-content-center'>
                                <Button className='confirmDeleteBtnFold' variant="" onClick={handleDeleteFolder}>
                                    Delete
                                </Button>
                            </Col>
                            <Col className='d-flex justify-content-center'>
                                <Button className='cancelDeleteFold' variant="" onClick={handleClose}>
                                    Cancel
                                </Button>
                            </Col>
                        </Row>
                    </Modal.Body>
                </Modal>
            </Row>
            <CustomNavbar />
            <DesktopNav />
            <Row>
                <Col>
                    <h1 className='nameFolder text-center'>{fromAddFolder ? selectedFolder.name : folderName}...</h1>
                </Col>
            </Row>
            <Row className='d-flex align-items-center'>
                <Col>
                    <img className='heart' src={heart} alt='remember heart in clicked folder ' />
                </Col>
                <Col className='d-flex flex-column justify-content-end'>
                    <Row>
                        <div className='d-flex justify-content-end'>
                            <Button onClick={() => { navigate('/AddMemory'); setIsMemoryEdit(false) }} className='addNew' variant='' style={{ display: 'flex', alignItems: 'center' }}>
                                <Col xs={9}>
                                    <p className='addNewTxt'>Add Memory</p>
                                </Col>
                                <Col xs={3} className='d-flex justify-content-center'>
                                    <IoAddSharp size={28} />
                                </Col>
                            </Button>
                        </div>
                    </Row>
                </Col>
            </Row>
            <Row>
                <Col className='d-flex justify-content-center'>
                    <div className='displayMemory'>
                        <Row className='d-flex justify-content-center'>
                            {memoryItem.length === 0 ? <h2>No current memories</h2> :
                                memoryItem.filter((item: { isDeleted: any; }) => !item.isDeleted).map((memory: any, idx: any) => {
                                    let Title = memory.title.substring(0, 10);
                                    if (Title.length === 10) {
                                        Title = `${Title}...`
                                    }
                                    return (
                                        <Col key={idx} xs={4} md={3} lg={3} className='cardNoPad'>
                                            <Button onClick={() => handleClickedMemory(memory)} variant='' className='allFolderBtn'>
                                                <img className='folderImg' src={memory.image} alt='clickable image' />
                                            </Button>
                                            <p className='text-center memoryTitle'>{Title}</p>
                                            <p className='text-center memoryDate'>{memory.date}</p>
                                        </Col>
                                    );
                                })
                            }
                        </Row>
                    </div>
                </Col>
            </Row>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Button onClick={handleEditFolder} className='editBtnFold' variant='' >Edit</Button>
                <Button onClick={() => { setShow(true); }} className='deleteBtnFold' variant='' >Delete</Button>
                <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Feature in development</Tooltip>}>
                    <span className="d-inline-block">
                        <Button disabled style={{ pointerEvents: 'none' }} className='shareBtnFold' variant=''>Share</Button>
                    </span>
                </OverlayTrigger>
            </div>
            <Row className="desktopBtnRow">
                <Col className="desktopAddCol">
                    <Button variant='' onClick={() => { navigate("/AddMemory"); setIsMemoryEdit(false); }} className="desktopAddBtn">Add Memory +</Button>
                </Col>
                <Col className="d-flex justify-content-center">
                    <Button onClick={() => navigate('/dashboard')} className="moreMemories" variant="">
                        Back
                    </Button>
                </Col>
                <Col className="desktopAddCol">
                    <Button variant='' onClick={() => { navigate("/AddFolder"); setIsEditFolder(false); }} className="desktopAddBtn2">Add Folder +</Button>
                </Col>
            </Row>
        </Container>
    )
}
