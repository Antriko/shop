import React, { useEffect, useState } from "react";
import axios from 'axios';
import { Link } from "react-router-dom";
import { Button } from 'react-bootstrap';

const CategoryPage = () => {
    const [categories, setCategories] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            await axios.get('http://localhost:3001/shop/category')
                .then(res => {
                    setCategories(res.data);
                })
            };
    
        fetchData();
    }, []);

    console.log(categories, 'yes')
    return(<React.Fragment>
        {categories.map( category => (
                <React.Fragment>
                        <Link to={"/category/" + category}>
                            <Button variant="dark">
                                {category}
                            </Button>
                        </Link>
                </React.Fragment>
            )
        )}
    </React.Fragment>)
}

export default CategoryPage;