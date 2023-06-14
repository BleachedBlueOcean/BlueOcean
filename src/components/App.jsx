/* eslint-disable space-before-blocks */
import React, { useState, useEffect } from 'react';
import Trading from './trading_page/Trading.jsx';
import '../css/App.css';
import InitialPage from './initial_page/InitialPage.jsx';
import UserProfile from './user_profile/UserProfile.jsx';

// import controllers from '../backend/controllers'
// import axios from 'axios';
// import dns from 'dns'

import NavBarTemp from './containerTemplates/NavBarTemp.jsx';
import LeftColTemp from './containerTemplates/LeftColTemp.jsx';
import GraphNavTemp from './containerTemplates/GraphNavTemp.jsx';
import CryptoBuySellTemp from './containerTemplates/CryptoBuySellTemp.jsx';

export const Context = React.createContext();
// import global theme
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme.js';

const App = (props) => {
  //will remove
  const [user, setUser] = useState({});
  const [view, setView] = useState('default');
  const [signedIn, setSignedIn] = useState(false);
  const [guest, setGuest] = useState(false);
  const [previewImage, setPreviewImage] = useState(user.profilePic);
  const [showBadgesModal, setShowBadgesModal] = useState(false);

  const getUsers = async () => {
    try {
      const data = await controllers.getAllUsers();
      // console.log(data);
      setUser(data[0]);
    } catch (err) {
      console.error(err);
    }
  };

  const getUserById = async (id) => {
    try {
      const data = await controllers.getUserByID(id);
      // console.log(data);
    } catch (err) {
      console.error(err);
    }
  };

  const addUser = async (obj) => {
    try {
      await controllers.createUser(obj);
    } catch (err) {
      console.error(err);
    }
  };

  const updateUser = async (id, obj) => {
    try {
      const data = await controllers.updateUser(id, obj);
      // console.log(data);
    } catch (err) {
      console.error(err);
    }
  };
  const deleteUser = async (id) => {
    try {
      const data = await controllers.deleteUser(id);
      // console.log(data);
    } catch (err) {
      console.log(err);
    }
  };


  const renderView = () => {
    switch (view) {
    case 'default':
      return (
          <div>

            <InitialPage setView={setView} setUser={setUser} setGuest={setGuest} setSignedIn={setSignedIn} setPreviewImage={setPreviewImage}/>
          </div>
      );
    case 'trading':
      return (
          <>
            <>
              <NavBarTemp signedIn={signedIn}
                setSignedIn={setSignedIn}
                user={user} previewImage={previewImage} setPreviewImage={setPreviewImage}
                setView={setView}
                setShowBadgesModal={setShowBadgesModal}
              />
              <LeftColTemp user={user} />
            </>
            <div className="trading">
              <Trading setView={setView} user={user} signedIn={signedIn} />
            </div>
          </>
      );
      case "user_profile":
        return (
        <>
          <NavBarTemp signedIn={signedIn}
            setSignedIn={setSignedIn}
            user={user} previewImage={previewImage} setPreviewImage={setPreviewImage}
            setView={setView}
            setShowBadgesModal={setShowBadgesModal}/>
          {/* <LeftColTemp user={user}/> */}
          <div className="user_profile">

            <UserProfile setView={setView} user={user} setUser={setUser} signedIn={signedIn} previewImage={previewImage}
            setPreviewImage={setPreviewImage}
            showBadgesModal={showBadgesModal}
            setShowBadgesModal={setShowBadgesModal}/>
          </div>
        </>
        )
    }
  };

  useEffect(() => {

    renderView()
  }, [view])

  useEffect(()=>{
    if(signedIn || guest ){
      setView('trading');
    } else {
      console.log('signed in use effect triggered');
      setView('default');
    }


  },[signedIn, guest])


  return (
    <ThemeProvider theme={theme}>

      {renderView()}

    </ThemeProvider>
  );

};

export default App;

