import { useEffect, useState } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";

function Protected({child}) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  useEffect(()=>{
    axios.get('"http://localhost:3000/api/auth/profile"', { withCredentials: true })
    .then(res => setAuthenticated(true))
    .catch(err => setAuthenticated(false))
    .finally(()=> setLoading(false));
  }, []);
  
  if(loading) return <div>Loading</div>;
  if(!authenticated) return <Navigate to="/login"/>
  return child;
}

export default Protected
