import {useState} from "react";
import AuthInput from "../../ui/inputs/AuthInput/AuthInput.jsx";
import AuthButton from "../../ui/buttons/AuthButton/AuthButton.jsx";

const Login = () => {

    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");

    const [message, setMessage] = useState("");

    const errors = {
        INVALID_FIELD_TYPE: "Некорректные данные",
        FIELDS_REQUIRED: "Заполните все поля",
        INVALID_CREDENTIALS: "Неверный логин или пароль",
        INTERNAL_SERVER_ERROR: "Ошибка сервера. Попробуйте позже"
    };

    const handleSubmit = async (e) => {
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

            console.log(data);

            if (!response.ok) {
                setMessage(errors[data.error] || "Произошла неизвестная ошибка")
                return
            }

            setMessage("Вход успешен")

            localStorage.setItem("token", data.token);



            setMessage("Вход успешен");
        } catch (err) {
            setMessage(err.message)
        }
    }

    return (
        <form onSubmit={handleSubmit}>
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

            <AuthButton type="submit">Вход</AuthButton>
        </form>
    )
}

export default Login;