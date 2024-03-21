import React, {useState, useEffect} from 'react'
import axios from 'axios';
import { API_URL } from '../../utils/const';
import Swal from 'sweetalert2';
import Sidebar from '../../components/Sidebar';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import NotifModal from './NotifModal';
import { numberToRupiah } from '../../utils/number-to-rupiah';


const NotifTransaction = () => {
    const [pemesanan, setPemesanan] = useState([]);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState('');
    const [expire, setExpire] = useState('');
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [productModalOpen, setProductModalOpen] = useState(false); 
    const [role, setRole] = useState('');
    const [itemsPerPage] = useState(10); 
    const [currentPage, setCurrentPage] = useState(0);
    const Navigate = useNavigate();

    const refreshToken = async() => {
        try {
            const response = await axios.get(`http://localhost:8000/token`)
            setToken(response.data.accessToken)
            const decoded = jwtDecode(response.data.accessToken)
            setRole(decoded.role)
        } catch (error) {
            if(error.response){
            Navigate("/")
        }
    }
    }

    useEffect(() => {
        refreshToken();
    }, []);

    const getPemesanan = async () => {
        try {
            const response = await axios.get(`${API_URL}/transactions/notif`);
            setPemesanan(response.data.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
        }
    }

    useEffect(() => {
        getPemesanan();
    }, []);

    const openProductModal = (id) => {
        setSelectedTransaction(id); 
        setProductModalOpen(true); 
    };

    const handlePageChange = ({ selected }) => {
        setCurrentPage(selected);
    };

    const sortedPemesanan = [...pemesanan]
    .filter(transaction => transaction.status_pemesanan !== "Selesai")
    .sort((a, b) => {
        const dateA = new Date(a.created_at);
        const dateB = new Date(b.created_at);
        return dateB - dateA;
    });

    const formatDate = (dateString) => {
        const options = { 
            year: 'numeric', 
            month: '2-digit', 
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        };
        const date = new Date(dateString);
        return date.toLocaleString('en-US', options); 
    };

    const offset = currentPage * itemsPerPage;
    const currentPemesanan = sortedPemesanan.slice(offset, offset + itemsPerPage);

    return (
        <div className="">
            <Sidebar role={role} />
            <div>
                <p className='table-title'>Transaction Notif List</p>
                {loading ? (
                    <div className="loading-container">
                        <div className="spinner"></div>
                        <p>Loading...</p>
                    </div>
                ) : (
                    <>
                        <table className='pemesanan-table'>
                            <thead>
                                <tr>
                                <th>No</th>
                                <th>Transaction ID Midtrans</th>
                                <th>Payment Method</th>
                                <th>Waktu Transaksi</th>
                                <th>Order ID</th>
                                <th>Fraud Status</th>
                                <th>Gross Amount</th>
                                <th>Transaction Status</th>
                                <th>Tanggal</th>
                                <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentPemesanan
                                    .filter(transaction => transaction.status_pemesanan !== "Selesai")
                                    .map((transaction, index) => (
                                        <tr key={transaction.id}>
                                            <td>{index + 1 + offset}</td>
                                            <td>{transaction.id_transaction_midtrans}</td>
                                            <td>{transaction.payment_method}</td>
                                            <td>{transaction.transaction_time}</td>
                                            <td>{transaction.order_id}</td>
                                            <td>{transaction.fraud_status}</td>
                                            <td>{numberToRupiah(transaction.gross_amount)}</td>
                                            <td>{transaction.transaction_status}</td>
                                            <td>{formatDate(transaction.transaction_time)}</td>
                                            <td className="actions">
                                                <button className="edit" onClick={() => openProductModal(transaction.id)}>Detail</button>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </>
                )}
                <div className='pagination-container-pemesanan'>
                    <ReactPaginate
                        pageCount={Math.ceil(pemesanan.length / itemsPerPage)}
                        pageRangeDisplayed={5}
                        marginPagesDisplayed={2}
                        onPageChange={handlePageChange}
                        containerClassName="pagination-pemesanan"
                        activeClassName="active"
                        previousLabel="Previous"
                        nextLabel="Next"
                    />
                </div>
                <NotifModal
                    isOpen={productModalOpen}
                    onClose={() => setProductModalOpen(false)}
                    id={selectedTransaction}
                />
            </div>
        </div>
    );
}

export default NotifTransaction