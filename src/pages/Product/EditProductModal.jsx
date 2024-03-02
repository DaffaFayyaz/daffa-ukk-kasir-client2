import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import { API_URL } from '../../utils/const';
import Swal from 'sweetalert2';

const EditProductModal = ({ isOpen, onClose, onUpdate, productId, initialProductData, getProduct }) => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [deskripsi, setDeskripsi] = useState('');
    const [category, setCategory] = useState('');
    const [stock, setStock] = useState('');
    const [image, setImage] = useState(null);

    useEffect(() => {
        if (initialProductData) {
            setName(initialProductData.name);
            setPrice(initialProductData.price);
            setDeskripsi(initialProductData.deskripsi);
            setCategory(initialProductData.category);
            setStock(initialProductData.stock);
            setImage(initialProductData.image);
        }
    }, [initialProductData]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'name') setName(value);
        else if (name === 'price') setPrice(value);
        else if (name === 'deskripsi') setDeskripsi(value);
        else if (name === 'category') setCategory(value);
        else if (name === 'stock') setStock(value);
        else if (name === 'image') setImage(e.target.files[0]);
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
            formData.append('category', category);
            formData.append('stock', stock);
            if (image) {
                formData.append('image', image);
            }

            console.log([...formData]);

            const response = await axios.patch(`${API_URL}/products/${productId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            onUpdate(response.data);
            onClose();
            getProduct();
            Swal.fire({
                icon: "success",
                title: "Product updated successfully!",
            });
        } catch (error) {
            console.error('Error updating product:', error);
            Swal.fire({
                icon: "error",
                title: "Failed to update product",
                text: "An error occurred while updating the product. Please try again later.",
            });
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            contentLabel="Edit Product"
            className="modal"
        >
            <h2>Edit Product</h2>
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
                placeholder="Description"
            />
            <select
                name="kategori"
                value={category}
                onChange={handleInputChange}
                className="select-input"
            >
                <option value="" disabled>Select Kategori</option>
                <option value="Makanan">Makanan</option>
                <option value="Minuman">Minuman</option>
            </select>
            <input
                type="hidden"
                name="stock"
                value={stock}
                onChange={handleInputChange}
                placeholder="Stock"
            />
            <input
                type="file"
                accept="image/*"
                name="image"
                onChange={handleInputChange}
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

export default EditProductModal;
