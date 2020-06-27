import React, { useEffect, useState, useContext } from "react";
import axios from 'axios';
import { Row, Col, Button } from 'react-bootstrap';
import { Link } from "react-router-dom";
import { UserContext } from '../../../userContext';

const CategoryPage = props => {
    const { user, setUser } = useContext(UserContext);
    const param = props.match.params.id;
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

    function updateBasket() {
        var tmp = user.userdata;
        var New = true;
        for (var i=0; i<tmp.basket.length; i++) {
            console.log()
            if (tmp.basket[i][0] === param) {   // if already exists in basket, add another quantity
                tmp.basket[i][1]++;
                New = false;
            }
        }
        if (New) {  // otherwise push with 1 quantity
            tmp.basket.push([param, 1])
        };
        console.log(tmp)
        setUser({userdata: tmp, isLogged: user.isLogged});
    };

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
                <Button variant="dark" onClick={updateBasket}>Add to basket</Button> <br/>
                {item.description}  <br/>

                Seller: <Link to={"../profile/"+item.seller}>{item.seller}</Link>
            </Col>
        </Row>
    </React.Fragment>)
}

export default CategoryPage;