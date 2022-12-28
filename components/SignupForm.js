import React, { useRef, useState } from "react";

const emailRegex =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

const SignupForm = (props) => {
  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordVerifyError, setPasswordVerifyError] = useState("");

  const usernameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordVerifyRef = useRef();

  const submitHandler = (event) => {
    event.preventDefault();

    const username = usernameRef.current.value.trim();
    const email = emailRef.current.value.trim();
    const password = passwordRef.current.value.trim();
    const passwordVerify = passwordVerifyRef.current.value.trim();

    let hasError = false;

    //validation
    if (username.length === 0) {
      setUsernameError("Username field cannot be empty!");
      hasError = true;
    } else {
      setUsernameError("");
    }

    if (email.length === 0) {
      setEmailError("Email field cannot be empty!");
      hasError = true;
    } else if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email!");
      hasError = true;
    } else {
      setEmailError("");
    }

    if (password.length === 0) {
      setPasswordError("Password field cannot be empty!");
      hasError = true;
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters long!");
      hasError = true;
    } else {
      setPasswordError("");
    }

    if (password !== passwordVerify) {
      setPasswordVerifyError("You must enter the same password!");
      hasError = true;
    } else {
      setPasswordVerifyError("");
    }

    if (!hasError) {
      props.onSignup(username, email, password);
    }
  };

  return (
    <form onSubmit={submitHandler} className="flex flex-col">
      <label className="form-label" htmlFor="username">
        Username
      </label>
      <input
        ref={usernameRef}
        className="form-input"
        id="username"
        type="text"
        name="username"
        maxLength="20"
      />
      {usernameError && <p className="text-red-600">{usernameError}</p>}

      <label className="form-label mt-4" htmlFor="email">
        Email
      </label>
      <input
        ref={emailRef}
        className="form-input"
        id="email"
        type="email"
        name="email"
      />
      {emailError && <p className="text-red-600">{emailError}</p>}

      <label className="form-label mt-4" htmlFor="password">
        Password
      </label>
      <input
        ref={passwordRef}
        className="form-input"
        type="password"
        id="password"
        name="password"
        maxLength="20"
      />
      {passwordError && <p className="text-red-600">{passwordError}</p>}

      <label className="form-label mt-4" htmlFor="password-verify">
        Password Verify
      </label>
      <input
        ref={passwordVerifyRef}
        className="form-input"
        type="password"
        id="password-verify"
        name="password-verify"
      />
      {passwordVerifyError && (
        <p className="text-red-600">{passwordVerifyError}</p>
      )}

      <button
        type="submit"
        className="bg-blue-600 font-medium hover:bg-blue-800 w-1/2 mx-auto rounded-xl p-1 mt-8"
      >
        Signup
      </button>
    </form>
  );
};

export default SignupForm;
