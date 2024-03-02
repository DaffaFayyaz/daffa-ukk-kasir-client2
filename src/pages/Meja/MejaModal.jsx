import React, { useState } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import { API_URL } from '../../utils/const';
import './modal.css'; // Import CSS file
import Swal from 'sweetalert2';

const NewMejaModal = ({ isOpen, onClose, onAdd, getMeja }) => {
    const [inputValue, setInputValue] = useState('');

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleSubmit = async () => {
        try {
            const response = await axios.post(`${API_URL}/meja`, {
                no_meja: inputValue,
            });
            onAdd(response.data);
            onClose();
            getMeja();
            Swal.fire({
                icon: "success",
                title: "Data has been saved",
                showConfirmButton: false,
                timer: 1500
            });
        } catch (error) {
            console.error('Error adding new meja:', error);
        }
    };
    

    return (
        <Modal
        isOpen={isOpen}
        onRequestClose={onClose}
        contentLabel="Add New Meja"
        className="modal"
        >
        <h2>Add New Meja</h2>
        <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Enter table number"
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

export default NewMejaModal;
