import React, { useContext, useState, useEffect } from "react";
import { UserContext } from '../../../userContext';
import axios from "axios";
import { Row, Col, Button, DropdownButton, Dropdown } from 'react-bootstrap';

const BasketPage = () => {
    const { user, setUser } = useContext(UserContext);
    const [basketInfo, setBasketInfo] = useState({isLoading: true, info: {}});
    useEffect(() => {
        const fetchData = async () => {
            await axios.get('http://localhost:3001/shop/getItems', {
                withCredentials: true
            })
                .then(res => {
                    setBasketInfo({isLoading: false, info: res.data})
                })
        };
        fetchData();
    }, [])

    function getTotal() {
        var total = 0;
        for (var i=0;i<user.userdata.basket.length;i++) {
            for (var j=0;j<user.userdata.basket[i][1];j++) {
                total += basketInfo.info[user.userdata.basket[i][0]].price;
            }
        }
        return total;
    };
    
    const updateQuantity = async (info) => {
        var quantity = info.split(',');
        var tmp = user.userdata;
        for (var i=0; i<tmp.basket.length; i++) {
            if (tmp.basket[i][0] === quantity[0]) {
                tmp.basket[i][1] = parseInt(quantity[1]);
            };
        };
        setUser({userdata: tmp, isLogged: user.isLogged});
        await axios.post('http://localhost:3001/user/basket', {
                basket: tmp.basket
            }, {
                withCredentials: true
            })
    };


    function deleteBasketItem(id) {
        var tmp = user.userdata;
        for (var i=0; i<tmp.basket.length; i++) {
            if (tmp.basket[i][0] === id) {
                tmp.basket.splice(i,1);
            };
        };
        setUser({userdata: tmp, isLogged: user.isLogged});
        axios.post('http://localhost:3001/user/basket', {
                basket: tmp.basket
            }, {
                withCredentials: true
            })
    }

    var numb = [1,2,3,4,5,6,7,8,9];
    if (!basketInfo.isLoading) {
        return(<React.Fragment>
            <Row>
                <Col xs={8} md={8} xl={8}>
                    {user.userdata.basket.map( (item, key) => (
                        <React.Fragment key={key}>
                            <Row>
                                <Col xs={3} md={3} xl={3}>
                                    <img src={'data:'+basketInfo.info[item[0]].imageURL[0].mimetype+';base64,'+basketInfo.info[item[0]].imageURL[0].base64} alt='' width='100%' />
                                </Col>
                                <Col xs={9} md={9} xl={9}>
                                    <Row><h3>{basketInfo.info[item[0]].name}</h3></Row>
                                    <Row><h6>£{basketInfo.info[item[0]].price/100}</h6></Row>
                                    <Row>
                                        <DropdownButton id="dropdown-basic-button" title={'Quantity: ' + item[1]} onSelect={updateQuantity} variant="dark">
                                            {numb.map((number, numbKey) => (
                                                <Dropdown.Item eventKey={[item[0], number]} key={numbKey}>{number}</Dropdown.Item>
                                            ))}                                            
                                        </DropdownButton>
                                        <Button onClick={()=>{deleteBasketItem(item[0])}} variant="dark" className="ml-auto mr-3">delete</Button>
                                    </Row>
                                </Col>
                            </Row>
                            <hr />
                        </React.Fragment>
                        )
                    )}
                </Col>
                <Col xs={4} md={4} xl={4}>
                    <h3>Basket info</h3>
                    <p>Total: £{getTotal()/100}</p>
                    <Button variant="dark">Check out</Button>
                </Col>
            </Row>
        </React.Fragment>)
    } else {
        return <p>Empty</p>
    }
};
export default BasketPage;