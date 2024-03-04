import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import { API_URL } from '../../utils/const';
import Swal from 'sweetalert2';
import './addmodal.css';

const AddDiscountDetailModal = ({ isOpen, onClose, onAdd, getDiscount }) => {
    const [potongan_harga, setPotonganHarga] = useState('');
    const [discounts, setDiscounts] = useState([]);
    const [products, setProducts] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [selectedDiscount, setSelectedDiscount] = useState('');
    const [discountDetails, setDiscountDetails] = useState([]); // New state for discount details

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [discountsResponse, productsResponse, discountDetailsResponse] = await Promise.all([
                    axios.get(`${API_URL}/discounts`),
                    axios.get(`${API_URL}/products`),
                    axios.get(`${API_URL}/discountdetail`), // Fetch discount details
                ]);
                setDiscounts(discountsResponse.data.data);
                setProducts(productsResponse.data.data);
                setDiscountDetails(discountDetailsResponse.data.data); // Set discount details state
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    const handleSubmit = async () => {
        try {
            const existingProduct = selectedProducts.some(productId =>
                discountDetails.some(detail => detail.id_product === productId)
            );

            if (existingProduct) {
                Swal.fire({
                    icon: 'error',
                    title: 'Product already exists',
                    text: 'The selected product already exists in the discount.',
                });
                return; // Exit the function early if the product already exists
            }

            const response = await axios.post(`${API_URL}/discountdetail`, {
                id_product: selectedProducts,
                id_discount: selectedDiscount,
            });

            onAdd(response.data);
            onClose();
            getDiscount();

            Swal.fire({
                icon: 'success',
                title: 'Data has been saved',
                showConfirmButton: false,
                timer: 1500,
            });
        } catch (error) {
            console.error('Error adding new discount:', error);
        }
    };

    return (
        <Modal isOpen={isOpen} onRequestClose={onClose} contentLabel="Add New Meja" className="modal">
            <h2>Add New Discount Detail</h2>
            <div className="select-container-discountdetail">
                <label>Select Product:</label>
                <select
                    value={selectedProducts}
                    onChange={(e) => setSelectedProducts([e.target.value])}
                    className="custom-select-discountdetail"
                >
                    <option value="">Select Product</option>
                    {products.map((product) => (
                        <option key={product.id} value={product.id}>
                            {product.name}
                        </option>
                    ))}
                </select>
                <div className="selected-products">
                    {selectedProducts.map((productId) => (
                        <span key={productId} className="selected-product">
                            {products.find((product) => product.id === productId)?.name}
                        </span>
                    ))}
                </div>
            </div>
            <div className="select-container-discountdetail">
                <label>Select Discount:</label>
                <select
                    value={selectedDiscount}
                    onChange={(e) => setSelectedDiscount(e.target.value)}
                    className="custom-select-discountdetail"
                >
                    <option value="">Select Discount</option>
                    {discounts.map((discount) => (
                        <option key={discount.id} value={discount.id}>
                            {discount.nama_discount}
                        </option>
                    ))}
                </select>
            </div>
            <div className="button-container-discountdetail">
                <button onClick={handleSubmit} className="add-">
                    Add
                </button>
                <button onClick={onClose} className="cancel">
                    Cancel
                </button>
            </div>
        </Modal>
    );
};

export default AddDiscountDetailModal;
