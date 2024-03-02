/* eslint-disable react/prop-types */
import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

import { statusMapping, statusPemesananMapping } from "../../utils/status-mapping";
import { API_URL } from "../../utils/const";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { Layout } from "../../components/Layout";
import { ProductItem } from "./ProductItem";
import { Item } from "./Item";
import './order-status.css'

const OrderStatus = () => {
    const [transaction, setTransaction] = useState(null);
    const [searchTransactionId, setSearchTransactionId] = useState('');
    const [emptyMessage, setEmptyMessage] = useState('');
    const [searchParams, setSearchParams] = useSearchParams();
    const [idmeja, setIdMeja] = useState('');
    const navigate = useNavigate();
    
    const getTransactionDetail = useCallback(async (transactionId) => {
        if(!transactionId) return alert('Transaction ID harus diisi');
        const response = await fetch(`${API_URL}/transactions/${transactionId}`);
        const res = await response.json();
        if(res.data) {
            setTransaction(res.data);
            console.log(res.data.products)
            setSearchParams({transaction_id: transactionId}, {replace: true});
            setEmptyMessage('');
        } else {
            setEmptyMessage('Transaksi tidak ditemukan');
            setTransaction(null);
            setSearchParams({}, {replace: true});
        }
    }, [setSearchParams])

    const handleCopyText = (text) => {
        navigator.clipboard.writeText(text)
            .then(() => {
                alert('Transaction ID copied to clipboard! ');
            })
            .catch((error) => {
                alert('Failed to copy Transaction ID! ');
            });
    };

    useEffect(() => {
        const storedId = localStorage.getItem('id_meja');
        if (storedId) {
            setIdMeja(storedId);
        }
    }, []);
    
    useEffect(() => {
        const transactionId = searchParams.get('transaction_id');
        if(transactionId) {
            getTransactionDetail(transactionId);
        } else {
            setEmptyMessage('Belum ada transaksi yang dicari, silahkan masukkan ID Transaksi');
        }
    }, [getTransactionDetail, searchParams]);


    return (
        <Layout title="Status Pesanan" onBack={() => navigate(`/order/${idmeja}`, {replace: true})}>
            <Input label="Kode Pesanan" value={searchTransactionId} onChange={(e) => setSearchTransactionId(e.target.value)} />
            <Button onClick={() => getTransactionDetail(searchTransactionId)}>Cek Status Pesanan</Button>
            <hr/>
            {emptyMessage && <p className="empty-message">{emptyMessage}</p>}
            {transaction && (
                <>
                    <div className="transaction-status">
                        <Item label="Transaction ID (Click To Copy!)" value={transaction.id} onClick={() => handleCopyText(transaction.id)} />
                        <Item label="Customer Name" value={transaction.customer_name} />
                        <Item label="Customer Email" value={transaction.customer_email} />
                        <Item label="Table" value={transaction.no_meja} />
                        <Item label="Status Pembayaran" value={statusMapping(transaction.status)} />
                        <Item label="Status Pemesanan" value={statusPemesananMapping(transaction.status_pemesanan)} />
                        {transaction.payment_method && (
                            <Item label="Payment Method" value={transaction.payment_method} />
                        )}
                    </div>
                    <div className="transaction-status">
                    {transaction.products.map((product) => (
                            <ProductItem
                                key={product.id}
                                name={product.name}
                                price={product.price}
                                initial_price={product.initial_price}
                                totalItem={product.quantity}
                                discount={product.discount && product.discount.length > 0 ? product.discount[0].nama_discount : 0}
                                potongan_harga={product.discount && product.discount.length > 0 ? product.discount[0].potongan_harga : 0}
                            />
                        ))}
                        <ProductItem name="Total" price={transaction.total} />
                    </div>
                    {transaction.status === "PENDING_PAYMENT" && (
                        <a href={transaction.snap_redirect_url} target="_blank" rel="noopener noreferrer">
                            <Button>Bayar</Button>
                        </a>
                    )}
                </>
            )}
        </Layout>
    );
};

export default OrderStatus;
