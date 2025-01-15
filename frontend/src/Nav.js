import React, { useState } from 'react';
import logo from './images/GAKONDOBYKOFFITOURSLOGO.png';
import {
  MDBContainer,
  MDBNavbar,
  MDBNavbarBrand,
  MDBNavbarToggler,
  MDBNavbarNav,
  MDBNavbarItem,
  MDBNavbarLink,
  MDBIcon,
  MDBCollapse
} from 'mdb-react-ui-kit';

const Nav = () =>  {
  const [openNavSecond, setOpenNavSecond] = useState(false);

  return (
    <MDBNavbar expand='lg' light style={{backgroundColor: '#4F5A3B'}}>
      <MDBContainer fluid>
        <MDBNavbarToggler
          aria-expanded='false'
          aria-label='Toggle navigation'
          onClick={() => setOpenNavSecond(!openNavSecond)}
        >
          <MDBIcon icon='bars' fas style={{color:"#ffffff"}} />
        </MDBNavbarToggler>
        <MDBCollapse navbar open={openNavSecond}>
          <MDBNavbarNav>
            <MDBNavbarLink active aria-current='page' style={{color:"#ffffff"}} href='#'>
              Home
            </MDBNavbarLink>
            <MDBNavbarLink style={{color:"#ffffff"}} href='#'>Activities</MDBNavbarLink>
            <MDBNavbarLink style={{color:"#ffffff"}} href='#'>Booking</MDBNavbarLink>
            <MDBNavbarLink style={{color:"#ffffff"}} href='#'>Contact</MDBNavbarLink>
          </MDBNavbarNav>
        </MDBCollapse>
      </MDBContainer>
      <img className="ms-auto navbar-nav"
      style={{width:'100px', height:'75px', marginRight:'25px'}} 
      src={logo} alt='logo includes name of the owner and phone number' />
    </MDBNavbar>
  );
}

export default Nav;