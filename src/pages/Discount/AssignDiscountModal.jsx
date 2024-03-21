import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import Swal from 'sweetalert2';
import { API_URL } from '../../utils/const';
import "./modalddiscount.css";

const AssignDiscountModal = ({ isOpen, onClose, discountId, getDiscount }) => {
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        fetchProducts();
        fetchDiscountedProducts();
    }, [isOpen]);

    const fetchProducts = async () => {
        try {
            const response = await axios.get(`${API_URL}/products`);
            setProducts(response.data.data);
        } catch (error) {
            console.error('Error fetching products:', error);
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Failed to fetch products",
            });
        }
    };

    const fetchDiscountedProducts = async () => {
        try {
            const response = await axios.get(`${API_URL}/discountdetail`);
            const discountedProductIds = response.data.data
                .filter(detail => detail.discount.id === discountId)
                .map(detail => detail.product.id);
            setSelectedProducts(discountedProductIds);
        } catch (error) {
            console.error('Error fetching discounted products:', error);
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Failed to fetch discounted products",
            });
        }
    };

    const assignDiscountToProducts = async () => {
        try {
            await axios.post(`${API_URL}/discountdetail`, {
                id_discount: discountId,
                id_product: selectedProducts
            });
            Swal.fire({
                icon: "success",
                title: "Discount assigned to products successfully",
                showConfirmButton: false,
                timer: 1500
            });
            onClose();
            getDiscount();
        } catch (error) {
            console.error('Error assigning discount to products:', error);
            Swal.fire({
                icon: "info",
                title: "Discount Product Updated",
                showConfirmButton: false,
                timer: 1500
            });
        }
    };

    const handleProductSelection = async (productId) => {
        if (selectedProducts.includes(productId)) {
            setSelectedProducts(selectedProducts.filter(id => id !== productId));
            try {
                const response = await axios.get(`${API_URL}/discountdetail`, {
                    params: {
                        productId,
                        discountId
                    }
                });
                const detailId = response.data.data[0].id;
                await axios.delete(`${API_URL}/discountdetail/${detailId}`);
                Swal.fire({
                    icon: "success",
                    title: "Product unassigned from the discount successfully",
                    showConfirmButton: false,
                    timer: 1500
                });
            } catch (error) {
                console.error('Error unassigning product from the discount:', error);
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Something went wrong!",
                });
            }
        } else {
            setSelectedProducts([...selectedProducts, productId]);
        }
    };
    
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            contentLabel="Assign Discount to Products"
            className="modal"
        >
            <h2>Assign Discount to Products</h2>
            <div>
                <h3>Products:</h3>
                <ul className="checkbox-container">
                    {products.map(product => (
                        <li key={product.id}>
                            <label>
                                <input
                                    type="checkbox"
                                    value={product.id}
                                    checked={selectedProducts.includes(product.id)}
                                    onChange={() => handleProductSelection(product.id)}
                                />
                                {product.name}
                            </label>
                        </li>
                    ))}
                </ul>
            </div>
            <button onClick={assignDiscountToProducts} className="add">Assign</button>
            <button onClick={onClose} className="cancel">Cancel</button>
        </Modal>
    );
};

export default AssignDiscountModal;
