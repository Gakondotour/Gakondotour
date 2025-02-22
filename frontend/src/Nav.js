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
          <MDBNavbarNav className='navbar-nav ' style={{marginLeft:"2vw"}}>
            <MDBNavbarLink active aria-current='page' className='link-hover' style={{color:"#ffffff"}} href='/'>
              <strong>Home</strong>
            </MDBNavbarLink>
            <MDBNavbarLink style={{color:"#ffffff"}} className='link-hover' href='/ActivatyImages'><strong>Gallery</strong></MDBNavbarLink>
            <MDBNavbarLink style={{color:"#ffffff"}} className='link-hover' href='/contact'><strong>Contact</strong></MDBNavbarLink>
          </MDBNavbarNav>
        </MDBCollapse>
      </MDBContainer>
      <img className="ms-auto"
      style={{width:'100px', height:'75px', marginRight:'25px', marginRight:"2vw"}} 
      src={logo} alt='logo includes name of the owner and phone number' />
    </MDBNavbar>
  );
}

export default Nav;