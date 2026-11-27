import { useId, useState } from "react";
import "./AuthInput.scss";

import EyeIcon from "../../icons/EyeIcon.jsx";
import EyeOffIcon from "../../icons/EyeOffIcon.jsx";

const AuthInput = ({
                       icon: Icon,
                       type = "text",
                       placeholder,
                       name,
                       value,
                       onChange,
                       autoComplete,
                       error,
                       className = "",
                       id,
                       required = false,
                       disabled = false,
                       ...inputProps
                   }) => {
    const generatedId = useId();
    const inputId = id || generatedId;

    const [passwordVisible, setPasswordVisible] = useState(false);

    const isPassword = type === "password";
    const currentType = isPassword && passwordVisible ? "text" : type;

    return (
        <div className={`auth-input ${className}`}>
            <div className={`auth-input__field ${error ? "auth-input__field--error" : ""}`}>
                {Icon && (
                    <span className="auth-input__left-icon">
                        <Icon />
                    </span>
                )}

                <input
                    {...inputProps}
                    id={inputId}
                    name={name}
                    type={currentType}
                    placeholder={placeholder}
                    autoComplete={autoComplete}
                    value={value}
                    onChange={onChange}
                    required={required}
                    disabled={disabled}
                    aria-invalid={Boolean(error)}
                    aria-describedby={error ? `${inputId}-error` : undefined}
                    className="auth-input__control"
                />

                {isPassword && (
                    <button
                        type="button"
                        className="auth-input__toggle"
                        onClick={() => setPasswordVisible((prev) => !prev)}
                        aria-label={passwordVisible ? "Скрыть пароль" : "Показать пароль"}
                    >
                        {passwordVisible ? <EyeIcon /> : <EyeOffIcon />}
                    </button>
                )}
            </div>

            {error && (
                <p id={`${inputId}-error`} className="auth-input__error">
                    {error}
                </p>
            )}
        </div>
    );
};

export default AuthInput;