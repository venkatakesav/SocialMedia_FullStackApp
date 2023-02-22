import { React, useContext } from 'react';
import { NavLink } from 'react-router-dom';

import { AuthContext } from '../../context/auth-context';

import './NavLinks.css';

const NavLinks = props => {
  const auth = useContext(AuthContext)
  const u__id = auth.userId

  // const nav_link_places = `/places/user/${u__id}`

  return <ul className="nav-links">
    {auth.isLoggedIn && (<li>
      <NavLink to="/" exact>PROFILE</NavLink>
    </li>)}
    {auth.isLoggedIn && (
      <li>
        <NavLink to={`/${u__id}/places`} >ALL SUBGREDDITS</NavLink>
      </li>)
    }
    {auth.isLoggedIn && (
      <li>
        <NavLink to={`/${u__id}/places/my`} >MY SUBGREDDITS</NavLink>
      </li>)
    }
    {auth.isLoggedIn && (
      <li>
        <NavLink to="/places/new">NEW SUBGREDDIT</NavLink>
      </li>)}
    {auth.isLoggedIn && (
      <li>
        <NavLink to={`/${u__id}/posts/saved`}>SAVED POSTS</NavLink>
      </li>)}
    {!auth.isLoggedIn && (
      <li>
        <NavLink to="/auth">AUTHENTICATE</NavLink>
      </li>
    )}
    {auth.isLoggedIn && (
      <li>
        <button onClick={auth.logout}>LOGOUT</button>
      </li>
    )}
  </ul>
};

export default NavLinks;