import React, { useState } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import { API_URL } from '../../utils/const';
import './product.css'; // Import CSS file
import Swal from 'sweetalert2';

const AddProductModal = ({ isOpen, onClose, onAdd, getProduct }) => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [deskripsi, setDeskripsi] = useState('');
    const [kategori, setKategori] = useState('');
    const [stock, setStock] = useState('');
    const [image, setImage] = useState(null);


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'name') setName(value);
        else if (name === 'price') setPrice(value);
        else if (name === 'deskripsi') setDeskripsi(value);
        else if (name === 'kategori') setKategori(value);
        else if (name === 'stock') setStock(value);
        else if (name === 'image') {
            setImage(e.target.files[0]);
        }
    };

    const handleSubmit = async () => {
        try {
            if (parseInt(price) < 1) {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Price cannot be below 1!",
                });
                return;
            }
            const formData = new FormData();
            formData.append('name', name);
            formData.append('price', price);
            formData.append('deskripsi', deskripsi);
            formData.append('kategori', kategori);
            formData.append('stock', stock);
            formData.append('image', image);
    
            const response = await axios.post(`${API_URL}/products`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
    
            // Convert image file to data URL
            const reader = new FileReader();
            reader.readAsDataURL(image);
            reader.onload = function () {
                const imageDataUrl = reader.result;
    
                onAdd(response.data);
                onClose();
                getProduct();
                Swal.fire({
                    icon: "success",
                    imageUrl: imageDataUrl,
                    title: "Data has been saved!",
                    imageWidth: 400,
                    imageHeight: 300,
                    imageAlt: "Uploaded image"
                });
            };
        } catch (error) {
            console.error('Error adding new product:', error);
        }
    };
    
    

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            contentLabel="Add New Product"
            className="modal"
        >
            <h2>Add New Product</h2>
            <input
                type="text"
                name="name"
                value={name}
                onChange={handleInputChange}
                placeholder="Name"
            />
            <input
                type="number"
                name="price"
                value={price}
                onChange={handleInputChange}
                placeholder="Price"
            />
            <input
                type="text"
                name="deskripsi"
                value={deskripsi}
                onChange={handleInputChange}
                placeholder="Deskripsi"
            />
            <select
                name="kategori"
                value={kategori}
                onChange={handleInputChange}
                className="select-input"
            >
                <option value="" disabled selected>Select Kategori</option>
                <option value="Makanan">Makanan</option>
                <option value="Minuman">Minuman</option>
            </select>
            <select
                name="stock"
                value={stock}
                onChange={handleInputChange}
                className="select-input"
            >
                <option value="" disabled selected>Select Stock</option>
                <option value="Tersedia">Tersedia</option>
                <option value="Kosong">Kosong</option>
            </select>
            <input
                type="file" 
                accept="image/*" 
                name="image"
                onChange={handleInputChange}
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

export default AddProductModal;
