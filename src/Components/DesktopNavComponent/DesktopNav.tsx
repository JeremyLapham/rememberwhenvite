import { useContext, useState } from 'react'
import "./DesktopNav.css";
import { Navbar, Button, Row, Col, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Navlogo from '../../assets/elephantLogo.svg';
import { MyContext } from '../context';

export default function DesktopNav() {
    const [isActive, setIsActive] = useState(false);

    const { setMoreMemoryClicked, setIsEditFolder, setIsMemoryEdit } = useContext(MyContext);

    const handleMemoryClick = () => {
        setMoreMemoryClicked(false);
        setIsActive(!isActive);
    }
    const handleMoreMemoryClick = () => {
        setMoreMemoryClicked(true);
        setIsActive(!isActive);
    }
    return (
        <Navbar className='desktopNavbar'>
            <Row className='navRow'>
                <Col md={4} lg={4} xl={4} className='d-flex'>
                    <Col>
                        <img src={Navlogo} className='navLogo'></img>
                    </Col>
                    <Col>
                        <h1 className='navTitle'>Remember When...</h1>
                    </Col>
                </Col>
                <Col md={8} lg={8} xl={8} className='d-flex justify-content-end'>
                    <Col>
                        <Nav.Link as={Link} to='/DashBoard' onClick={handleMemoryClick}>
                            <Button className='navBtn'>Home</Button>
                        </Nav.Link>
                    </Col>
                    <Col className='borderCol'>
                        <Nav.Link as={Link} to='/Settings'>
                            <Button className='navBtn'>Setting</Button>
                        </Nav.Link>
                    </Col>
                    <Col>
                        <Nav.Link as={Link} to='/AddMemory' onClick={() => setIsMemoryEdit(false)}>
                            <Button className='navBtn'>Add Memory</Button>
                        </Nav.Link>
                    </Col>
                    <Col className='borderCol'>
                        <Nav.Link as={Link} to='/AddFolder' onClick={() => setIsEditFolder(false)}>
                            <Button className='navBtn'>Add Folder</Button>
                        </Nav.Link>
                    </Col>
                    <Col>
                        <Nav.Link as={Link} to='/DashBoard' onClick={handleMoreMemoryClick}>
                            <Button className='navBtn'>Memories</Button>
                        </Nav.Link>
                    </Col>
                </Col>
            </Row>
        </Navbar>
    )
}