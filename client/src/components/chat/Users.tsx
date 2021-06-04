import React from "react";
import User from "models/User";
import styles from "./styles/users.scss";

interface Props {
    users: Array<User>
}

const Users = (props: Props) => {
    const {users} = props

    return (
        <div className={styles.container}>
            <div className={styles.title}>Users Online</div>
            <div className={styles.users}>
                {
                    users.map((user: User, index: number) => {
                        return <p className={styles.userName} key={index}>{user.name}</p>
                    })
                }
            </div>
        </div>

    );
}

export default Users;
