import {useState} from 'react'
import { useNavigate } from "react-router-dom";

import "./Auth.scss"
import UserIcon from "../../components/ui/icons/UserIcon.jsx";
import LockIcon from "../../components/ui/icons/LockIcon.jsx";
import AuthInput from "../../components/ui/inputs/AuthInput/AuthInput.jsx";
import AuthButton from "../../components/ui/buttons/AuthButton/AuthButton.jsx";

function Auth () {

    const [isRegister, setIsRegister] = useState(false);

    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");

    const [message, setMessage] = useState("");

    const errors = {
        INVALID_FIELD_TYPE: "Некорректные данные",
        FIELDS_REQUIRED: "Заполните все поля",
        INVALID_CREDENTIALS: "Неверный логин или пароль",
        INTERNAL_SERVER_ERROR: "Ошибка сервера. Попробуйте позже"
    };
    
    const navigate = useNavigate();

    const handleSubmitLogin = async (e) => {
        e.preventDefault()

        try {
            const response = await fetch(
                "http://localhost:3000/api/auth/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        login: login,
                        password: password,
                    })
                }
            )

            const data = await response.json();

            if (!response.ok) {
                setMessage(errors[data.error] || "Произошла неизвестная ошибка")
                return
            }

            localStorage.setItem("token", data.token);

            navigate("/catalog");
        } catch (err) {
            setMessage(err.message)
        }
    }





    return (
        <div className="global-pageBG">

            <div className="global-cardBG auth-card">
                <div className="auth-card__logo">
                    cinemaTicket
                </div>
                <div className="auth-card__description">
                    Твои любимые фильмы в одном месте
                </div>

                <div className="auth-card__tab">
                    <div className="auth-card__tabIndicator"></div>
                    <button onClick={() => {setIsRegister(false)}} className={`auth-card__tabBtn auth-card__tabLogin ${isRegister === true ? "hidden" : ""}`}>
                        Вход
                    </button>
                    <button onClick={() => {setIsRegister(true)}} className={`auth-card__tabBtn auth-card__tabRegister ${isRegister === false ? "hidden" : ""}`}>
                        Регистрация
                    </button>
                </div>

                <form onSubmit={handleSubmitLogin}>
                    <AuthInput
                        icon={UserIcon}
                        label="Login"
                        name="Login"
                        placeholder="Login"
                        autoComplete="Login"
                        value={login}
                        onChange={(e) => setLogin(e.target.value)}
                        required
                        className="auth-card__inputs"
                    />

                    <AuthInput
                        icon={LockIcon}
                        label="Пароль"
                        type="password"
                        name="password"
                        placeholder="Пароль"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="auth-card__inputs"
                    />

                    <AuthButton className="auth-card__buttons" type="submit">
                        Войти
                    </AuthButton>
                </form>

                <label>{message}</label>
            </div>

        </div>
    )
}

export default Auth;