import React, { useState, useEffect } from 'react';
import axios from "axios";
import { Link, useNavigate } from 'react-router-dom';
import "./meja.css";
import Modal from 'react-modal';
import NewMejaModal from './MejaModal';
import EditMejaModal from './EditMejaModal';
import { API_URL } from '../../utils/const';
import Swal from 'sweetalert2';
import Sidebar from '../../components/Sidebar';
import { jwtDecode } from 'jwt-decode';

const MejaList = () => {
    const [meja, setMeja] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editMejaId, setEditMejaId] = useState(null);
    const [initialMejaData, setInitialMejaData] = useState(null); // State to store initial table data for editing
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState('');
    const [role, setRole] = useState('');
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

    const getMeja = async () => {
        try {
            const response = await axios.get(`${API_URL}/meja`);
            setMeja(response.data.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
        }
    }

    const getMejaById = async (id) => {
        try {
            const response = await axios.get(`${API_URL}/meja/${id}`);
            return response.data.data;
        } catch (error) {
            console.error('Error fetching table data by ID:', error);
            throw error;
        }
    };

    useEffect(() => {
        getMeja();
    }, []);

    const handleAddMeja = (newMeja) => {
        setMeja([...meja, newMeja]);
    };

    const handleEditClick = async (id) => {
        try {
            const tableData = await getMejaById(id);
            setEditMejaId(id);
            setInitialMejaData(tableData);
            setIsEditModalOpen(true);
        } catch (error) {
            console.error('Error fetching table data for edit:', error);
        }
    };

    const handleUpdateMeja = (updatedMeja) => {
        const updatedMejaList = meja.map(item => {
            if (item.id === updatedMeja.id) {
                return updatedMeja;
            }
            return item;
        });
        setMeja(updatedMejaList);
    };

    const deleteMeja = async (id) => {
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
                    await axios.delete(`${API_URL}/meja/${id}`);
                    getMeja();
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


    return (
        <div className="meja-list-container">
            <NewMejaModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAdd={handleAddMeja}
                getMeja={getMeja}
            />
            <EditMejaModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onUpdate={handleUpdateMeja}
                mejaId={editMejaId}
                initialMejaData={initialMejaData}
                getMeja={getMeja}
            />
            <button className="add-discount-button" onClick={() => setIsModalOpen(true)}>Add New Meja</button>
            <Sidebar role="Admin"/>
            <p className='table-title-meja'>Meja List</p>
            <div className="meja-table">
                {loading ? (
                    <div className="loading-container">
                        <div className="spinner"></div>
                        <p>Loading...</p>
                    </div>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>Nomor Meja</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {meja.map((mejas, index) => (
                                <tr key={mejas.id}>
                                    <td>{index + 1}</td>
                                    <td>{mejas.no_meja}</td>
                                    <td className="actions">
                                        <button className="edit" onClick={() => handleEditClick(mejas.id)}>Edit</button>
                                        <button onClick={() => deleteMeja(mejas.id)} className="">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    )
}

export default MejaList;
