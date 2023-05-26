import { useContext, useState } from "react";
import "./DesktopNav.css";
import { Navbar, Button, Nav, Container, Row, Col, Modal } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import Navlogo from "../../assets/elephantLogo.svg";
import { MyContext, resetContext } from "../context";

export default function DesktopNav(props: { folderSize: number; }) {
    const userData = useContext(MyContext); 

    const [isActive, setIsActive] = useState(false);

    const handleMemoryClick = () => {
        userData.setMoreMemoryClicked(false);
        setIsActive(!isActive);
    };
    const handleMoreMemoryClick = () => {
        userData.setMoreMemoryClicked(true);
        setIsActive(!isActive);
    };

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const navigate = useNavigate();


    const LogOut = () => {
        resetContext(userData.setUser, userData.setUsersId, userData.setMemoryItems, userData.setMoreMemoryClicked, userData.setFolders, userData.setIsEditFolder, userData.setFolderEdit);
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
                            disabled={props.folderSize === 0 ? true : false}
                            as={Link}
                            to="/AddMemory"
                            onClick={() => userData.setIsMemoryEdit(false)}>
                            <Button disabled={props.folderSize === 0 ? true : false} className="navBtn btnBorder">Add Memory</Button>
                        </Nav.Link>
                        <Nav.Link
                            as={Link}
                            to="/AddFolder"
                            onClick={() => userData.setIsEditFolder(false)}
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
