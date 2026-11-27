import {useState} from "react";
import AuthInput from "../../ui/inputs/AuthInput/AuthInput.jsx";
import AuthButton from "../../ui/buttons/AuthButton/AuthButton.jsx";


const Register = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");

    const [message, setMessage] = useState("");

    const errors = {
        INVALID_FIELD_TYPE: "Некорректные данные",
        FIELDS_REQUIRED: "Заполните все поля",
        INVALID_LOGIN: "Логин должен содержать 3–20 символов (латинские буквы, цифры, _ или -)",
        INVALID_NAME: "Имя и фамилия должны содержать от 2 до 50 букв",
        INVALID_PASSWORD: "Пароль должен содержать от 8 до 72 символов",
        LOGIN_ALREADY_EXISTS: "Этот логин уже занят",
        INTERNAL_SERVER_ERROR: "Ошибка сервера. Попробуйте позже"
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(
                "http://localhost:3000/api/auth/register",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        first_name: firstName,
                        last_name: lastName,
                        login: login,
                        password: password,
                    })
                })

            const data = await response.json();

            console.log(data);

            if (!response.ok) {
                setMessage(errors[data.error] || "Произошла неизвестная ошибка")
                return;
            }

            setMessage("Пользователь создан");


        } catch (err) {
            setMessage(err.message);
        }

    };

    return (
        <form onSubmit={handleSubmit}>
            <span>Имя</span>
            <AuthInput
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                name="firstName"
                type="text"
                placeholder="Введите имя"
            ></AuthInput>

            <span>Фамилия</span>
            <AuthInput
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                name="lastName"
                type="text"
                placeholder="Введите фамилию"
            ></AuthInput>

            <span>Логин</span>
            <AuthInput
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                name="login"
                type="text"
                placeholder="Введите логин"
            ></AuthInput>

            <span>Пароль</span>
            <AuthInput
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                name="password"
                type="password"
                placeholder="Введите пароль"
            ></AuthInput>

            <label>{message}</label>

            <AuthButton type="submit">Регистрация</AuthButton>

        </form>
    )
}

export default Register