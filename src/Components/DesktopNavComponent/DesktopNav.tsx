import { useContext, useState } from "react";
import "./DesktopNav.css";
import { Navbar, Button, Nav, Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import Navlogo from "../../assets/elephantLogo.svg";
import { MyContext } from "../context";

export default function DesktopNav() {
    const [isActive, setIsActive] = useState(false);

    const { setMoreMemoryClicked } = useContext(MyContext);
    const { setIsEditFolder } = useContext(MyContext);
    const { setIsMemoryEdit } = useContext(MyContext);

    const handleMemoryClick = () => {
        setMoreMemoryClicked(false);
        setIsActive(!isActive);
    };
    const handleMoreMemoryClick = () => {
        setMoreMemoryClicked(true);
        setIsActive(!isActive);
    };

    return (
        <Navbar>
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
                        <Nav.Link as={Link} to="/Settings">
                            <Button className="navBtn btnBorder">Setting</Button>
                        </Nav.Link>
                        <Nav.Link
                            as={Link}
                            to="/AddMemory"
                            onClick={() => setIsMemoryEdit(false)}
                        >
                            <Button className="navBtn">Add Memory</Button>
                        </Nav.Link>
                        <Nav.Link
                            as={Link}
                            to="/AddFolder"
                            onClick={() => setIsEditFolder(false)}
                        >
                            <Button className="navBtn btnBorder">Add Folder</Button>
                        </Nav.Link>
                        <Nav.Link as={Link} to="/DashBoard" onClick={handleMoreMemoryClick}>
                            <Button className="navBtn">Memories</Button>
                        </Nav.Link>
                    </Col>
                </Row>
            </Container>
        </Navbar>
    );
}
