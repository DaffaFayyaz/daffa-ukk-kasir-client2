import React, {useState} from 'react';
import axios from "axios";
import { useNavigate, Link } from 'react-router-dom';
import './login.css';
import { API_URL } from '../../utils/const';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [msg, setMsg] = useState('');
    const navigate = useNavigate();

    const Auth = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`http://localhost:8000/login`, {
                email: email,
                password: password,
            });
            navigate("/dashboard");
        } catch (error) {
            if(error.response) {
                setMsg(error.response.data.msg);
            }
        }
    }

    return (
        <section className="section">
        <div className="containerr">
        <div className="login-title">Login</div>
            <div className="form">
            <form onSubmit={Auth} className="form-group">
                <p className="">{msg}</p>
                <div className="form-group">
                <label className="label">Email</label>
                    <div className="">
                        <input type="text" className="input" placeholder="Username" value={email} onChange={(e) => setEmail(e.target.value)}/>
                    </div>
                </div>
                <div className="form-group">
                <label className="label">Password</label>
                    <div className="">
                        <input type="password" className="input" placeholder="*****" value={password} onChange={(e) => setPassword(e.target.value)}/>
                    </div>
                </div>
                <div className="form-group">
                    <button className="button">Login</button>
                </div>
            </form>
            </div>
        </div>
        </section>
    );
};

export default Login;
