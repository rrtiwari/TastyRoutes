import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, updateCart } from "../redux/cartSlice";

export default function Card(props) {
  let dispatch = useDispatch();
  let data = useSelector((state) => state.cart.cartItems);
  let navigate = useNavigate();
  const priceRef = useRef();
  let options = props.options;
  let priceOptions = Object.keys(options);
  let foodItem = props.item;
  const [qty, setQty] = useState(1);
  const [size, setSize] = useState("");

  const handleClick = () => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    }
  };

  let finalPrice = qty * parseInt(options[size]);

  const handleAddToCart = async () => {
    let food = [];
    for (const item of data) {
      if (item.id === foodItem._id && item.size === size) {
        food = item;
        break;
      }
    }
    if (food.length !== 0) {
      await dispatch(
        updateCart({
          id: foodItem._id,
          price: finalPrice,
          qty: qty,
          size: size,
        })
      );
      return;
    }
    await dispatch(
      addToCart({
        id: foodItem._id,
        name: foodItem.name,
        price: finalPrice,
        qty: qty,
        size: size,
        img: props.ImgSrc,
      })
    );
  };

  useEffect(() => {
    setSize(priceRef.current.value);
  }, []);

  return (
    <div>
      <div className="card mt-3" style={{ width: "16rem", maxHeight: "360px" }}>
        <img
          src={props.ImgSrc}
          className="card-img-top"
          alt="food-img"
          style={{ height: "120px", objectFit: "cover" }}
        />
        <div className="card-body">
          <h5 className="card-title">{props.foodName}</h5>
          <div className="container w-100 p-0" style={{ height: "38px" }}>
            <select
              className="m-2 h-100 w-20 bg-success text-black rounded"
              onClick={handleClick}
              onChange={(e) => setQty(e.target.value)}
            >
              {Array.from(Array(6), (e, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
            <select
              className="m-2 h-100 w-20 bg-success text-black rounded"
              ref={priceRef}
              onClick={handleClick}
              onChange={(e) => setSize(e.target.value)}
            >
              {priceOptions.map((i) => (
                <option key={i} value={i}>
                  {i}
                </option>
              ))}
            </select>
            <div className="d-inline ms-2 h-100 w-20 fs-5">₹{finalPrice}/-</div>
          </div>
          <hr />
          <button
            className="btn btn-success justify-center ms-2"
            onClick={handleAddToCart}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
