import { useContext, useState } from "react";
import Axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../../App";
import { Button } from "@/components/ui/button";

const Register = () => {
  const { loading, setLoading, status, setStatus, BASE } =
    useContext(UserContext);
  const [user, setUser] = useState({ gmail: "", password: "" });
  const navigator = useNavigate();

  async function userRegister(e) {
    e.preventDefault();
    setStatus("");
    try {
      setLoading(true);
      console.log(user)
      const response = await Axios.post(`${BASE}/users/register`,  user );
      if (response.status === 201) {
        setStatus("Registration complete! Redirecting to login...");
        setTimeout(() => {
          navigator("/login");
        }, 1200);
      }
    } catch (err) {
      if (err.response && err.response.status === 409) {
        setStatus(`${user.gmail} is already taken!`);
      } else {
        setStatus("Error occurred during registration");
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  return (
    <section className="flex items-center justify-center h-screen md:w-full lg:w-auto  lg:p-24">
      <div className="container ">
        <div className="flex flex-col justify-center items-center h-full border border-border p-10 rounded-xl">
          <div className="w-full">
            <h1 className="text-5xl text-white text-start font-bold mb-3">
              Register
            </h1>
            <h1 className="text-lg text-muted">
              Please enter your details to Register
            </h1>
          </div>
          <div className="w-full">
            <form onSubmit={userRegister} className="flex flex-col gap-3 mt-5">
              <input
                onChange={handleChange}
                name="text"
                placeholder="Enter username..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                onChange={handleChange}
                name="password"
                type="password"
                placeholder="Create your password..."
                minLength={5}
                maxLength={20}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <Button type="submit" disabled={loading} className="w-full mt-5">
                {loading ? "Registering..." : "Register"}
              </Button>
            </form>
            <div className="mt-4 text-start">
              <h1 className="text-gray-600">{status}</h1>
              <Link to="/login" className="text-blue-500 hover:underline">
                {" "}
                Already have an account? 
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Register;
