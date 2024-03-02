import React, {useState, useEffect} from 'react'
import axios from 'axios';
import { API_URL } from '../../utils/const';
import Swal from 'sweetalert2';
import "./pemesanan.css"
import ProductModal from './ProductModal';
import Sidebar from '../../components/Sidebar';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import ReactPaginate from 'react-paginate';


const PemesananList = () => {
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
            const response = await axios.get(`${API_URL}/transactions`);
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

    const handleStatusChange = async (transactionId) => {
        const { value: newStatus } = await Swal.fire({
            title: "Select Status",
            input: "select",
            inputOptions: {
                "Menunggu": "Menunggu",
                "Diproses": "Diproses",
                "Selesai": "Selesai"
            },
            inputPlaceholder: "Select status",
            showCancelButton: true,
            inputValidator: (value) => {
                return new Promise((resolve) => {
                    resolve();
                });
            }
        });
        if (newStatus) {
            try {
                await axios.patch(`${API_URL}/transactions/${transactionId}`, { status_pemesanan: newStatus });
                getPemesanan();
                Swal.fire({
                    icon: "success",
                    title: "Status Updated",
                    text: "Pemesanan status has been updated successfully."
                });
            } catch (error) {
                console.error('Error updating status:', error);
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Failed to update status. Please try again later."
                });
            }
        }
    };

    const deletePemesanan = async (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`${API_URL}/transactions/${id}`);
                    getPemesanan();
                    Swal.fire({
                        title: "Deleted!",
                        text: "Your file has been deleted.",
                        icon: "success"
                    });
                } catch (error) {
                    console.error('Error deleting data:', error);
                    Swal.fire({
                        title: "Oops...",
                        text: "Something went wrong!",
                        icon: "error"
                    });
                }
            }
        });
    };

    const openProductModal = (transactionId) => {
        setSelectedTransaction(transactionId); 
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
        const date = new Date(dateString);
        const formattedDate = date.toLocaleDateString('en-US'); 
        return formattedDate;
    };

    const offset = currentPage * itemsPerPage;
    const currentPemesanan = sortedPemesanan.slice(offset, offset + itemsPerPage);

    return (
        <div className="">
            <Sidebar role={role} />
            <div>
                <p className='table-title'>Pemesanan List</p>
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
                                <th>Transaction ID</th>
                                <th>Customer</th>
                                <th>Status Pembayaran</th>
                                <th>Total</th>
                                <th>Payment Method</th>
                                <th>Meja</th>
                                <th>Status Pemesanan</th>
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
                                            <td>{transaction.id}</td>
                                            <td>{transaction.customer_name}</td>
                                            <td>{transaction.status}</td>
                                            <td>{transaction.total}</td>
                                            <td>{transaction.payment_method}</td>
                                            <td>{transaction.no_meja}</td>
                                            <td>{transaction.status_pemesanan}</td>
                                            <td>{formatDate(transaction.created_at)}</td>
                                            <td className="actions">
                                                <button className="edit" onClick={() => handleStatusChange(transaction.id)}>Ubah Status</button>
                                                <button className="edit" onClick={() => openProductModal(transaction.id)}>Detail</button>
                                                <button onClick={() => deletePemesanan(transaction.id)} className="delete">Batal</button>
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
                <ProductModal
                    isOpen={productModalOpen}
                    onClose={() => setProductModalOpen(false)}
                    transactionId={selectedTransaction}
                />
            </div>
        </div>
    );
}

export default PemesananList