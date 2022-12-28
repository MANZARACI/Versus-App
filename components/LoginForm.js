import React, { useRef } from "react";

const LoginForm = (props) => {
  const emailRef = useRef();
  const passwordRef = useRef();

  const submitHandler = (event) => {
    event.preventDefault();

    props.onLogin(emailRef.current.value, passwordRef.current.value);
  };

  return (
    <form onSubmit={submitHandler} className="flex flex-col">
      <label className="form-label" htmlFor="email">
        Email
      </label>
      <input
        ref={emailRef}
        className="form-input"
        id="email"
        type="email"
        name="email"
      />

      <label className="form-label mt-4" htmlFor="password">
        Password
      </label>
      <input
        ref={passwordRef}
        className="form-input"
        type="password"
        id="password"
        name="password"
      />

      <button
        type="submit"
        className="bg-blue-600 font-medium hover:bg-blue-800 w-1/2 mx-auto rounded-xl p-1 mt-8"
      >
        Login
      </button>
    </form>
  );
};

export default LoginForm;
