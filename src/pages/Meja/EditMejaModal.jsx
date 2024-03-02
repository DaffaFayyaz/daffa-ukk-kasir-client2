import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import { API_URL } from '../../utils/const';
import './modal.css';
import Swal from 'sweetalert2';


const EditMejaModal = ({ isOpen, onClose, onUpdate, mejaId, initialMejaData, getMeja }) => {
    const [inputValue, setInputValue] = useState('');

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    useEffect(() => {
        setInputValue(initialMejaData ? initialMejaData.no_meja : '');
    }, [initialMejaData]);

    const handleSubmit = async () => {
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
                    const response = await axios.put(`${API_URL}/meja/${mejaId}`, {
                        no_meja: inputValue,
                    });
                    onUpdate(response.data);
                    onClose();
                    getMeja();
                    Swal.fire({
                        title: "Updated!",
                        text: "Your table has been updated.",
                        icon: "success"
                    });
                } catch (error) {
                    console.error('Error updating meja:', error);
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
            contentLabel="Edit Meja"
            className="modal"
        >
            <h2>Edit Meja</h2>
            <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                placeholder="Enter table number"
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

export default EditMejaModal;
