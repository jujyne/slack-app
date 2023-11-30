export function fetchUsers(currentUser) {
    fetch("http://206.189.91.54/api/v1/users", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        client: currentUser.headers.client,
        uid: currentUser.headers.uid,
        expiry: currentUser.headers.expiry,
        "access-token": currentUser.headers.accessToken,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data && Array.isArray(data.data)) {
          // Filter users with id greater than 4500
          const usersGreaterThan4500 = data.data.filter(
            (user) => user.id > (data.data.length-10)
          );
  
          // Store the filtered user data in local storage
          localStorage.setItem("userData", JSON.stringify(usersGreaterThan4500));
        } else {
          console.error(
            "Invalid API response format. Expected 'data' array in the response."
          );
        }
      })
      .catch((error) => console.error("Error fetching user data:", error));
  }