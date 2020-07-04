import React, { useEffect, useState } from "react";
import axios from 'axios';
import { Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from "react-router-dom";

const SearchPage = props => {
    const [items, setItems] = useState([]);
    const param = props.match.params.search;
    useEffect(() => {
        const fetchData = async () => {
            await axios.get('http://localhost:3001/search/'+param)
                .then(res => {
                    setItems(res.data);
                })
            };
    
        fetchData();
    }, [param]);

    console.log(param)
    return(<React.Fragment>
        <h3>Searching for: <b>{param}</b></h3>
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

export default SearchPage;