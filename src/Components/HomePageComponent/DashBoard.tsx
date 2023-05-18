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
    const { username, setSelectedMemory, setUser, setIsMemoryEdit, setIsEditFolder, setFolderName, setSelectedFolder, setMoreMemoryClicked, setFolders, setUsersId, setMemoryItems, folders, moreMemoryClicked, memoryItems, setFolderLength } = useContext(MyContext);
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
        setMoreMemoryClicked(!moreMemoryClicked);
    }

    useEffect(() => {
        const GetLoggedInData = async () => {
            const userId = sessionStorage.getItem('UserId');
            const userName = sessionStorage.getItem('Username');
            if (userId && userName) {
                setUsersId(parseInt(userId));
                setUser(userName);
                const userMemoryItems = await getMemoryItemsByUserId(parseInt(userId));
                const displayFolder = await getFolderByUserId(parseInt(userId));
                setMemoryItems(userMemoryItems);
                setFolders(displayFolder);
                setFolderLength(folders.filter((item: { isDeleted: boolean; }) => !item.isDeleted).length);
            } else {
                const loggedIn = loggedInData();
                sessionStorage.setItem('UserId', JSON.stringify(loggedIn.userId));
                sessionStorage.setItem('Username', loggedIn.publisherName);
                setUsersId(loggedIn.userId);
                const userMemoryItems = await getMemoryItemsByUserId(loggedIn.userId);
                const displayFolder = await getFolderByUserId(loggedIn.userId);
                setMemoryItems(userMemoryItems);
                setFolders(displayFolder);
                setFolderLength(folders.filter((item: { isDeleted: boolean; }) => !item.isDeleted).length);
            }
        }
        setFolderLength(folders.filter((item: { isDeleted: boolean; }) => !item.isDeleted).length);
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
        }, 7000);

        return () => {
            clearTimeout(timeout);
        };
    }, []);

    const handleFolderClick = (folder: { id: number, name: string, isDeleted: boolean, folderId: number, userId: number }, name: string) => {
        setSelectedFolder(folder);
        setFolderName(name);
        sessionStorage.setItem('Folder', JSON.stringify(folder));
        navigate('/ClickedFolder');
    }

    const handlememoryClickDash = (memory: Memory) => {
        sessionStorage.setItem('Memory', JSON.stringify(memory));
        setSelectedMemory(memory);
        navigate('/memory')
    }
    return (
        <Container fluid>
            <CustomNavbar />
            <DesktopNav />
            <Row className='d-flex align-items-center'>
                <Col xs={6}>
                    <img className='logoEle' src={logo} alt='remember when logo, elephant holding balloon' />
                </Col>
                <Col xs={6} className='d-flex flex-column justify-content-end'>
                    <Row>
                        <div className='d-flex justify-content-end'>
                            <Button onClick={() => { navigate('/AddFolder'); setIsEditFolder(false); }} className='addNewFolder' variant='' style={{ display: 'flex', alignItems: 'center' }}>
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
                            <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">{folders.length === 0 ? 'Add folders to be able to add memories' : ''}</Tooltip>}>
                                <span>
                                    <Button onClick={() => { navigate('/AddMemory'); setIsMemoryEdit(false); }} className='addNew' variant='' style={{ display: 'flex', alignItems: 'center' }} disabled={folders.filter((item: { isDeleted: boolean; }) => !item.isDeleted).length === 0}>
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
            {moreMemoryClicked ?
                <Row>
                    <Col className='rememberWhenTop'>
                        <h1 className='remmeberWhen'>Remember When...</h1>
                    </Col>
                </Row>
                :
                <Row>
                    <Col className='helloTopTxt'>
                        <h1 className='helloTxt'>Hello, <p style={{ color: 'black' }} className='d-inline'>{username}</p></h1>
                        <p className='welcomeTxt'>Welcome to your memories, remember when...</p>
                    </Col>
                </Row>
            }

            {moreMemoryClicked ?
                <Container>
                    <Row>
                        <Col className='d-flex justify-content-center folderDisplay'>
                            <Row className='desktopFolder'>
                                {folders.filter((item: { isDeleted: boolean; }) => !item.isDeleted).length === 0 ?
                                    <Col className="text-center">
                                        {showNoMemoriesMessage ?
                                            <h1>You have no folders</h1>
                                            :
                                            <h1>Loading{dots}</h1>
                                        }
                                    </Col>
                                    :
                                    folders.filter((item: { isDeleted: boolean; }) => !item.isDeleted).map((folder: { id: number; name: string; isDeleted: boolean; folderId: number; userId: number }, idx: number) => {
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
                    <Col className={`${memoryItems.filter((item: { isDeleted: boolean; }) => !item.isDeleted).length >= 7 ? 'longMemoryBox' : 'memoryBox'}`}>
                        {memoryItems.filter((item: { isDeleted: boolean; }) => !item.isDeleted).length === 0 ?
                            <Col className="text-center">
                                {showNoMemoriesMessage ?
                                    <h1>You have no memories</h1>
                                    :
                                    <h1>Loading{dots}</h1>
                                }
                            </Col>
                            :
                            memoryItems.filter((item: { isDeleted: boolean; }) => !item.isDeleted).map((cardInfo: Memory, idx: number) => {
                                let Title = cardInfo.title.substring(0, 10);
                                if (Title.length === 10) {
                                    Title = `${Title}...`
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
                    <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">{folders.filter((item: { isDeleted: boolean; }) => !item.isDeleted).length === 0 ? 'Add folders to be able to add memories' : ''}</Tooltip>}>
                        <span className="d-inline-block">
                            <Button variant=''
                                onClick={() => { navigate("/AddMemory"); setIsMemoryEdit(false); }}
                                className="desktopAddBtn"
                                disabled={folders.filter((item: { isDeleted: boolean; }) => !item.isDeleted).length === 0}>Add Memory +</Button>
                        </span>
                    </OverlayTrigger>
                </Col>
                <Col className="d-flex justify-content-center">
                    <Button onClick={handleClick} className="moreMemories" variant="">
                        {moreMemoryClicked ? "Go Back" : "Click for all memories"}
                    </Button>
                </Col>
                <Col className="desktopAddCol">
                    <Button variant='' onClick={() => { setIsEditFolder(false); navigate("/AddFolder");}} className="desktopAddBtn2">Add Folder +</Button>
                </Col>
            </Row>
        </Container >
    )
}