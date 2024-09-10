import React, { useContext, useState } from "react";
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { CGV, buildRoute } from "@/handler/router";
import CheckBox from "./CheckBox";

const CardForm = (props) => {

  const lang = props.lang;
  const translate = props.translate;

  const cardElementStyle = {
    base: {
      fontSize: "16px",
      color: "#424770",
      "::placeholder": {
        color: "#aab7c4",
      },
      border: "1px solid #000",
      borderRadius: "4px",
      padding: "12px",
    },
    invalid: {
      color: "var(--mo-primary)",
    },
  };

  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState(null)
  const [buttonsDisabled, setButtonsDisabled] = useState(true);
  const [isSubmitting, setSubmitting] = useState(false);
  const [state, setState] = useState(0);

  const pay = async (e) => {
    setButtonsDisabled(true)

    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);

    const { error, token } = await stripe.createToken(cardElement);

    if (error) {
      setButtonsDisabled(false)
    } else {
      const payment_id = token.id;
      const payment = await props.payment(payment_id);

      setMessage(payment);
      if (payment.color === "danger") {
        setButtonsDisabled(false)
        setState(0)
      }
    }
  };

  const [cgv, setCGV] = useState(false);

  const paymentState = [
    <button key={1} disabled={props.disabled || !cgv || buttonsDisabled} onClick={(e) => { setState(state + 1); setSubmitting(true) }} style={{ backgroundColor: "var(--bs-green)" }} className="btn border-0 btn-success rounded-2 text-white text-uppercase"><i className="fa-solid fa-credit-card me-2"></i>{translate("pay_now")}</button>,
    <>
      <button key={2} disabled={props.disabled || !cgv || buttonsDisabled} onClick={pay} style={{ backgroundColor: "var(--bs-green)" }} className="btn btn-sm btn-success rounded-2 text-white border-0 text-uppercase"><i className="fa-solid fa-credit-card me-2"></i>{translate("confirm_payment")}</button>
      <button key={3} disabled={props.disabled || !cgv || buttonsDisabled} onClick={(e) => { setState(state - 1); setSubmitting(false) }} style={{ backgroundColor: "var(--bs-red)" }} className="btn btn-sm btn-danger border-0 rounded-2 text-white text-uppercase"><i className="fa-solid fa-cancel me-2"></i>{translate("cancel_payment")}</button>
    </>
  ]


  return (
    <div className="border rounded-0 shadow-sm mt-auto px-3 py-2 d-flex flex-column">
      <a target={"_blank"} rel="noreferrer" href="https://stripe.com/" className="mt-auto d-flex text-decoration-none">
        <i style={{ fontSize: "3em", color: "var(--bs-green)" }} className="my-auto fa-brands fa-stripe me-2"></i>
      </a>
      <hr />
      <h4 htmlFor="dateEndInput" className="mb-0">{translate("bank_card")} :</h4>
      <div className="my-3 border rounded p-2 mb-2">
        <CardElement disabled={isSubmitting} onChange={(e) => setButtonsDisabled(!e.complete)} options={cardElementStyle} />

      </div>
      {
        state == 0 && (
          <div className="pt-3">
            <CheckBox checked={cgv} onChange={(v) => { setCGV(v) }} >
              <span className="small" dangerouslySetInnerHTML={{ __html: translate("cgv_accept").replace("%link%", buildRoute(lang, CGV)) + "" }}></span>
            </CheckBox>
          </div>
        )
      }
      {message && (
        <p className={"lh-1 "} style={{ color: "var(--bs-" + message.color + ")" }}>
          {translate(message.message)}
        </p>
      )}
      <div className="mb-3">
        {props.children}
      </div>
      <div className="mt-auto d-flex pb-2">
        <div className=" me-auto d-block d-md-flex gap-3 pt-3">
          {
            (message === null || message.color !== "success") &&
            paymentState[state]
          }
        </div>
      </div>
    </div>
  );
};

export default CardForm;
