import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import './akun.css';
import Sidebar from '../../components/Sidebar';
import { API_URL } from '../../utils/const';
import ReactPaginate from 'react-paginate';
import AddAkunModal from './AkunModal';
import EditAkunModal from './AkunEditModal';


const Akun = () => {
    const [token, setToken] = useState('');
    const [role, setRole] = useState('');
    const [loading, setLoading] = useState(true);
    const [itemsPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(0);
    const [akun, setAkun] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editAkunId, setEditAkunId] = useState(null);
    const [initialAkunData, setInitialAkunData] = useState(null);

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

    const getAkun = async () => {
        try {
            const response = await axios.get(`${API_URL}/users`);
            setAkun(response.data.data);
            setLoading(false);
            console.log(akun)
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
        }
    }

    useEffect(() => {
        getAkun();
    }, []);

    const handlePageChange = ({ selected }) => {
        setCurrentPage(selected);
    };

    const deleteAkun = async (id) => {
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
                    await axios.delete(`${API_URL}/users/${id}`);
                    getAkun();
                    Swal.fire({
                        title: "Deleted!",
                        text: "Your file has been deleted.",
                        icon: "success"
                    });
                } catch (error) {
                    console.error('Error deleting data:', error);
                    Swal.fire({
                        title: "Oops...",
                        text: "Something went wrong!",
                        icon: "error"
                    });
                }
            }
        });
    };

    const getAkunById = async (id) => {
        try {
            const response = await axios.get(`${API_URL}/users/${id}`);
            return response.data.data;
        } catch (error) {
            console.error('Error fetching table data by ID:', error);
            throw error;
        }
    };

    const handleUpdateAkun = (updatedAkun) => {
        const updatedAkunList = akun.map(item => {
            if (item.id === updatedAkun.id) {
                return updatedAkun;
            }
            return item;
        });
        setAkun(updatedAkunList);
    };

    const handleEditClick = async (id) => {
        try {
            const tableData = await getAkunById(id);
            setEditAkunId(id);
            setInitialAkunData(tableData);
            setIsEditModalOpen(true);
        } catch (error) {
            console.error('Error fetching table data for edit:', error);
        }
    };

    const handleAddAkun = (newAkun) => {
        setAkun([...akun, newAkun]);
    };

    const offset = currentPage * itemsPerPage;
    const currentAkun = akun.slice(offset, offset + itemsPerPage);

    return (
        <div>
            <AddAkunModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAdd={handleAddAkun}
                getAkun={getAkun}
            />
            <EditAkunModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onUpdate={handleUpdateAkun}
                akunId={editAkunId}
                initialAkunData={initialAkunData}
                getAkun={getAkun}
            />
            <button className="add-akun-button" onClick={() => setIsModalOpen(true)}>Add New Account</button>
            <Sidebar role={role}/>
            <div>
            <p className='table-title'>Account List</p>
                {loading ? (
                    <div className="loading-container">
                        <div className="spinner"></div>
                        <p>Loading...</p>
                    </div>
                ) : (
                    <table className="akun-table">
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentAkun.map((akuns, index) => (
                                <tr key={akuns.id}>
                                    <td>{index + 1 + offset}</td>
                                    <td>{akuns.name}</td>
                                    <td>{akuns.email}</td>
                                    <td>{akuns.role}</td>
                                    <td className="actions">
                                        <button className="edit" onClick={() => handleEditClick(akuns.id)}>Edit</button>
                                        <button onClick={() => deleteAkun(akuns.id)} className="">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
                <div className='pagination-container-akun'>
                    <ReactPaginate
                        pageCount={Math.ceil(akun.length / itemsPerPage)}
                        pageRangeDisplayed={5}
                        marginPagesDisplayed={2}
                        onPageChange={handlePageChange}
                        containerClassName="pagination-akun"
                        activeClassName="active"
                        previousLabel="Previous"
                        nextLabel="Next"
                    />
                </div>
            </div>
        </div>
    )
}

export default Akun