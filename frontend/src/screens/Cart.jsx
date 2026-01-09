import React from "react";
import Delete from "@material-ui/icons/Delete";
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, dropCart } from "../redux/cartSlice";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  let data = useSelector((state) => state.cart.cartItems);
  let dispatch = useDispatch();
  let navigate = useNavigate();

  if (data.length === 0) {
    return (
      <div>
        <div className="m-5 w-100 text-center fs-3 text-white">
          The Cart is Empty!
        </div>
      </div>
    );
  }

  let totalPrice = data.reduce((total, food) => total + food.price, 0);

  const handlePayment = async () => {
    let userEmail = localStorage.getItem("userEmail");
    var options = {
      key: "rzp_test_PV1oQ0oMtgXOsq",
      amount: totalPrice * 100,
      currency: "INR",
      name: "GoFood Checkout",
      description: "Payment for food order",
      image:
        "https://www.mintformations.co.uk/blog/wp-content/uploads/2020/05/shutterstock_583717939.jpg",
      handler: async function (response) {
        let res = await fetch(
          "https://tastyroutes.onrender.com/api/auth/orderData",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              order_data: data,
              email: userEmail,
              order_date: new Date().toDateString(),
              payment_id: response.razorpay_payment_id,
            }),
          }
        );

        if (res.status === 200) {
          dispatch(dropCart());
          navigate("/");
        }
      },
      theme: {
        color: "#198754",
      },
    };

    const rzpy1 = new window.Razorpay(options);
    rzpy1.open();
  };

  return (
    <div>
      <div className="container m-auto mt-5 table-responsive table-responsive-sm table-responsive-md">
        <table className="table table-hover">
          <thead className="text-success fs-4">
            <tr>
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">Quantity</th>
              <th scope="col">Option</th>
              <th scope="col">Amount</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody className="text-white">
            {data.map((food, index) => (
              <tr key={index}>
                <th scope="row">{index + 1}</th>
                <td>{food.name}</td>
                <td>{food.qty}</td>
                <td>{food.size}</td>
                <td>{food.price}</td>
                <td>
                  <button type="button" className="btn p-0">
                    <Delete onClick={() => dispatch(removeFromCart(index))} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div>
          <h1 className="fs-2 text-white">Total Price: ₹{totalPrice}/-</h1>
        </div>
        <div>
          <button className="btn bg-success mt-5" onClick={handlePayment}>
            Pay Now
          </button>
        </div>
      </div>
    </div>
  );
}
