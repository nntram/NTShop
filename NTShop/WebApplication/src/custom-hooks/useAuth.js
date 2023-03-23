import {useState, useEffect} from 'react'


const useAuth = () => {
  
  const [currentUser, setCurrentUser] = useState({})
  const user = localStorage.getItem("userAuth");
  useEffect(() => {   
      if(user){
        const data = JSON.parse(user)
        setCurrentUser(data)
      }
      else{
        setCurrentUser(null)
      }   
  }, [user])
  return {
    currentUser, setCurrentUser
  }
}

export default useAuth