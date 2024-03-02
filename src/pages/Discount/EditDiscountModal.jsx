import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import { API_URL } from '../../utils/const';
import './discount.css';
import Swal from 'sweetalert2';

const EditDiscountModal = ({ isOpen, onClose, onUpdate, discountId, initialDiscountData, getDiscount }) => {
    const [nama_discount, setNamaDiscount] = useState('');
    const [potongan_harga, setPotonganHarga] = useState('');
    const [tgl_end, setTglEnd] = useState('');

    useEffect(() => {
        if (initialDiscountData) {
            setNamaDiscount(initialDiscountData.nama_discount);
            setPotonganHarga(initialDiscountData.potongan_harga);
            setTglEnd(initialDiscountData.tgl_end.substring(0, 10));
        }
    }, [initialDiscountData]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'nama_discount') setNamaDiscount(value);
        else if (name === 'potongan_harga') setPotonganHarga(value);
        else if (name === 'tgl_end') setTglEnd(value);
    };

    const handleSubmit = async () => {
        const currentDate = new Date();
        const formattedCurrentDate = currentDate.toISOString().split('T')[0];
        const formattedTglEnd = tgl_end + 'T00:00:00Z';
        if (tgl_end < formattedCurrentDate) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Discount end date cannot be earlier than the current date!",
            });
            return;
        }
        Swal.fire({
            title: "Are you sure?",
            text: "This data will be changed!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, update it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const potonganHargaInt = parseInt(potongan_harga);
                    if (potonganHargaInt > 99) {
                        Swal.fire({
                            icon: "error",
                            title: "Oops...",
                            text: "Discount amount cannot be above 100%!",
                        });
                        return;
                    }
                    if (potonganHargaInt < 1 ) {
                        Swal.fire({
                            icon: "error",
                            title: "Oops...",
                            text: "Discount amount cannot be below 1%!",
                        });
                        return;
                    }  
                    const response = await axios.patch(`${API_URL}/discounts/${discountId}`, {
                        nama_discount: nama_discount,
                        potongan_harga: potonganHargaInt,
                        tgl_end: formattedTglEnd,
                    });
                    onUpdate(response.data);
                    onClose();
                    getDiscount();
                    Swal.fire({
                        title: "Updated!",
                        text: "Your discount has been updated.",
                        icon: "success"
                    });
                } catch (error) {
                    console.error('Error updating discount:', error);
                    Swal.fire({
                        title: "Oops...",
                        text: "Something went wrong!",
                        icon: "error"
                    });
                }
            }
        });
    };
    
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            contentLabel="Edit Discount"
            className="modal"
        >
            <h2>Edit Discount</h2>
            <input
                type="text"
                name="nama_discount"
                value={nama_discount}
                onChange={handleInputChange}
                placeholder="Enter discount name"
            />
            <input
                type="number"
                name="potongan_harga"
                value={potongan_harga}
                onChange={handleInputChange}
                placeholder="Enter discount amount"
            />
            <label htmlFor="tgl_end">End Date:</label>
            <input
                type="date"
                name="tgl_end"
                value={tgl_end}
                onChange={handleInputChange}
                placeholder="End date"
            /> 
            <button onClick={handleSubmit} className="add">
                Update
            </button>
            <button onClick={onClose} className="cancel">
                Cancel
            </button>
        </Modal>
    );
};

export default EditDiscountModal;
