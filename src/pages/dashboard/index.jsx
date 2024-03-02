import React, { useState, useEffect } from 'react'
import { API_URL } from '../../utils/const';
import { jwtDecode } from "jwt-decode";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import './dashboard.css'

const Dashboard = () => {
  const [token, setToken] = useState('');
  const [expire, setExpire] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [akun, setAkun] = useState('');
  const [meja, setMeja] = useState('');
  const [product, setProduct] = useState('');
  const [discount, setDiscount] = useState('');
  const [pemesanan, setPemesanan] = useState([]);
  const Navigate = useNavigate();

  useEffect(() => {
    refreshToken();
  }, []);

  const refreshToken = async() => {
      try {
          const response = await axios.get(`http://localhost:8000/token`)
          setToken(response.data.accessToken)
          const decoded = jwtDecode(response.data.accessToken)
          setName(decoded.name)
          setRole(decoded.role)
          setExpire(decoded.exp)
      } catch (error) {
          if(error.response){
          Navigate("/")
      }
    }
  }

    const getAkun = async () => {
      try {
          const response = await axios.get(`${API_URL}/users`);
          setAkun(response.data.data);
      } catch (error) {
          console.error('Error fetching data:', error);
      }
  }

    const getMeja = async () => {
      try {
          const response = await axios.get(`${API_URL}/meja`);
          setMeja(response.data.data);
      } catch (error) {
          console.error('Error fetching data:', error);
      }
  }

    const getDiscount = async () => {
      try {
          const response = await axios.get(`${API_URL}/discounts`);
          setDiscount(response.data.data);
      } catch (error) {
          console.error('Error fetching data:', error);
      }
  }

    const getProduct = async () => {
      try {
          const response = await axios.get(`${API_URL}/products`);
          setProduct(response.data.data);
          console.log(product)
      } catch (error) {
          console.error('Error fetching data:', error);
      }
  }

  const getPemesanan = async () => {
    try {
        const response = await axios.get(`${API_URL}/transactions`);
        setPemesanan(response.data.data);
        console.log(pemesanan)
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}


  useEffect(() => {
    getAkun();
    getMeja();
    getDiscount();
    getProduct();
    getPemesanan();
  }, []);

  return (
    <div className="dashboard-container">
      <Sidebar role={role}/>
      <div className="content">
        <h1 className='dashboard-text'>Data Summary</h1>
        {(role === 'Admin') ? (
          <>
            <div className="card">
              <div className="card-header">Total Akun</div>
              <div className="card-body">{akun.length}</div>
            </div>
            <div className="card">
              <div className="card-header">Total Meja</div>
              <div className="card-body">{meja.length}</div>
            </div>
            <div className="card">
              <div className="card-header">Total Product</div>
              <div className="card-body">{product.length}</div>
            </div>
            <div className="card">
              <div className="card-header">Total Discount</div>
              <div className="card-body">{discount.length}</div>
            </div>
          </>
        ) : (role === 'Kasir') ? (
          <>
            <div className="card">
              <div className="card-header">Active Pemesanan</div>
              <div className="card-body">{pemesanan.filter(transaction => transaction.status_pemesanan !== "Selesai").length}</div>
            </div>
            <div className="card">
              <div className="card-header">Total Riwayat Pemesanan</div>
              <div className="card-body">{pemesanan.filter(transaction => transaction.status_pemesanan == "Selesai").length}</div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  )
}

export default Dashboard