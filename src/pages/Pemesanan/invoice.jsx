import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { API_URL } from '../../utils/const';
import './invoice.css';
import { numberToRupiah } from '../../utils/number-to-rupiah';
import ReactToPrint from 'react-to-print';

const Invoice = () => {
    const { id } = useParams();
    const [pemesanan, setPemesanan] = useState(null);
    const componentRef = useRef();

    useEffect(() => {
        const getPemesananById = async () => {
            try {
                const response = await axios.get(`${API_URL}/transactions/${id}`);
                setPemesanan(response.data.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        getPemesananById();
    }, [id]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    return (
        <div>
            <ReactToPrint
                trigger={() => <button>Generate PDF Receipt</button>}
                content={() => componentRef.current}
            />
            <div className="invoice-container" ref={componentRef}>
                <h1>Receipt</h1>
                {pemesanan && (
                    <div className="invoice-details">
                        <p><strong>Transaction ID:</strong> {pemesanan.id}</p>
                        <p><strong>Status:</strong> {pemesanan.status}</p>
                        <p><strong>Customer Name:</strong> {pemesanan.customer_name}</p>
                        <p><strong>Customer Email:</strong> {pemesanan.customer_email}</p>
                        <p><strong>Payment Method:</strong> {pemesanan.payment_method}</p>
                        <p><strong>Table Number:</strong> {pemesanan.no_meja}</p>
                        <p><strong>Tanggal:</strong> {formatDate(pemesanan.created_at)}</p>
                    </div>
                )}
                {pemesanan && (
                    <table className="invoice-products">
                        <thead>
                            <tr>
                                <th>Product Name</th>
                                <th>Quantity</th>
                                <th>Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pemesanan.products.map((item, index) => (
                                <tr key={index}>
                                    <td>
                                        {item.nama_discount ? `${item.name} (${item.nama_discount} ${item.potongan_harga}% off)` : item.name}
                                    </td>
                                    <td>{item.quantity}</td>
                                    <td>
                                        {item.initial_price > item.price ? (
                                            <>
                                                <del>{numberToRupiah(item.initial_price)}</del> {numberToRupiah(item.price)}
                                            </>
                                        ) : (
                                            numberToRupiah(item.price)
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
                {pemesanan && (
                    <p className="invoice-total"><strong>Total:</strong> {numberToRupiah(pemesanan.total)}</p>
                )}
            </div>
        </div>
    );
};

export default Invoice;
