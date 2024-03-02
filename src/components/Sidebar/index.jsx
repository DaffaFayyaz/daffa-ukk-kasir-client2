import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiLogOut } from 'react-icons/fi'; // Import the logout icon from react-icons library
import './Sidebar.css';
import axios from 'axios';

const Sidebar = ({ role }) => {
  const Navigate = useNavigate();
  let links = [];
  if (role === 'Admin') {
    links = [
      { to: '/dashboard', label: 'Home' },
      { to: '/product', label: 'Menu' },
      { to: '/discount', label: 'Discount' },
      { to: '/meja', label: 'Meja' },
      { to: '/akun', label: 'Akun' },
      { to: '/pemesanan', label: 'Pemesanan' },
      { to: '/riwayatpemesanan', label: 'Riwayat Pemesanan' }
    ];
  } else if (role === 'Kasir') {
    links = [
      { to: '/dashboard', label: 'Home' },
      { to: '/pemesanan', label: 'Pemesanan' },
      { to: '/riwayatpemesanan', label: 'Riwayat Pemesanan' }
    ];
  }

  const Logout = async() => {
      try {
          await axios.delete('http://localhost:8000/logout');
          Navigate("/");
      } catch (error) {
          console.log(error)
      }
  }


  return (
    <div className="sidebar">
      <div className="sidebar-header">
        Welcome {role}!
      </div>
      <ul className="sidebar-menu">
        {links.map((link, index) => (
          <li key={index}>
            <Link to={link.to}>{link.label}</Link>
          </li>
        ))}
      </ul>
      <div className="logout-button" >
        <button className="logout-btn" onClick={Logout}>
          <FiLogOut className="logout-icon" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
