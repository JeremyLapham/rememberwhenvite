import { useContext, useState } from 'react'
import "./NavbarStyle.css";
import { Container, Navbar, Offcanvas, Nav, Modal, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import home from '../../assets/home.svg';
import setting from '../../assets/setting.svg';
import addnew from '../../assets/addnew.svg';
import memories from '../../assets/memories.svg';
import { MyContext, resetContext } from '../context';

export default function CustomNavbar() {
    const [isActive, setIsActive] = useState(false);

    const { setMoreMemoryClicked, setIsMemoryEdit, setIsEditFolder, folderLength, setMemoryItems, setUsersId, setUser, setFolders, setFolderEdit } = useContext(MyContext);

    const navigate = useNavigate();

    const handleClick = () => {
        setIsActive(!isActive);
    };

    const handleMemoryClick = () => {
        setMoreMemoryClicked(false);
        setIsActive(!isActive);
    }
    const handleMoreMemoryClick = () => {
        setMoreMemoryClicked(true);
        setIsActive(!isActive);
    }

    const LogOut = () => {
        resetContext(setUser, setUsersId, setMemoryItems, setMoreMemoryClicked, setFolders, setIsEditFolder, setFolderEdit);
        sessionStorage.clear();
        navigate('/');
    }

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <Navbar expand="lg" className="navbar-container">
            <>
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                    </Modal.Header>
                    <Modal.Body>Are you sure you want to logout?</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={() => LogOut()}>
                            Logout
                        </Button>
                    </Modal.Footer>
                </Modal>
            </>
            <Container fluid>
                <Navbar.Toggle
                    aria-controls="responsive-navbar-nav"
                    className={`hamburger border-0`}
                    onClick={handleClick}
                >
                    <div></div>
                    <div></div>
                    <div></div>
                </Navbar.Toggle>
                <Offcanvas
                    show={isActive}
                    onHide={() => setIsActive(false)}
                    placement="start"
                    className="offCanvas"
                >
                    <Offcanvas.Body className="offCanvasBody">
                        <div className='test' style={{ marginLeft: '10px' }}>
                            <Nav.Link as={Link} to='/DashBoard' onClick={handleMemoryClick}><img className='navImg' src={home} alt='home picture' />
                                <h1 className='navWords d-inline'>Home</h1></Nav.Link>
                        </div>
                        <div style={{ marginLeft: '6px' }}>
                            <Nav.Link disabled={folderLength === 0 ? true : false} as={Link} to='/AddMemory' onClick={() => setIsMemoryEdit(false)}><img className='navImg' src={addnew} alt='addnew picture' />
                                <h1 className='navWords d-inline'>Add Memory</h1></Nav.Link>
                        </div>
                        <div style={{ marginLeft: '6px' }}>
                            <Nav.Link as={Link} to='/AddFolder' onClick={() => setIsEditFolder(false)}><img className='navImg' src={addnew} alt='addnew picture' />
                                <h1 className='navWords d-inline'>Add Folder</h1></Nav.Link>
                        </div>
                        <div style={{ marginLeft: '7px' }}>
                            <Nav.Link as={Link} to='/DashBoard' onClick={handleMoreMemoryClick}><img className='navImg' src={memories} alt='home picture' />
                                <h1 className='navWords d-inline'>Memories</h1></Nav.Link>
                        </div>
                        <div style={{ marginLeft: '9px' }}>
                            <Nav.Link onClick={handleShow}><img className='navImg' src={setting} alt='home picture' />
                                <h1 className='navWords d-inline'>Logout</h1></Nav.Link>
                        </div>
                    </Offcanvas.Body>
                </Offcanvas>
            </Container>
        </Navbar>
    );
}