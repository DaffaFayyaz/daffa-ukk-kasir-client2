import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import { API_URL } from '../../utils/const';
import './notifmodal.css';
import { numberToRupiah } from '../../utils/number-to-rupiah';

const NotifModal = ({ isOpen, onClose, id }) => {
    const [notif, setNotif] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNotif = async () => {
            try {
                const response = await axios.get(`${API_URL}/transactions/notif/${id}`);
                setNotif([response.data.data]);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching notif:', error);
                setLoading(false);
            }
        };

        if (isOpen) {
            fetchNotif();
        }
    }, [isOpen, id]);

    // Function to format the transaction time
    const formatTransactionTime = (transactionTime) => {
        const date = new Date(transactionTime);
        // Options for formatting the date and time
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
        return date.toLocaleDateString('en-US', options);
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            contentLabel="Product Details"
            className=""
        >
            <h2>Transaction Notification</h2>
            {loading ? (
                <div>Loading...</div>
            ) : (
                <div className="notification-list">
                    {notif.map((notifItem, index) => (
                        <div key={index} className="notification-item">
                            <p><strong>ID Transaction Midtrans:</strong> {notifItem.id_transaction_midtrans}</p>
                            <p><strong>Payment Method:</strong> {notifItem.payment_method}</p>
                            <p><strong>Transaction Time:</strong> {formatTransactionTime(notifItem.transaction_time)}</p>
                            <p><strong>Order ID:</strong> {notifItem.order_id}</p>
                            <p><strong>Fraud Status:</strong> {notifItem.fraud_status}</p>
                            <p><strong>Status Code:</strong> {notifItem.status_code}</p>
                            <p><strong>Gross Amount:</strong> {numberToRupiah(notifItem.gross_amount)}</p>
                            <p><strong>Transaction Status:</strong> {notifItem.transaction_status}</p>
                            <p><strong>Transaction Type:</strong> {notifItem.transaction_type}</p>
                            <p><strong>Status Message:</strong> {notifItem.status_message}</p>
                            <p><strong>Signature Key:</strong> {notifItem.signature_key}</p>
                            <p><strong>Reference ID:</strong> {notifItem.reference_id}</p>
                            <p><strong>Merchant ID:</strong> {notifItem.merchant_id}</p>
                            <p><strong>Issuer:</strong> {notifItem.issuer}</p>
                            <p><strong>Currency:</strong> {notifItem.currency}</p>
                            <p><strong>Acquirer:</strong> {notifItem.acquirer}</p>
                            <p><strong>Expiry Time:</strong> {formatTransactionTime(notifItem.expiry_time)}</p>
                        </div>
                    ))}
                </div>
            )}
            <button onClick={onClose}>Close</button>
        </Modal>
    );
};

export default NotifModal;
