import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { API_URL } from "../../utils/const";
import { FloatingCheckout } from "./FloatingCheckout";
import { ItemProduct } from "./ItemProduct";
import { Header } from "./Header";
import axios from "axios";

import './home.css';

function Home() {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([""]);
    const { id } = useParams();
    const [meja, setMeja] = useState(null);
    const [totalDiscount, setTotalDiscount] = useState(0);
    const [loading, setLoading] = useState(true); 


    const getCartFromLocalStorage = useCallback(async () => {
      const cart = await JSON.parse(localStorage.getItem('cart')) ?? [];
      setCart(cart);
      return cart;
    }, [])

    const getProducts = useCallback(async () => {
      const {data} = await fetch(`${API_URL}/products`).then((res) => res.json());
      console.log(data)
      const cart = await getCartFromLocalStorage();
      const product = data.map((item) => {
        const productItem = cart.find((product) => product.id === item.id);
        if(productItem) {
          return {
            ...item,
            count: productItem.count
          }
        }
        return item;
      })

      product.forEach((item) => {
        if (item.discountDetails.length > 0) {  
          const discount = item.discountDetails[0]; 
          item.nama_discount = discount.discount.nama_discount;
          item.potongan_harga = discount.discount.potongan_harga;
        } else {
          item.nama_discount = null;
          item.potongan_harga = 0;
        }
      });
      setProducts(product);
      setLoading(false);
  }, [getCartFromLocalStorage])

  useEffect(() => {
    const getMeja = async () => {
      const response = await axios.get(`${API_URL}/meja/${id}`);
      const mejaData = response.data
      localStorage.setItem('no_meja', mejaData.data.no_meja);
      localStorage.setItem('id_meja', mejaData.data.id);
      setMeja(mejaData.data.no_meja);
    };
    getMeja();
  },[id]);

  useEffect(() => {
    const discountTotal = cart.reduce((total, item) => {
      return total + item.potongan_harga;
    }, 0);
    setTotalDiscount(discountTotal);
  }, [cart]);

  const handleProductChange = async (product, value) => {
    let newCart = [...cart];
    if(value === 0) {
      newCart = cart.filter(item => item.id !== product.id);
    } else {
      const productItem = cart.find(item => item.id === product.id);
      const findIndex = cart.findIndex(item => item.id === product.id);
      if(productItem) { 
        productItem.count = value;
        newCart[findIndex] = productItem;
      } else if(value > 0) {
        newCart.push({
          ...product,
          count: value
        })
      }
    }
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));

    newCart.forEach(item => {
      localStorage.setItem(`discount_${item.id}`, item.potongan_harga);
    });
  }

  useEffect(() => {
    getProducts();
  }, [getProducts]);

  const makananProducts = products.filter(product => product.kategori === "Makanan");
  const minumanProducts = products.filter(product => product.kategori === "Minuman");

  return (
    <div className='container-home'>
      <Header />
      {meja ? (
        <>
          <p className="meja">Table: {meja}</p>
          <div className='main-content'>
            {loading ? (
              <div className="loading-container">
                <div className="spinner"></div>
                <p className="loading-text">Loading...</p>
              </div>
            ) : (
              <>
                <section>
                  <h2>Makanan</h2>
                  <div className='main-content'>
                    {makananProducts.map((product) => (
                      <ItemProduct key={product.id} defaultCount={product.count} name={product.name} deskripsi={product.deskripsi} price={product.price} image={product.image} kategori={product.kategori} stock={product.stock} discount={product.potongan_harga} discount_name={product.nama_discount} onProductChange={(value) => handleProductChange(product, value)} />
                    ))}
                  </div>
                </section>
                <section>
                  <h2>Minuman</h2>
                  <div className='main-content'>
                    {minumanProducts.map((product) => (
                      <ItemProduct key={product.id} defaultCount={product.count} name={product.name} deskripsi={product.deskripsi} price={product.price} image={product.image} kategori={product.kategori} stock={product.stock} discount={product.potongan_harga} discount_name={product.nama_discount} onProductChange={(value) => handleProductChange(product, value)} />
                    ))}
                  </div>
                </section>
              </>
            )}
          </div>
          {!loading && cart.length > 0 && (
            <FloatingCheckout cart={cart}/>
          )}
        </>
      ) : (
        <p className="scan-ulang">Scan Ulang QR</p>
      )}
    </div>
  );
  }
  
  export default Home;