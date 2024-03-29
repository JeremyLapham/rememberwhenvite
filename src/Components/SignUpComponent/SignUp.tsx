import { useState } from 'react';
import logo from '../../assets/elephantLogo.svg';
import 'bootstrap/dist/css/bootstrap.min.css';
import './SignUp.css';
import { Button, Col, Container, InputGroup, Row, Toast, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { createAccount } from '../../Services/DataService';
import swal from 'sweetalert';
import { SlLock, SlLockOpen } from 'react-icons/sl';

export default function SignUpInfo() {
    const [Username, setUsername] = useState('');
    const [Password, setPassword] = useState('');
    const [Email, setEmail] = useState('');
    const [clickSignUp, setClickSignUp] = useState(false);
    const regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()])(?=.{8,})/;

    const navigate = useNavigate();

    const handelSubmit = () => {
        if (Password.match(regex) || Username !== '' || Email !== '') {
            let userData = {
                Id: 0,
                Username,
                Email,
                Password
            }
            const GetLoggedInData = async () => {
                let result = await createAccount(userData)

                if (result) {
                    setClickSignUp(true);
                    setTimeout(() => {
                        navigate('/SignInInfo');
                    }, 2000);
                } else {
                    setClickSignUp(false);
                    toggleShowA();
                }
            }
            GetLoggedInData()
        } else {
            swal('Please make sure your password has atleast One Uppercase, One Lowercase, One number, One Special Character, and atleast 8 Characters long');
        }
    }


    const handleSignInClick = () => {
        navigate('/SignInInfo');
    };


    const [showA, setShowA] = useState(false);

    const toggleShowA = () => setShowA(!showA);

    const [isClicked, setIsClicked] = useState(false);
    const handleShowPassword = () => {
        setIsClicked(!isClicked)
    }

    function userNoSpace(input: any) {
        const cleanedInput = input.replace(/\s/g, '');
        setUsername(cleanedInput);
    }

    function emailNoSpace(input: any) {
        const cleanedInput = input.replace(/\s/g, '');
        setEmail(cleanedInput);
    }

    return (
        <Container fluid>
            <Row>
                <Col className="mb-2">
                    <Toast className='toast' show={showA} onClose={toggleShowA} delay={4000} autohide>
                        <Toast.Body>The Username you entered is already taken.</Toast.Body>
                    </Toast>
                </Col>
            </Row>
            <Row>
                <Col className="mb-2">
                    <Toast className='toast' show={clickSignUp} onClose={() => setClickSignUp(false)} delay={4000} autohide>
                        <Toast.Body style={{ color: 'black' }}>Account has been made</Toast.Body>
                    </Toast>
                </Col>
            </Row>
            <Row>
                <Col className='d-flex justify-content-center'>
                    <img className='logo mt-5' src={logo} alt='remember when logo, elephant holding balloon' />
                </Col>
                <h1 style={{ color: '#FF6161' }}>Currently not in use due to complications with databases</h1>
            </Row>
            <Row className='d-flex justify-content-center signInBg pt-4'>
                <Row>
                    <Col className='centerInput'>
                        <Button onClick={handleSignInClick} variant=''><h1 className='signInTxt'>Sign In</h1></Button>
                    </Col>
                    <Col className='centerInput'>
                        <h1 className='signUpTxt1' style={{ textDecoration: 'underline' }}>Sign Up</h1>
                    </Col>
                </Row>
                <Row>
                    <Col className='d-flex justify-content-center'>
                        <Form>
                            <Row>
                                <Col className='centerInput'>
                                    <Form.Group className="mb-3 d-flex flex-column align-items-center">
                                        <Form.Label className='signUpInput'>Username</Form.Label>
                                        <Form.Control className='inputField' type='text' placeholder='Enter your username' onChange={(e) => userNoSpace(e.target.value)} value={Username} />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col className='centerInput'>
                                    <Form.Group className="mb-3 d-flex flex-column align-items-center">
                                        <Form.Label className='email'>Email</Form.Label>
                                        <Form.Control className='inputField' type='text' placeholder='Enter your email' onChange={(e) => emailNoSpace(e.target.value)} value={Email} />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col className='centerInput'>
                                    <h4 className='signUpInputPassword'>Password</h4>
                                </Col>
                            </Row>
                            <Row>
                                <Col className='centerInput'>
                                    <Form.Group controlId="Password">
                                        <InputGroup className='inputField'>
                                            <Form.Control
                                                type={`${isClicked ? 'text' : 'password'}`}
                                                placeholder="Enter your password"
                                                className='inputField'
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
                                </Col>
                            </Row>
                        </Form>
                    </Col>
                </Row>
                <Row>
                    <Col className='centerInput'>
                        <Button onClick={handelSubmit} className='signUpBtn' variant='' disabled={clickSignUp}>Sign Up</Button>
                    </Col>
                </Row>
            </Row>
        </Container>
    )
}
