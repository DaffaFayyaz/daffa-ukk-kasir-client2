import React, { useState } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import { API_URL } from '../../utils/const';
import './discount.css'; // Import CSS file
import Swal from 'sweetalert2';

const AddDiscountModal = ({ isOpen, onClose, onAdd, getDiscount }) => {
    const [nama_discount, setNamaDiscount] = useState('');
    const [potongan_harga, setPotonganHarga] = useState('');
    const [tgl_end, setTglEnd] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'nama_discount') setNamaDiscount(value);
        else if (name === 'potongan_harga') setPotonganHarga(value);
        else if (name === 'tgl_end') setTglEnd(value);
    };

    const handleSubmit = async () => {
        try {
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
            const potonganHargaInt = parseInt(potongan_harga);
            if (potonganHargaInt > 99 ) {
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
            const response = await axios.post(`${API_URL}/discounts`, {
                nama_discount: nama_discount,
                potongan_harga: potonganHargaInt,
                tgl_end: formattedTglEnd,
            });
            onAdd(response.data);
            onClose();
            getDiscount();
            Swal.fire({
                icon: "success",
                title: "Data has been saved",
                showConfirmButton: false,
                timer: 1500
            });
        } catch (error) {
            console.error('Error adding new discount:', error);
        }
    };
    

    return (
        <Modal
        isOpen={isOpen}
        onRequestClose={onClose}
        contentLabel="Add New Meja"
        className="modal"
        >
        <h2>Add New Discount</h2>
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
        <label htmlFor="tgl_end">Discount Until:</label>
        <input
            type="date"
            name="tgl_end"
            value={tgl_end}
            onChange={handleInputChange}
            placeholder="End date"
        />
        <button onClick={handleSubmit} className="add">
            Add
        </button>
        <button onClick={onClose} className="cancel">
            Cancel
        </button>
        </Modal>
    );
};

export default AddDiscountModal;
