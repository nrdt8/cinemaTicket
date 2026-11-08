const SessionCard = () => {
    return (
        <div className="session-card">
            <div className="session-card_header">
                <div className="session-card_price">
                    350 <span>₽</span>
                </div>
                <div className="session-card_typehall">
                    Огромный зал
                </div>
            </div>

            <div className="session-card_time">
                <div className="session-card_time-start">
                    10:20
                </div>

                <div className="session-card_time-end">
                    13:04
                </div>
            </div>
        </div>
    );
};

export default SessionCard;