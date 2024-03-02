import React, {useState, useEffect} from 'react'
import axios from 'axios';
import { API_URL } from '../../utils/const';
import './product.css';
import Swal from 'sweetalert2';
import AddProductModal from './AddProductModal';
import EditProductModal from './EditProductModal';
import Sidebar from '../../components/Sidebar';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import ReactPaginate from 'react-paginate';

const ProductList = () => {
    const [product, setProduct] = useState([]);
    const [discount, setDiscount] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editProductId, setEditProductId] = useState(null);
    const [initialProductData, setInitialProductData] = useState(null);
    const [itemsPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(0); 
    const [role, setRole] = useState('');
    const [token, setToken] = useState('');
    const Navigate = useNavigate();

    const refreshToken = async() => {
        try {
            const response = await axios.get(`http://localhost:8000/token`)
            setToken(response.data.accessToken)
            const decoded = jwtDecode(response.data.accessToken)

            if (decoded.role !== 'Admin') {
                Navigate("/dashboard");
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "You're not permitted to go there!",
                });
            }
            setName(decoded.name)
            setRole(decoded.role)
        } catch (error) {
            if(error.response){
            Navigate("/")
        }
    }
    }

    useEffect(() => {
        refreshToken();
    }, []);

    const getProduct = async () => {
        try {
            const response = await axios.get(`${API_URL}/products`);
            setProduct(response.data.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
        }
    }

    const getDiscount = async () => {
        try {
            const response = await axios.get(`${API_URL}/discounts`);
            setDiscount(response.data.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    useEffect(() => {
        getProduct();
        getDiscount();
    }, []);

    const handleStockChange = async (id) => {
        const { value: newStatus } = await Swal.fire({
            title: "Update Stock",
            input: "select",
            inputOptions: {
                "Tersedia": "Tersedia",
                "Kosong": "Kosong",
            },
            inputPlaceholder: "Select status",
            showCancelButton: true,
            inputValidator: (value) => {
                return new Promise((resolve) => {
                    resolve();
                });
            }
        });

        if (newStatus) {
            try {
                await axios.put(`${API_URL}/products/${id}`, { stock: newStatus });
                getProduct();
                Swal.fire({
                    icon: "success",
                    title: "Stock Updated",
                    text: "Stock has been updated successfully."
                });
            } catch (error) {
                console.error('Error updating status:', error);
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Failed to update status. Please try again later."
                });
            }
        }
    };

    const handleDiscountChange = async (id) => {
        const options = {};
        discount.forEach(discountItem => {
            options[discountItem.id] = discountItem.nama_discount;
        });
    
        options['null'] = 'No Discount';
        let inputValue = 'null'; // Default to 'No Discount'
        const currentProduct = product.find(product => product.id === id);
        if (currentProduct && currentProduct.discount) {
            inputValue = currentProduct.discount.id.toString();
        }
    
        const { value: newDiscountId } = await Swal.fire({
            title: "Update Discount",
            input: "select",
            inputOptions: options,
            inputPlaceholder: "Select discount",
            inputValue: inputValue, // Pre-select the current discount if it exists
            showCancelButton: true,
            inputValidator: (value) => {
                return new Promise((resolve) => {
                    resolve();
                });
            }
        });
    
        if (newDiscountId !== undefined) {
            try {
                const requestData = { discount_id: newDiscountId === 'null' ? null : newDiscountId };
                await axios.put(`${API_URL}/products/discount/${id}`, requestData);
                getProduct();
                Swal.fire({
                    icon: "success",
                    title: "Discount Updated",
                    text: "Discount has been updated successfully."
                });
            } catch (error) {
                console.error('Error updating discount:', error);
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Failed to update discount. Please try again later."
                });
            }
        }
    };
    

    const deleteProduct = async (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`${API_URL}/products/${id}`);
                    getProduct();
                    Swal.fire({
                        title: "Deleted!",
                        text: "Your file has been deleted.",
                        icon: "success"
                    });
                } catch (error) {
                    console.error('Error deleting data:', error);
                    Swal.fire({
                        title: "Oops...",
                        text: "There is a transaction associated with this product!",
                        icon: "error"
                    });
                }
            }
        });
    };

    const handleAddProduct = (newProduct) => {
        setProduct([...product, newProduct]);
    };

    const getProductById = async (id) => {
        try {
            const response = await axios.get(`${API_URL}/products/product/${id}`);
            return response.data.data;
        } catch (error) {
            console.error('Error fetching product data by ID:', error);
            throw error;
        }
    };

    const handleEditClick = async (id) => {
        try {
            const productData = await getProductById(id);
            setEditProductId(id);
            setInitialProductData(productData);
            setIsEditModalOpen(true);
        } catch (error) {
            console.error('Error fetching product data for edit:', error);
        }
    };

    const handleUpdateProduct = (updatedProduct) => {
        const updatedProductList = product.map(item => {
            if (item.id === updatedProduct.id) {
                return updatedProduct;
            }
            return item;
        });
        setProduct(updatedProductList);
    };

    const handlePageChange = ({ selected }) => {
        setCurrentPage(selected);
    };

    const offset = currentPage * itemsPerPage;
    const currentProduct = product.slice(offset, offset + itemsPerPage);

    return (
        <div className="table-container">
            <AddProductModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAdd={handleAddProduct}
                getProduct={getProduct}
            />
            <EditProductModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                productId={editProductId}
                onUpdate={handleUpdateProduct}
                getProduct={getProduct}
                initialProductData={initialProductData}
            />
        <button className="add-discount-button" onClick={() => setIsModalOpen(true)}>Add New Product</button>
        <Sidebar role="Admin"/>
        <div>
        <p className='table-title'>Product List</p>
        {loading ? (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading...</p>
            </div>
        ) : (
            <table className='product-table'>
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Deskripsi</th>
                        <th>Kategori</th>
                        <th>Stock</th>
                        <th>Discount</th>
                        <th>Image</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currentProduct.map((products, index) => (
                        <tr key={products.id}>
                            <td>{index + 1 + offset}</td>
                            <td>{products.name}</td>
                            <td>{products.price}</td>
                            <td>{products.deskripsi}</td>
                            <td>{products.kategori}</td>
                            <td>{products.stock}</td>
                            <td>{products.discount ? products.discount.nama_discount : "No Discount"}</td>
                            <td><img src={`${products.image}?${new Date().getTime()}`} alt={products.name} /></td>
                            <td className="actions">
                                <button className="edit" onClick={() => handleStockChange(products.id)}>Ubah Stock</button>
                                <button className="edit" onClick={() => handleDiscountChange(products.id)}>Select Discount</button>
                                <button className="edit" onClick={() => handleEditClick(products.id)}>Edit</button>
                                <button onClick={() => deleteProduct(products.id)} className="">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
                
            </table>
        )}
            <div className='pagination-container-product'>
                <ReactPaginate
                    pageCount={Math.ceil(product.length / itemsPerPage)}
                    pageRangeDisplayed={5}
                    marginPagesDisplayed={2}
                    onPageChange={handlePageChange}
                    containerClassName="pagination-product"
                    activeClassName="active"
                    previousLabel="Previous"
                    nextLabel="Next"
                />
            </div>
        </div>
    </div>
    )
}

export default ProductList