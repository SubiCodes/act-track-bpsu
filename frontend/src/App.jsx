import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './login/Login.jsx';
import Signup from './Signup/Signup.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';
import Ongoing from './Ongoing/Ongoing.jsx';
import Completed from './Completed/Completed.jsx';
import MyAccount from './MyAccount/MyAccount.jsx';
import EditAccount from './MyAccount/EditAccount.jsx';
import AddProject from './AddProject/AddProject.jsx';
import OpenProject from './OpenProject/OpenProject.jsx';
import OpenProjectMember from './OpenProjectMember/OpenProjectMember.jsx';
import AddTask from './OpenProject/AddTask.jsx';

function App() {

  return (

    //import BrowserRouter and Routes to be able to use Links

    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Login />}/>
        <Route path="/signup" element={<Signup/>}/>
        <Route path='/ongoing' element={
          <ProtectedRoute><Ongoing/></ProtectedRoute>
        }/>
        <Route path='/completed' element={
          <ProtectedRoute><Completed/></ProtectedRoute>
        }/>
        <Route path='/myaccount' element={
          <ProtectedRoute><MyAccount/></ProtectedRoute>
        }/>

        <Route path='/editaccount' element={
          <ProtectedRoute><EditAccount/></ProtectedRoute>
        }/>

        <Route path='/addproject' element={
          <ProtectedRoute><AddProject/></ProtectedRoute>
        }/>

        <Route path='/openproject/:project_id' element={
          <ProtectedRoute><OpenProject/></ProtectedRoute>
        } />

        <Route path='/openprojectmember/:project_id' element={
          <ProtectedRoute><OpenProjectMember/></ProtectedRoute>
        } />

        <Route path='/addtask/:project_id' element={
          <ProtectedRoute><AddTask/></ProtectedRoute>
        }/>



      </Routes>
      
      
    </BrowserRouter>
  )
}

export default App
