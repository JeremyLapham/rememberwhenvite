import { useContext, useState } from "react";
import "./DesktopNav.css";
import { Navbar, Button, Nav, Container, Row, Col, Modal } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import Navlogo from "../../assets/elephantLogo.svg";
import { MyContext, resetContext } from "../context";

export default function DesktopNav() {
    const { setMoreMemoryClicked, setUser, setFolders, setUsersId, setFolderEdit, setMemoryItems, setIsEditFolder, setIsMemoryEdit, folderLength } = useContext(MyContext);

    const [isActive, setIsActive] = useState(false);

    const handleMemoryClick = () => {
        setMoreMemoryClicked(false);
        setIsActive(!isActive);
    };
    const handleMoreMemoryClick = () => {
        setMoreMemoryClicked(true);
        setIsActive(!isActive);
    };

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const navigate = useNavigate();


    const LogOut = () => {
        resetContext(setUser, setUsersId, setMemoryItems, setMoreMemoryClicked, setFolders, setIsEditFolder, setFolderEdit);
        sessionStorage.clear();
        navigate('/');
    }

    return (
        <Navbar>
            <>
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton className="logoutModal">
                    </Modal.Header>
                    <Modal.Body className="logoutModalTxt">Are you sure you want to logout?</Modal.Body>
                    <Modal.Footer  className="logoutModalFooter">
                        <Button className="cancelModalBtn" variant="secondary" onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button className="logoutModalBtn" variant="primary" onClick={() => LogOut()}>
                            Logout
                        </Button>
                    </Modal.Footer>
                </Modal>
            </>
            <Container fluid>
                <Row className="navRow">
                    <Col md={4} className="d-flex align-items-center">
                        <img src={Navlogo} className="navLogo"></img>
                        <h1 className="navTitle">Remember When...</h1>
                    </Col>
                    <Col md={8} className="d-flex justify-content-end">
                        <Nav.Link as={Link} to="/DashBoard" onClick={handleMemoryClick}>
                            <Button className="navBtn navGroup">Home</Button>
                        </Nav.Link>
                        <Nav.Link
                            disabled={folderLength === 0 ? true : false}
                            as={Link}
                            to="/AddMemory"
                            onClick={() => setIsMemoryEdit(false)}>
                            <Button disabled={folderLength === 0 ? true : false} className="navBtn btnBorder">Add Memory</Button>
                        </Nav.Link>
                        <Nav.Link
                            as={Link}
                            to="/AddFolder"
                            onClick={() => setIsEditFolder(false)}
                        >
                            <Button className="navBtn">Add Folder</Button>
                        </Nav.Link>
                        <Nav.Link as={Link} to="/DashBoard" onClick={handleMoreMemoryClick}>
                            <Button className="navBtn btnBorder">Memories</Button>
                        </Nav.Link>
                        <Nav.Link onClick={handleShow}>
                            <Button className="navBtn">Logout</Button>
                        </Nav.Link>
                    </Col>
                </Row>
            </Container>
        </Navbar>
    );
}
