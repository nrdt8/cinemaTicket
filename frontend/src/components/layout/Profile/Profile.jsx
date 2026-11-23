import { useState, useEffect } from "react";

const Profile = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const getProfile = async () => {
            const token = localStorage.getItem("token");

            try {
                const response = await fetch(
                    "http://localhost:3000/api/auth/profile",
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                        }
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    console.log(data.error);
                    return;
                }

                setUser(data.data);

            } catch (err) {
                console.log(err);
            }
        }

        getProfile();
    }, []);

    return (
        <div>
            {user && (
                <div>
                    <p>{user.id}</p>
                    <p>{user.first_name}</p>
                    <p>{user.last_name}</p>
                    <p>{user.login}</p>
                    <p>{user.role_id}</p>
                    <p>{user.created_at}</p>
                </div>
            )}
        </div>
    );
};

export default Profile;