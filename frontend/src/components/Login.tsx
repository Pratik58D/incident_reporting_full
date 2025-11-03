import { authStore } from "@/store/authStore";
import { observer } from "mobx-react-lite"
import { useState } from "react"
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Login =observer(() => {
  const [identifier , setIdentifier] = useState("");
  const [password , setPassword] = useState("");
  const  navigate = useNavigate();

  const handleSubmit = async(e:React.FormEvent) =>{
    e.preventDefault();
    await authStore.login(identifier,password);
    if(!authStore.error){
      toast.success("login successful")
      setIdentifier("")
      setPassword("")
      navigate("/")
      
    }else{
      toast.error(authStore.error)
    }
    
  }



  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input 
        placeholder="Phone or Email"
        value={identifier}
        onChange={(e)=> setIdentifier(e.target.value)}
        />
        <input 
        placeholder="Password.."
        value={password}
        type="password"
        onChange={(e)=> setPassword(e.target.value)}
        />

        <button disabled= {authStore.loading}>Login</button>
      </form>
      {authStore.error && <p className="text-red-500">{authStore.error}</p>}
    </div>
  )
})

export default Login