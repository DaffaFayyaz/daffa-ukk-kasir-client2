import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { API_URL } from '../../utils/const';
import Swal from 'sweetalert2';
import Sidebar from '../../components/Sidebar';
import { useNavigate } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import AddDiscountDetailModal from './AddDiscountDetailModal';



const DiscountDetail = () => {
    const [discount, setDiscount] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [itemsPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(0); 
    const Navigate = useNavigate();

    const refreshToken = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/token`);
            const decoded = jwtDecode(response.data.accessToken);
            if (decoded.role !== 'Admin') {
                Navigate("/dashboard");
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "You're not permitted to go there!",
                });
            }
        } catch (error) {
            if(error.response){
                Navigate("/");
            }
        }
    };

    useEffect(() => {
        refreshToken();
    }, []);

    const getDiscount = async () => {
        try {
            const response = await axios.get(`${API_URL}/discountdetail`);
            setDiscount(response.data.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        getDiscount();
    }, []);

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
                    await axios.delete(`${API_URL}/discountdetail/${id}`);
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

    const handlePageChange = ({ selected }) => {
        setCurrentPage(selected);
    };

    const offset = currentPage * itemsPerPage;
    const currentDiscount = discount.slice(offset, offset + itemsPerPage);

    const groupByDiscountId = (data) => {
        return data.reduce((acc, currentValue) => {
            const { id_discount } = currentValue;
            if (!acc[id_discount]) {
                acc[id_discount] = [];
            }
            acc[id_discount].push(currentValue);
            return acc;
        }, {});
    };

    const groupedDiscounts = groupByDiscountId(currentDiscount);

    return (
        <div>
            <AddDiscountDetailModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAdd={handleAddDiscount}
                getDiscount={getDiscount}
            />
            <button className="add-discount-button" onClick={() => setIsModalOpen(true)}>Add New DiscountDetail</button>
            <Sidebar role="Admin"/>
            <div>
                <p className='table-title'>DiscountDetail List</p>
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
                                <th>Nama Product</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.values(groupedDiscounts).map((discounts, index) => {
                                const discount = discounts[0]?.discount;
                                return (
                                    <tr key={index}>
                                        <td>{index + 1 + offset}</td>
                                        <td>{discount && discount.nama_discount}</td>
                                        <td>
                                            {discounts.map((discount) => (
                                                <React.Fragment key={discount.id_product}>
                                                    {discount.product?.name}
                                                    {discounts.length > 1 && ', '}
                                                </React.Fragment>
                                            ))}
                                        </td>
                                        <td className="actions">
                                            <button className="edit" onClick={() => handleEditClick(discount?.id)}>Edit</button>
                                            <button onClick={() => deleteDiscount(discount?.id)} className="">Delete All</button>
                                        </td>
                                    </tr>
                                );
                            })}
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
    );
};

export default DiscountDetail;
