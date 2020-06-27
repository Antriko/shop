import React, { useContext } from "react";
import { UserContext } from '../../../userContext';

const BasketPage = () => {
    const { user } = useContext(UserContext);
    console.log(user.userdata.basket)
    return(<React.Fragment>
        {user.userdata.basket.map( item => (
            <React.Fragment>
                {item[0]} - x{item[1]}
            </React.Fragment>
            )
        )}
    </React.Fragment>)
};
export default BasketPage;