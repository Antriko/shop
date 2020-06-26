import React from "react";
import { Link } from "react-router-dom";

const indexPage = () => {
    return(<React.Fragment>
        hello this is index

        shop by category:

        <Link to="/category">GOTO</Link>



    </React.Fragment>)
}

export default indexPage;