import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { numberToRupiah } from "../../utils/number-to-rupiah";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { Layout } from "../../components/Layout";
import { API_URL } from "../../utils/const";
import { Product } from "./Product";
import './checkout.css';
import useSnap from "../../hooks/useSnap";

function Checkout() {
    const navigate = useNavigate();
    const [cart, setCart] = useState([]);
    const [totalOrder, setTotalOrder] = useState(0);
    const [meja, setMeja] = useState('');
    const [idmeja, setIdMeja] = useState('');
    const [customer, setCustomer] = useState({
        name: '',
        email: ''
    });
    const [snapShow, setSnapShow] = useState(false)
    const {snapEmbed} = useSnap()
    
    const getCart = useCallback(async () => {
        const cart = await localStorage.getItem('cart')
        if(cart) {
            setCart(JSON.parse(cart))
        } else {
            setCart([])
        }
    }, []);

    const getIdMeja = useCallback(async () => {
        const idmeja = await localStorage.getItem('id_meja')
        if(idmeja) {
            setIdMeja(idmeja);
            console.log(idmeja);
        } else {
            setIdMeja('')
        }
    }, []);

    const getMeja = useCallback(async () => {
        const meja = await localStorage.getItem('no_meja')
        if(meja) {
            setMeja(meja)
            console.log(meja)
        } else {
            setMeja('')
        }
    }, []);

    const handleChange = (e) => {
        setCustomer({
            ...customer,
            [e.target.name]: e.target.value
        })
    }

    const pay = async () => {
        if(!customer.name || !customer.email) {
            alert(`${!customer.name ? 'Nama' : 'Email'} harus diisi`)
            return
        }

        const response = await fetch(`${API_URL}/transactions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                customer_name: customer.name,
                customer_email: customer.email,
                id_meja: idmeja,
                products: cart.map((item) => ({
                    id: item.id,
                    quantity: item.count
                }))
            })
        }).then((res) => res.json())
        
        if(response && response.status === 'success') {
            await localStorage.removeItem('cart')
            setSnapShow(true)
            snapEmbed(response.data.snap_token, 'snap-container', {
                onSuccess: function (result) {
                    console.log('success', result);
                    navigate(`/order-status?transaction_id=${response.data.id}`)
                    
                    setSnapShow(false);
                },
                onPending: function (result) {
                    console.log('pending', result);
                    navigate(`/order-status?transaction_id=${response.data.id}`)
                    setSnapShow(false);
                },
                onClose: function (result) {
                    navigate(`/order-status?transaction_id=${response.data.id}`)
                    setSnapShow(false);
                },
            })
        } else if(response && response.status === 'error') {
            alert(response.errors.map((msg) => msg.msg).join(', '))
        }
    }

    useEffect(() => {
        getCart()
        getMeja()
        getIdMeja()
    }, [getCart, getMeja, getIdMeja])


    useEffect(() => {
        const totalOrder = cart.reduce((total, item) => {
            const discountPercentage = parseFloat(localStorage.getItem(`discount_${item.id}`)) || 0;
            const discountedPrice = Math.max(0, item.price * (1 - discountPercentage / 100)) * item.count;
            return total + discountedPrice;
        }, 0);
    
        setTotalOrder(totalOrder);
    }, [cart]);
    

    return (
        <Layout title="Order Summary" onBack={!snapShow ? () => navigate(`/order/${idmeja}`) : undefined}>
            {!snapShow && (
                <>
                    <p className="section-title">Detail Produk</p>
                    <div className="summary">
                        {cart.map((item) => (
                            <Product key={item.id} item={{...item, discount: localStorage.getItem(`discount_${item.id}`)}} />
                        ))}
                        <div className="item">
                            <p>Total Order</p>
                            <p>{numberToRupiah(totalOrder)}</p>
                        </div>
                    </div>
                    <p className="section-title">Detail Pelanggan</p>
                    <Input label="No Meja" value={meja} name="no_meja" disabled/>
                    <Input label="Nama Lengkap" value={customer.name} onChange={handleChange} name="name" />
                    <Input label="Email" value={customer.email} onChange={handleChange} name="email" />
                    <div className="action-pay">
                        <Button onClick={pay}>Bayar Sekarang</Button>
                    </div>
                </>
            )}
            <div id="snap-container"></div>
        </Layout>
    );
}

export default Checkout;
