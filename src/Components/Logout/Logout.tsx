import { useContext } from 'react';
import CustomNavbar from '../navComponent/NavbarComponent';
import './Logout.css';
import { Button, Col, Container, Row } from 'react-bootstrap';
import elephant from '../../assets/elephantLogo.svg';
import { useNavigate } from 'react-router-dom';
import { MyContext, resetContext } from '../context';
import DesktopNav from '../DesktopNavComponent/DesktopNav';

export default function Logout() {
    const navigate = useNavigate();

    const { setMoreMemoryClicked, setUser, setFolders, setUsersId, setFolderEdit, setMemoryItems, setIsEditFolder } = useContext(MyContext);

    const LogOut = () => {
        resetContext(setUser, setUsersId, setMemoryItems, setMoreMemoryClicked, setFolders, setIsEditFolder, setFolderEdit);
        sessionStorage.clear();
        navigate('/');
    }
    return (
        <Container fluid>
            <CustomNavbar />
            <DesktopNav />
            <Row>
                <Col>
                    <img className='elephant' src={elephant} alt='Elephant logo in logout page' />
                </Col>
            </Row>
            <Row>
                <Col className='d-flex justify-content-center'>
                    <h1 className='settingTxt'>Settings...</h1>
                </Col>
            </Row>
            <Row>
                <Col className='d-flex justify-content-center align-items-center'>
                    <Button onClick={() => LogOut()} className='logoutBtn' variant=''>Logout</Button>
                </Col>
            </Row>
        </Container>
    )
}
