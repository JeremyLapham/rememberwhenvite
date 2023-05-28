import { useContext, useEffect, useState } from 'react';
import { Col, Container, Row, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import logo from '../../assets/elephantLogo.svg';
import folderImg from '../../assets/folderpic.png'
import './DashBoard.css';
import { useNavigate } from 'react-router-dom';
import CustomNavbar from '../navComponent/NavbarComponent';
import { IoAddSharp } from 'react-icons/io5';
import { checkToken, getFolderByUserId, getMemoryItemsByUserId, loggedInData } from '../Services/DataService';
import { MyContext } from '../context';
import DesktopNav from '../DesktopNavComponent/DesktopNav';

export default function DashBoard() {
    const userData = useContext(MyContext)
    const [dots, setDots] = useState('');
    interface Memory {
        id: number,
        title: string,
        image: string,
        tags: string,
        description: string,
        date: string
    }

    const navigate = useNavigate();

    const handleClick = () => {
        userData.setMoreMemoryClicked(!userData.moreMemoryClicked);
    }

    useEffect(() => {
        const GetLoggedInData = async () => {
            const userId = sessionStorage.getItem('UserId');
            const userName = sessionStorage.getItem('Username');
            if (userId && userName) {
                userData.setUsersId(parseInt(userId));
                userData.setUser(userName);
                const userMemoryItems = await getMemoryItemsByUserId(parseInt(userId));
                const displayFolder = await getFolderByUserId(parseInt(userId));
                userData.setMemoryItems(userMemoryItems);
                userData.setFolders(displayFolder);
                userData.setAudio('');
            } else {
                const loggedIn = loggedInData();
                sessionStorage.setItem('UserId', JSON.stringify(loggedIn.userId));
                sessionStorage.setItem('Username', loggedIn.publisherName);
                userData.setUsersId(loggedIn.userId);
                const userMemoryItems = await getMemoryItemsByUserId(loggedIn.userId);
                const displayFolder = await getFolderByUserId(loggedIn.userId);
                userData.setMemoryItems(userMemoryItems);
                userData.setFolders(displayFolder);
                userData.setAudio('');
            }
        }
        if (!checkToken()) {
            navigate('/SignInInfo');
        } else {
            GetLoggedInData();
        }
        const interval = setInterval(() => {
            setDots((prevDots) => prevDots.length >= 3 ? '' : prevDots + '.');
        }, 500);

        return () => clearInterval(interval);
    }, []);

    const [showNoMemoriesMessage, setShowNoMemoriesMessage] = useState(false);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setShowNoMemoriesMessage(true);
        }, 4000);

        return () => {
            clearTimeout(timeout);
        };
    }, []);

    const handleFolderClick = (folder: { id: number, name: string, isDeleted: boolean, folderId: number, userId: number }, name: string) => {
        userData.setSelectedFolder(folder);
        userData.setFolderName(name);
        sessionStorage.setItem('Folder', JSON.stringify(folder));
        navigate('/ClickedFolder');
    }

    const handlememoryClickDash = (memory: Memory) => {
        sessionStorage.setItem('Memory', JSON.stringify(memory));
        userData.setSelectedMemory(memory);
        navigate('/memory')
    }
    return (
        <Container fluid>
            <CustomNavbar folderSize={userData.folders.length}/>
            <DesktopNav folderSize={userData.folders.length}/>
            <Row className='d-flex align-items-center'>
                <Col xs={6}>
                    <img className='logoEle' src={logo} alt='remember when logo, elephant holding balloon' />
                </Col>
                <Col xs={6} className='d-flex flex-column justify-content-end'>
                    <Row>
                        <div className='d-flex justify-content-end'>
                            <Button onClick={() => { navigate('/AddFolder'); userData.setIsEditFolder(false); }} className='addNewFolder' variant='' style={{ display: 'flex', alignItems: 'center' }}>
                                <Col xs={9}>
                                    <p className='addNewTxt'>Add Folder</p>
                                </Col>
                                <Col xs={3} className='d-flex justify-content-center'>
                                    <IoAddSharp size={28} />
                                </Col>
                            </Button>
                        </div>
                    </Row>
                    <Row>
                        <div className='d-flex justify-content-end'>
                            <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">{userData.folders.length === 0 ? 'Add folders to be able to add memories' : ''}</Tooltip>}>
                                <span>
                                    <Button onClick={() => { navigate('/AddMemory'); userData.setIsMemoryEdit(false); }} className='addNew' variant='' style={{ display: 'flex', alignItems: 'center' }} disabled={userData.folders.length === 0}>
                                        <Col xs={9}>
                                            <p className='addNewTxt'>Add Memory</p>
                                        </Col>
                                        <Col xs={3} className='d-flex justify-content-center'>
                                            <IoAddSharp size={28} />
                                        </Col>
                                    </Button>
                                </span>
                            </OverlayTrigger>
                        </div>
                    </Row>
                </Col>
            </Row>
            {userData.moreMemoryClicked ?
                <Row>
                    <Col className='rememberWhenTop'>
                        <h1 className='remmeberWhen'>Remember When...</h1>
                    </Col>
                </Row>
                :
                <Row>
                    <Col className='helloTopTxt'>
                        <h1 className='helloTxt'>Hello, <p style={{ color: 'black' }} className='d-inline'>{userData.username}</p></h1>
                        <p className='welcomeTxt'>Welcome to your memories, remember when...</p>
                    </Col>
                </Row>
            }

            {userData.moreMemoryClicked ?
                <Container fluid className='folderDisplayCont'>
                    <Row className='folderDisplayRow'>
                        <Col className='d-flex justify-content-center folderDisplay'>
                            <Row className='desktopFolder'>
                                {userData.folders.length === 0 ?
                                    <Col className="text-center">
                                        {showNoMemoriesMessage ?
                                            <h1>You have no folders</h1>
                                            :
                                            <h1>Loading{dots}</h1>
                                        }
                                    </Col>
                                    :
                                    userData.folders.map((folder: { id: number; name: string; isDeleted: boolean; folderId: number; userId: number }, idx: number) => {
                                        let Title = folder.name.substring(0, 6);
                                        if (Title.length === 6) {
                                            Title = `${Title}...`;
                                        }
                                        return (
                                            <Col className="spaceFolders" key={idx} xs={4} md={4} lg={4} xl={4}>
                                                <Button className="folderBtn" onClick={() => { handleFolderClick(folder, folder.name); }} variant="">
                                                    <img src={folderImg} className="folderSize" alt="Folder" />
                                                    <p className="folderFont">{Title}</p>
                                                </Button>
                                            </Col>
                                        );
                                    })
                                }
                            </Row>
                        </Col>
                    </Row>
                </Container>
                :
                <Row>
                    <Col className={`${userData.memoryItems.length >= 6 ? 'longMemoryBox' : 'memoryBox'}`}>
                        {userData.memoryItems.length === 0 ?
                            <Col className="text-center">
                                {showNoMemoriesMessage ?
                                    <h1>You have no memories</h1>
                                    :
                                    <h1>Loading{dots}</h1>
                                }
                            </Col>
                            :
                            userData.memoryItems.map((cardInfo: Memory, idx: number) => {
                                let Title = cardInfo.title.substring(0, 10);

                                if (Title.length === 10 && cardInfo.title.length > 10) {
                                    const lastSpaceIndex = Title.lastIndexOf(' ');
                                    if (lastSpaceIndex !== -1) {
                                        Title = Title.substring(0, lastSpaceIndex) + '...';
                                    } else {
                                        Title = Title.substring(0, 9) + '...';
                                    }
                                }
                                return (
                                    <Button onClick={() => handlememoryClickDash(cardInfo)} key={idx} style={{ position: 'relative' }} variant=''>
                                        <img className='memoryCards' src={cardInfo.image} alt='Your memory image is here' />
                                        <div className='txtOnImg'>{Title}</div>
                                        <div className='dateOnImg'>{cardInfo.date}</div>
                                    </Button>
                                );
                            })
                        }
                    </Col>
                </Row>
            }

            <Row className="desktopBtnRow">
                <Col className="desktopAddCol">
                    <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">{userData.folders.length === 0 ? 'Add folders to be able to add memories' : ''}</Tooltip>}>
                        <span className="d-inline-block">
                            <Button variant=''
                                onClick={() => { navigate("/AddMemory"); userData.setIsMemoryEdit(false); }}
                                className="desktopAddBtn"
                                disabled={userData.folders.length === 0}>Add Memory +</Button>
                        </span>
                    </OverlayTrigger>
                </Col>
                <Col className="d-flex justify-content-center">
                    <Button onClick={handleClick} className="moreMemories" variant="">
                        {userData.moreMemoryClicked ? "Go Back" : "Click for all memories"}
                    </Button>
                </Col>
                <Col className="desktopAddCol">
                    <Button variant='' onClick={() => { userData.setIsEditFolder(false); navigate("/AddFolder"); }} className="desktopAddBtn2">Add Folder +</Button>
                </Col>
            </Row>
        </Container >
    )
}