import {useState} from "react";
import Input from "../../ui/Input/Input.jsx";
import Button from "../../ui/Button/Button.jsx";


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
            <Input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                name="firstName"
                type="text"
                placeholder="Введите имя"
            ></Input>

            <span>Фамилия</span>
            <Input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                name="lastName"
                type="text"
                placeholder="Введите фамилию"
            ></Input>

            <span>Логин</span>
            <Input
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                name="login"
                type="text"
                placeholder="Введите логин"
            ></Input>

            <span>Пароль</span>
            <Input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                name="password"
                type="password"
                placeholder="Введите пароль"
            ></Input>

            <label>{message}</label>

            <Button type="submit">Регистрация</Button>

        </form>
    )
}

export default Register