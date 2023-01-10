import React, { useContext, useState } from "react";

import Modal from "../UI/Modal";
import CartItem from "./CartItem";
import classes from "./Cart.module.css";
import CartContext from "../../store/cart-context";
import Checkout from "./Checkout";

const Cart = (props) => {
  const [isCheckout, setIsCheckout] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [didSubmit, setDidSubmit] = useState(false);
  const cartCtx = useContext(CartContext);

  const totalAmount = `$${cartCtx.totalAmount.toFixed(2)}`;
  const hasItems = cartCtx.items.length > 0;

  const cartItemRemoveHandler = (id) => {
    cartCtx.removeItem(id);
  };

  const cartItemAddHandler = (item) => {
    cartCtx.addItem(item);
  };

  const submitOrderHandler = async (userData) => {
    setIsSubmitting(true);
    await fetch(
      "https://realtime-database-c6d84-default-rtdb.firebaseio.com/orders.json",
      {
        method: "POST",
        body: JSON.stringify({
          user: userData,
          orderItems: cartCtx.items,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    setIsSubmitting(false);
    setDidSubmit(true);
    cartCtx.clearCart();
  };

  const cartItems = (
    <ul className={classes["cart-items"]}>
      {cartCtx.items.map((item) => (
        <CartItem
          key={item.id}
          name={item.name}
          amount={item.amount}
          price={item.price}
          onRemove={cartItemRemoveHandler.bind(null, item.id)}
          onAdd={cartItemAddHandler.bind(null, item)}
        />
      ))}
    </ul>
  );

  const orderHanlder = () => {
    setIsCheckout(true);
  };

  const modalActions = (
    <div className={classes.actions}>
      <button className={classes["button--alt"]} onClick={props.onClose}>
        Close
      </button>
      {hasItems && (
        <button className={classes.button} onClick={orderHanlder}>
          Order
        </button>
      )}
    </div>
  );

  // const cartModalContent = (
  //   <div>
  //     {cartItems}
  //     <div className={classes.total}>
  //       <span>Total Amount</span>
  //       <span>{totalAmount}</span>
  //     </div>
  //     {isCheckout && (
  //       <Checkout onConfirm={submitOrderHandler} onClose={props.onClose} />
  //     )}
  //     {!isCheckout && modalActions}
  //   </div>
  // );

  const isSubmittingModalContent = <p>Sending order data...</p>;

  // const didSubmitModalContent = (
  //   <div>
  //     <p>Successfully sent the order!!</p>
  //     <button className={classes.button} onClick={props.onClose}>
  //       Close
  //     </button>
  //   </div>
  // );

  return (
    <Modal onClose={props.onClose}>
      {!isSubmitting && !didSubmit && (
        <div>
          {" "}
          {cartItems}
          <div className={classes.total}>
            <span>Total Amount</span>
            <span>{totalAmount}</span>
          </div>
          {isCheckout && (
            <Checkout onConfirm={submitOrderHandler} onClose={props.onClose} />
          )}
          {!isCheckout && modalActions}
        </div>
      )}
      {isSubmitting && isSubmittingModalContent}
      {!isSubmitting && didSubmit && (
        <div>
          <p>Successfully sent the order!!</p>
          <button className={classes.button} onClick={props.onClose}>
            Close
          </button>
        </div>
      )}
    </Modal>
  );
};

export default Cart;
