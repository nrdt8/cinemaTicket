import "./AuthButton.scss";

function AuthButton({
                        children,
                        type = "button",
                        onClick,
                        disabled = false,
                        className = ""
                    }) {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`auth-button ${className}`}
        >
            <span className="auth-button__text">
                {children}
            </span>
            <span className="auth-button__shine"></span>
        </button>
    );
}

export default AuthButton;
