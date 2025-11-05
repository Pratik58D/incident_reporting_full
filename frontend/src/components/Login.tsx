import { authStore } from "@/store/authStore";
import { observer } from "mobx-react-lite"
import { useState } from "react"
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Login = observer(() => {
  const [isLogin, setIsLogin] = useState(true)
  const [name, setName] = useState("");
  const [phone_number, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [identifier, setIdentifier] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();

    if (isLogin) {
      await authStore.login(identifier, password);
      if (!authStore.error) {
        toast.success("login successful")
        setIdentifier("")
        setPassword("")
        navigate("/")
      } else {
        toast.error(authStore.error)
      }
    } else {
      await authStore.signup({
        name,
        phone_number,
        email,
        password
      });
      if (!authStore.error) {
        toast.success("Signup Successful");
        setName("");
        setPhoneNumber("");
        setEmail("");
        setPassword("");
        setIsLogin(true)
      } else {
        toast.error(authStore.error)
      }
    }

  }

  return (
    <section className="flex flex-col w-full h-screen items-center justify-center">
      <div
        className="min-w-md flex flex-col px-12 shadow-xl bg-white py-12 gap-8"
      >
        <div className="text-center">
          <h1 className="text-2xl font-semibold pb-2">Welcome Back</h1>
          <p className="text-gray-500 pb-2">Signin to report and manage incidents</p>
          <p className="text-xl font-semibold">{isLogin ? "Login" : "Sign Up"}</p>
        </div>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4"
        >
          {!isLogin && (
            <>
              <div className="flex flex-col">
                <label>Name:</label>
                <input
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="border border-gray-300 px-3 py-2 bg-gray-50 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div className="flex flex-col ">
                <label>Phone:</label>
                <input
                  type="text"
                  placeholder="Phone number"
                  value={phone_number}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="border border-gray-300 px-3 py-2 bg-gray-50 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div className="flex flex-col">
                <label>Email:</label>
                <input
                  type="email"
                  placeholder="Email (optional)"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border border-gray-300 px-3 py-2 bg-gray-50 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:outline-none"
                />
              </div>

            </>
          )}
          {isLogin ? (
            <div className="flex flex-col">
              <label >Phone or Email:</label>
              <input
                placeholder="Phone or Email"
                value={identifier}
                className="border border-gray-300 px-3 py-2 bg-gray-50  text-gray-900 text-sm rounded-lg focus:border focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                onChange={(e) => setIdentifier(e.target.value)}
              />
            </div>
          ) : null}

          <div className="flex flex-col">
            <label>Password:</label>
            <input
              placeholder="Password.."
              value={password}
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              className="border border-gray-300 px-3 py-2 bg-gray-50  text-gray-900 text-sm rounded-lg focus:border focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <button
            className="bg-primaryCol text-white w-full py-3 rounded-md  text-lg font-semibold hover:bg-primary-dark cursor-pointer"
            disabled={authStore.loading}
          >
            {isLogin ? "Login" : "Sign Up"}
          </button>

          <div className="flex justify-center gap-2">
            {isLogin ? (
              <>
                <p>Don't have an account? </p>
                <p
                  className="text-blue-600 cursor-pointer"
                  onClick={() => setIsLogin(false)}
                >
                  Signup</p>
              </>
            ): <>
             <p>Already have an account? </p>
                <p
                  className="text-blue-600 cursor-pointer"
                  onClick={() => setIsLogin(true)}
                >
                  SignIn</p>
            
            </>} 
          </div>
        </form>
      </div>
    </section>
  )
})

export default Login