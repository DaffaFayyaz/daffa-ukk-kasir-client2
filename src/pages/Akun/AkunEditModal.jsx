import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import { API_URL } from '../../utils/const';
import Swal from 'sweetalert2';

const EditAkunModal = ({ isOpen, onClose, onUpdate, akunId, initialAkunData, getAkun }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');
    const [password, setPassword] = useState('');
    const [confPassword, setConfPassword] = useState('');

    useEffect(() => {
        if (initialAkunData) {
            setName(initialAkunData.name);
            setEmail(initialAkunData.email);
            setRole(initialAkunData.role);
        }
    }, [initialAkunData]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'name') setName(value);
        else if (name === 'email') setEmail(value);
        else if (name === 'role') setRole(value);
        else if (name === 'password') setPassword(value);
        else if (name === 'confPassword') setConfPassword(value);
    };

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
                    const response = await axios.patch(`${API_URL}/users/${akunId}`, {
                        name: name,
                        email: email,
                        role: role,
                        password: password,
                        confPassword: confPassword,
                    });
                    onUpdate(response.data);
                    onClose();
                    getAkun();
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
        <h2>Edit Akun</h2>
        <input
            type="text"
            name="name"
            value={name}
            onChange={handleInputChange}
            placeholder="Enter account name"
        />
        <input
            type="text"
            name="email"
            value={email}
            onChange={handleInputChange}
            placeholder="Enter email"
        />
        <input
            type="password"
            name="password"
            value={password}
            onChange={handleInputChange}
            placeholder="Enter password"
        />
        <input
            type="password"
            name="confPassword"
            value={confPassword}
            onChange={handleInputChange}
            placeholder="Confirm password"
        />
        <select
            name="role"
            value={role}
            onChange={handleInputChange}
            className="select-input"
            >
            <option value="" disabled selected>Select Role</option>
            <option value="Admin">Admin</option>
            <option value="Kasir">Kasir</option>
        </select>
            <button onClick={handleSubmit} className="add">
                Update
            </button>
            <button onClick={onClose} className="cancel">
                Cancel
            </button>
        </Modal>
    );
};

export default EditAkunModal;
