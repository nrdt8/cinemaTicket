
import "./SessionCard.scss";

const SessionCard = ({ price, hall, color = "green", startTime, endTime }) => {
    return (
        <div className={`session-card session-card--${color}`}>
            <div className="session-card__header">
                <span className="session-card__price">
                    {price} ₽
                </span>

                <span className="session-card__hall">
                    {hall}
                </span>
            </div>

            <div className="session-card__schedule">
                <span className="session-card__start">
                    {startTime}
                </span>

                <svg
                    className="session-card__arrow"
                    viewBox="0 0 40 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                >
                    <path
                        d="M1 6H37M32 1L37 6L32 11"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>

                <span className="session-card__end">
                    {endTime}
                </span>
            </div>
        </div>
    );
};

export default SessionCard;
