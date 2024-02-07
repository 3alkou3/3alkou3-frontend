import { useState } from "react";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [inputs, setInputs] = useState({});
  const [errors, setErrors] = useState({});
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isFetching, setIsFetching] = useState(false);
  function handleFormChange(e) {
    setInputs((prevInputs) => {
      return {
        ...prevInputs,
        [e.target.name]: e.target.value,
      };
    });
  }
  function handleErrorChange(name, value) {
    setErrors((prevErrs) => {
      return {
        ...prevErrs,
        [name]: value,
      };
    });
  }
  async function handleSubmit() {
    let isValid = true;
    if (!inputs.password) {
      handleErrorChange("password", "This field is required");
      isValid = false;
    }
    if (!inputs.username) {
      handleErrorChange("username", "This field is required");
      isValid = false;
    }

    if (!isValid) {
      return;
    }

    setIsFetching(true)
    const { authenticated } = await login(inputs.username, inputs.password);
    setIsFetching(false)
    if (authenticated) {
      navigate("/dashboard");
    } else {
      handleErrorChange("universal", "Incorrect username or password");
    }
  }
  return (
    <div className="h-[100vh] flex items-center justify-center bg-primary ">
      <div className="bg-white  rounded-xl flex flex-col p-8 gap-4 items-center">
        <input
          className="border-secondary border-2"
          type="text"
          name="username"
          id="username"
          onChange={handleFormChange}
          placeholder="Username"
          onFocus={(e) => {
            handleErrorChange(e.target.name, "");
            handleErrorChange("universal", "");
          }}
        />
        {errors.username ? (
          <div className="text-sm text-red-500 -mt-1">{errors.username}</div>
        ) : (
          ""
        )}
        <input
          className="border-secondary border-2"
          type="password"
          name="password"
          id="password"
          onChange={handleFormChange}
          placeholder="Password"
          onFocus={(e) => {
            handleErrorChange(e.target.name, "");
            handleErrorChange("universal", "");
          }}
        />
        {errors.password ? (
          <div className="text-sm text-red-500 -mt-1">{errors.password}</div>
        ) : (
          ""
        )}
        {errors.universal ? (
          <div className="text-red-500 ">{errors.universal}</div>
        ) : (
          ""
        )}
        <button
          className="bg-secondary w-fit text-white px-4 py-2 rounded-xl cursor-pointer"
          style={{
            opacity: isFetching ? 0.7 : 1
          }}
          onClick={handleSubmit}
          disabled={isFetching}
        >
          Submit
        </button>
      </div>
    </div>
  );
}
