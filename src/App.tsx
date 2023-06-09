import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import AddMemory from './Components/AddMemoryComponent/AddMemory';
import DashBoard from './Components/HomePageComponent/DashBoard';
import SignIn from './Components/SignInComponent/SignIn';
import SignInInfo from './Components/SignInComponent/SignInInfo';
import SignUpInfo from './Components/SignUpComponent/SignUp';
import AddFolder from './Components/AddFolderComponent/AddFolder';
import ClickedFolder from './Components/ClickedFolder/ClickedFolder';
import ShownMemory from './Components/ShownMemory/ShownMemory';
import useInfo from './Components/Hooks/useHooks';
import { MyContext } from './Components/context';

export default function App() {

  return (
    <div className='body'>
      <MyContext.Provider value={useInfo()}>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<SignIn />} />
            <Route path='/SignInInfo' element={<SignInInfo />} />
            <Route path='/SignUp' element={<SignUpInfo />} />
            <Route path='/DashBoard' element={<DashBoard />} />
            <Route path='/AddMemory' element={<AddMemory />} />
            <Route path='/AddFolder' element={<AddFolder />} />
            <Route path='/ClickedFolder' element={<ClickedFolder />} />
            <Route path='/Memory' element={<ShownMemory />} />
          </Routes>
        </BrowserRouter>
      </MyContext.Provider>
    </div>
  );
}