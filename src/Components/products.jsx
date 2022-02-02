import React from "react";
import axios from "axios";
import {
  Card,
  Accordion,
  Button,
  Container,
  Row,
  Col,
  Image,
} from "react-bootstrap";
import { useState, useEffect, useReducer } from "react";
import apple from "../apple.png";
import beans from "../beans.png";
import orange from "../orange.png";
import cabbage from "../cabbage.png";

// simulate getting products from dataBase
const products = [
  { name: "Apples", country: "Italy", cost: 3, instock: 6 },
  { name: "Beans", country: "USA", cost: 2, instock: 5 },
  { name: "Oranges", country: "Spain", cost: 4, instock: 3 },
  { name: "Cabbage", country: "USA", cost: 1, instock: 8 },
];

const useDataApi = (initialUrl, initialdata) => {
  const [url, setUrl] = useState(initialUrl);

  const [state, dispatch] = useReducer(dataFetchReducer, {
    isLoading: false,
    isError: false,
    data: initialdata,
  });
  console.log(`usedataApi called`);
  useEffect(() => {
    console.log("useEffect Called");
    let didCancel = false;
    const fetchdata = async () => {
      dispatch({ type: "FETCH_INIT" });
      try {
        const result = await axios(url);
        console.log(result);
        console.log("FETCH FROM URl");
        if (!didCancel) {
          dispatch({ type: "FETCH_SUCCESS", payload: result.data });
        }
      } catch (error) {
        if (!didCancel) {
          dispatch({ type: "FETCH_FAILURE" });
        }
      }
    };
    fetchdata();
    return () => {
      didCancel = true;
    };
  }, [url]);
  return [state, setUrl];
};
const dataFetchReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_INIT":
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case "FETCH_SUCCESS":
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload,
      };
    case "FETCH_FAILURE":
      return {
        ...state,
        isLoading: false,
        isError: true,
      };
    default:
      throw new Error();
  }
};

const Products = () => {
  const [items, setItems] = useState(products);
  const [cart, setCart] = useState([]);
  const [query, setQuery] = useState("http://localhost:1337/products");
  const [{ data, isLoading, isError }, doFetch] = useDataApi(
    "http://localhost:1337/api/products",
    {
      data: [],
    }
  );
  console.log(`Rendering Products ${JSON.stringify(data)}`);
  console.log(query);

  const addToCart = (e) => {
    let name = e.target.name;
    let item = items.filter((item) => item.name == name);
    if (item[0].instock == 0) {
      alert(
        "This product is out of stock. Press the ReStock button to ask for a re-stock"
      );
      return;
    }
    item[0].instock = item[0].instock - 1;
    console.log(`add to Cart ${JSON.stringify(item)}`);
    setCart([...cart, ...item]);
  };

  const deleteCartItem = (delIndex) => {
    // this is the index in the cart not in the Product List

    let newCart = cart.filter((item, i) => delIndex != i);
    let target = cart.filter((item, index) => delIndex == index);
    let newItems = items.map((item, index) => {
      if (item.name == target[0].name) item.instock = item.instock + 1;
      return item;
    });
    setCart(newCart);
    setItems(newItems);
  };
  const photos = [apple, beans, orange, cabbage];

  let list = items.map((item, index) => {
    return (
      <Card key={index} className="my-4 shadow" border="dark">
        <Row>
          <Col md={3} className="align-self-center">
            <Image
              className="mx-3"
              src={photos[index]}
              width={70}
              roundedCircle
            />
          </Col>
          <Col md={9}>
            <Card.Body>
              <Card.Title>
                {item.name} - Stock: {item.instock}
              </Card.Title>
              <Card.Text>Unit Price: ${item.cost}</Card.Text>
              <input
                name={item.name}
                type="submit"
                value="Add to Cart"
                onClick={addToCart}
              />
            </Card.Body>
          </Col>
        </Row>
      </Card>
    );
  });
  let cartList = cart.map((item, index) => {
    return (
      <Accordion key={index} defaultActiveKey="0">
        <Accordion.Item>
          <Accordion.Header>{item.name}</Accordion.Header>
          <Accordion.Body onClick={() => deleteCartItem(index)}>
            {" "}
            $ {item.cost} from {item.country}
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    );
  });

  let finalList = () => {
    let total = checkOut();
    let final = cart.map((item, index) => {
      return (
        <div key={index} index={index}>
          <Row>
            <Col className="mx-5">{item.name}</Col>
            <Col className="text-center">${item.cost}</Col>
          </Row>
        </div>
      );
    });
    return { final, total };
  };

  const checkOut = () => {
    let costs = cart.map((item) => item.cost);
    const reducer = (accum, current) => accum + current;
    let newTotal = costs.reduce(reducer, 0);
    console.log(`total updated to ${newTotal}`);
    return newTotal;
  };

  const restockProducts = (url) => {
    doFetch(url);
    let newItems = data.data.map((item) => {
      let { name, country, cost, instock } = item.attributes;
      return { name, country, cost, instock };
    });
    setItems([...newItems]);
  };

  return (
    <Container>
      <Row>
        <Col>
          <h1 className="text-center">Product List</h1>
          {list}
        </Col>
        <Col>
          <h1 className="text-center">Cart Contents</h1>
          <Accordion>{cartList}</Accordion>
        </Col>
        <Col>
          <h1 className="text-center">CheckOut</h1>
          <div> {finalList().total > 0 && finalList().final} </div>
          <Row className="my-2">
            <Col className="mx-5">TOTAL</Col>
            <Col className="text-center">${finalList().total}</Col>
          </Row>
          <Row className="justify-content-center my-4">
            <Button
              onClick={() => alert("Payment Gateway isn't implemented yet")}
            >
              CheckOut ${finalList().total}
            </Button>
          </Row>
        </Col>
      </Row>
      <Row>
        <form
          onSubmit={(event) => {
            restockProducts(query);
            console.log(`Restock called on ${query}`);
            event.preventDefault();
          }}
        >
          <input
            id="das"
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <button type="submit">ReStock Products</button>
        </form>
      </Row>
    </Container>
  );
};

export default Products;
