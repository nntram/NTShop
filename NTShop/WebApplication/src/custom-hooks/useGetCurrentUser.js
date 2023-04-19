import React, {useState, useEffect} from 'react'

const useGetCurrentUser = () => {
    const [currentUser, setCurrentUser] = useState()

    useEffect(() => {
        const parseCurrentUser = () => {
          const user = sessionStorage.getItem("currentUser");
    
          try {
            if (user !== JSON.stringify(currentUser)) {
              setCurrentUser(JSON.parse(user))
            }
          } catch (error) {
            setCurrentUser(null)
          }
        }
        parseCurrentUser()
      })

      return currentUser

}

export default useGetCurrentUser