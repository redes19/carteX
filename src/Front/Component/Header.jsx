import { Route, Routes, Link  } from "react-router-dom";
import React from "react";
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';

const Header = () => {
    return (
      <div className="headerPage">
        <Link to="/Inscription">Inscription</Link>
        <Link to="/Connection">Connection</Link>
        <div className='searchBar-container'>
          <Box component="form" sx={{'& > :not(style)': { m: 1, width: '25ch' }, }} noValidate autoComplete="off" >
            <TextField className="searchBar" id="searchBar" label="Recherche" variant="outlined"/>
          </Box>  
        </div>
      </div>
    );
};

export default Header;