import React, { useEffect, useState } from "react";
import axios from 'axios';
import { Row, Col, Button } from 'react-bootstrap';
import { Link } from "react-router-dom";

const CategoryPage = props => {
    const param = props.match.params.id
    const [item, setItem] = useState({
        imageURL: [],
        tags: [],
        _id: param,
        name: "",
        description: "",
        category: "",
        price: 0,
        hidden: false,
        seller: ""
    });
    useEffect(() => {
        const fetchData = async () => {
            await axios.get('http://localhost:3001/shop/item/'+param)
                .then(res => {
                    setItem(res.data);
                })
            };
    
        fetchData();
    }, [param]);
    console.log(item.imageURL)
    return(<React.Fragment>
        <Row>
            <Col xs={12} md={4} xl={4}>
                {item.imageURL.map( (image, index) => (
                    <img src={"data:"+image.mimetype+";base64,"+image.base64} alt={index} width="100%"/>                
                ))}
            </Col>
            <Col xs={12} md={8} xl={8}>
                <h1>{item.name}</h1>
                £{item.price/100} <br/>
                <Button variant="dark">Add to basket</Button> <br/>
                {item.description}  <br/>

                Seller: <Link to={"../profile/"+item.seller}>{item.seller}</Link>
            </Col>
        </Row>
    </React.Fragment>)
}

export default CategoryPage;