import { useContext, useEffect, useState } from 'react';
import logo from '../../assets/elephantLogo.svg';
import './SignIn.css';
import { Button, Col, Container, Row, Toast, Form, InputGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { GetLoggedInUserData, login } from '../Services/DataService';
import { MyContext } from '../context';
import { SlLock, SlLockOpen } from 'react-icons/sl';

export default function SignInInfo() {
    const { setUser } = useContext(MyContext);

    const [Username, setUsername] = useState('');
    const [Password, setPassword] = useState('');
    const [clickedSignIn, setClickedSignIn] = useState(false);
    const [dots, setDots] = useState('');

    useEffect(() => {
        const interval = setInterval(() => {
            setDots((prevDots) => prevDots.length >= 3 ? '' : prevDots + '.');
        }, 500);

        return () => clearInterval(interval);
    }, []);

    const navigate = useNavigate();

    const handleSignInClick = () => {
        navigate('/SignUp');
    };

    const handleLogin = async (name: string) => {
        setClickedSignIn(true)
        let userData = {
            Username,
            Password
        }
        setUser(Username);
        try {
            let token = await login(userData);
            if (token.token != null) {
                localStorage.setItem("Token", token.token);
                await GetLoggedInUserData(Username);
                navigate('/DashBoard', { state: { user: name } });
            }
        } catch (error) {
            setClickedSignIn(false)
            toggleShowA()
        }
    }

    const [showA, setShowA] = useState(false);
    const [isClicked, setIsClicked] = useState(false);
    const handleShowPassword = () => {
        setIsClicked(!isClicked)
    }

    const toggleShowA = () => setShowA(!showA);

    return (
        <Container fluid>
            <Row>
                <Col md={6} className="mb-2">
                    <Toast className='toast' show={showA} onClose={toggleShowA} delay={4000} autohide>
                        <Toast.Body>Invalid Username or Password</Toast.Body>
                    </Toast>
                </Col>
            </Row>
            <div>
                {clickedSignIn ?
                    <h1 className='loading'>{`Loading${dots}`}</h1> : ''}
            </div>
            <Row>
                <Col className='d-flex justify-content-center'>
                    <img className='logo mt-5' src={logo} alt='remember when logo, elephant holding balloon' />
                </Col>
            </Row>
            <Row className='d-flex justify-content-center signInBg pt-4'>
                <Row>
                    <Col className='d-flex justify-content-center'>
                        <h1 className='signInTxt' style={{ textDecoration: 'underline' }}>Sign In</h1>
                    </Col>
                    <Col className='d-flex justify-content-center'>
                        <Button onClick={handleSignInClick} variant=''><h1 className='signUpTxt'>Sign Up</h1></Button>
                    </Col>
                </Row>
                <Row>
                    <Col className='d-flex justify-content-center'>
                        <h4 className='userNameInput'>Username</h4>
                    </Col>
                </Row>
                <Row>
                    <Col className='d-flex justify-content-center'>
                        <input onChange={({ target: { value } }) => setUsername(value)} type='text' value={Username} className='inputField' placeholder='Enter your username' />
                    </Col>
                </Row>
                <Row>
                    <Col className='d-flex justify-content-center'>
                        <h4 className='passwordInput'>Password</h4>
                    </Col>
                </Row>
                <Row>
                    <Col className='d-flex justify-content-center'>
                        <Form>
                            <Form.Group controlId="Password">
                                <InputGroup className='inputField'>
                                    <Form.Control
                                        type={`${isClicked ? 'text' : 'password'}`} 
                                        className='inputField'
                                        placeholder="Enter your password"
                                        onChange={({ target: { value } }) => setPassword(value)}
                                    />
                                    <Button className='lockBG' variant='' onClick={handleShowPassword}>
                                        <InputGroup.Text className='lockBG'>
                                            {isClicked ?
                                                <SlLockOpen size={25} />
                                                :
                                                <SlLock size={25} />}
                                        </InputGroup.Text>
                                    </Button>
                                </InputGroup>
                            </Form.Group>
                        </Form>
                    </Col>
                </Row>
                <Row>
                    <Col className='d-flex justify-content-center'>
                        <h6 className='forgotPass'>Forgot Password?</h6>
                    </Col>
                </Row>
                <Row>
                    <Col className='d-flex justify-content-center'>
                        <Button onClick={() => handleLogin(Username)} className='signInBtnTwo' variant=''>Sign In</Button>
                    </Col>
                </Row>
            </Row>
        </Container>
    )
}
