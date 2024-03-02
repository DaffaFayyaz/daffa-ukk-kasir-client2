import React, { useState } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import { API_URL } from '../../utils/const';
import Swal from 'sweetalert2';

const AddAkunModal = ({ isOpen, onClose, onAdd, getAkun }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');
    const [password, setPassword] = useState('');
    const [confPassword, setConfPassword] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'name') setName(value);
        else if (name === 'email') setEmail(value);
        else if (name === 'role') setRole(value);
        else if (name === 'password') setPassword(value);
        else if (name === 'confPassword') setConfPassword(value);
    };

    const handleSubmit = async () => {
        try {   
            const response = await axios.post(`${API_URL}/register`, {
                name: name,
                email: email,
                role: role,
                password: password,
                confPassword: confPassword
            });
            onAdd(response.data);
            onClose();
            getAkun();
            Swal.fire({
                icon: "success",
                title: "Data has been saved",
                showConfirmButton: false,
                timer: 1500
            });
        } catch (error) {
            console.error('Error adding new account:', error);
        }
    };
    

    return (
        <Modal
        isOpen={isOpen}
        onRequestClose={onClose}
        contentLabel="Add New Meja"
        className="modal"
        >
        <h2>Add New Akun</h2>
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
            Add
        </button>
        <button onClick={onClose} className="cancel">
            Cancel
        </button>
        </Modal>
    );
};

export default AddAkunModal;
