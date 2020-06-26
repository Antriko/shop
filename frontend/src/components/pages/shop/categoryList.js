import React, { useEffect, useState } from "react";
import axios from 'axios';
import { Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from "react-router-dom";


const CategoryPage = props => {
    const [items, setItems] = useState([]);
    const param = props.match.params.category
    useEffect(() => {
        const fetchData = async () => {
            await axios.get('http://localhost:3001/shop/category/'+param)
            .then(res => {
                setItems(res.data);
            })
        };
        
        fetchData();
    }, [param]);
    

    function getImage(id) {

    }
    getImage();

    console.log(items, 'yes')
    return(<React.Fragment>
        <Row>
            {items.map( item => (
                <Col xs={4} md={6} xl={4}>
                <Card style={{ height: "100%", display: "inline-block"}}>
                    <Card.Img variant="top" src={"data:"+item.imageURL[0].mimetype+";base64,"+item.imageURL[0].base64} style={{ width: "100%", height: "300px" }} />

                    <Card.Body>

                        <Card.Title>{item.name}</Card.Title>
                        <Card.Subtitle>{"£"+item.price/100}</Card.Subtitle>
                        <Card.Text>{item.description.substring(0, 40)}</Card.Text>
                        <Link to={"/shop/" + item._id}>
                            <Button variant="dark">
                                More info
                            </Button>
                        </Link>
                    </Card.Body>

                </Card>
                </Col>
            ))}
        </Row>
    </React.Fragment>)
}
export default CategoryPage;