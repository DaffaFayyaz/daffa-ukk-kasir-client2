import axios from 'axios';
import React, { useEffect, useState,  } from 'react'
import { API_URL } from '../../utils/const';
import './discount.css';
import Swal from 'sweetalert2';
import AddDiscountModal from './DiscountModal';
import EditDiscountModal from './EditDiscountModal';
import Sidebar from '../../components/Sidebar';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import ReactPaginate from 'react-paginate';
import AssignDiscountModal from './AssignDiscountModal';

const Discount = () => {
    const [discount, setDiscount] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editDiscountId, setEditDiscountId] = useState(null);
    const [initialDiscountData, setInitialDiscountData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [itemsPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(0); 
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [selectedDiscountId, setSelectedDiscountId] = useState(null);
    const [token, setToken] = useState('');
    const [role, setRole] = useState('');
    const Navigate = useNavigate();

    const refreshToken = async() => {
        try {
            const response = await axios.get(`http://localhost:8000/token`)
            setToken(response.data.accessToken)
            const decoded = jwtDecode(response.data.accessToken)

            if (decoded.role !== 'Admin') {
                Navigate("/dashboard");
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "You're not permitted to go there!",
                });
            }
            setName(decoded.name)
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

    const getDiscount = async () => {
        try {
            const response = await axios.get(`${API_URL}/discounts`);
            setDiscount(response.data.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
        }
    }

    useEffect(() => {
        getDiscount();
    }, []);

    const openAssignModal = (discountId) => {
        setIsAssignModalOpen(true);
        setSelectedDiscountId(discountId);
    };

    const closeAssignModal = () => {
        setIsAssignModalOpen(false);
        setSelectedDiscountId(null);
    };

    const deleteDiscount = async (id) => {
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
                    await axios.delete(`${API_URL}/discounts/${id}`);
                    getDiscount();
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

    const handleAddDiscount = (newDiscount) => {
        setDiscount([...discount, newDiscount]);
    };

    const getDiscountById = async (id) => {
        try {
            const response = await axios.get(`${API_URL}/discounts/${id}`);
            return response.data.data;
        } catch (error) {
            console.error('Error fetching table data by ID:', error);
            throw error;
        }
    };

    const handleUpdateDiscount = (updatedDiscount) => {
        const updatedDiscountList = discount.map(item => {
            if (item.id === updatedDiscount.id) {
                return updatedDiscount;
            }
            return item;
        });
        setDiscount(updatedDiscountList);
    };

    const handleEditClick = async (id) => {
        try {
            const tableData = await getDiscountById(id);
            setEditDiscountId(id);
            setInitialDiscountData(tableData);
            setIsEditModalOpen(true);
        } catch (error) {
            console.error('Error fetching table data for edit:', error);
        }
    };

    const handlePageChange = ({ selected }) => {
        setCurrentPage(selected);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const formattedDate = date.toLocaleDateString('en-US'); // Change 'en-US' to your desired locale
        return formattedDate;
    };

    const offset = currentPage * itemsPerPage;
    const currentDiscount = discount.slice(offset, offset + itemsPerPage);

    return (
        <div>
            <AddDiscountModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAdd={handleAddDiscount}
                getDiscount={getDiscount}
            />
            <EditDiscountModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onUpdate={handleUpdateDiscount}
                discountId={editDiscountId}
                initialDiscountData={initialDiscountData}
                getDiscount={getDiscount}
            />
            <AssignDiscountModal
                isOpen={isAssignModalOpen}
                onClose={closeAssignModal}
                discountId={selectedDiscountId}
                getDiscount={getDiscount}
            />
            <button className="add-discount-button" onClick={() => setIsModalOpen(true)}>Add New Discount</button>
            <Sidebar role="Admin"/>
            <div>
            <p className='table-title'>Discount List</p>
                {loading ? (
                    <div className="loading-container">
                        <div className="spinner"></div>
                        <p>Loading...</p>
                    </div>
                ) : (
                    <table className="discount-table">
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>Nama Discount</th>
                                <th>Potongan Harga</th>
                                <th>Tanggal End</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentDiscount.map((discounts, index) => (
                                <tr key={discounts.id}>
                                    <td>{index + 1 + offset}</td>
                                    <td>{discounts.nama_discount}</td>
                                    <td>{discounts.potongan_harga}%</td>
                                    <td>{formatDate(discounts.tgl_end)}</td>
                                    <td className="actions">
                                        <button className="add" onClick={() => openAssignModal(discounts.id)}>Kelola Discount</button>
                                        <button className="edit" onClick={() => handleEditClick(discounts.id)}>Edit</button>
                                        <button onClick={() => deleteDiscount(discounts.id)} className="">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
                <div className='pagination-container-discount'>
                    <ReactPaginate
                        pageCount={Math.ceil(discount.length / itemsPerPage)}
                        pageRangeDisplayed={5}
                        marginPagesDisplayed={2}
                        onPageChange={handlePageChange}
                        containerClassName="pagination-discount"
                        activeClassName="active"
                        previousLabel="Previous"
                        nextLabel="Next"
                    />
                </div>
            </div>
        </div>
    )
}

export default Discount