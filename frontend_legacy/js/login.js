// document.getElementById("loginForm").addEventListener("submit", async (e) => {
//   e.preventDefault();

//   const email = document.getElementById("email").value;
//   const password = document.getElementById("password").value;

//   const response = await fetch("http://localhost:5000/api/auth/login", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ email, password }),
//   });

//   const data = await response.json();
//   if (response.ok) {
//     alert("Login successful!");
//     localStorage.setItem("token", data.token);
//     localStorage.setItem("user", JSON.stringify(data.user)); // save user for later use

//     // 🔁 Redirect based on role
//     const role = data.user.role;
//     if (role === "admin") {
//       window.location.href = "admin.html";
//     } else if (role === "pharmacist") {
//       window.location.href = "side-effects-dashboard.html";
//     } else {
//       window.location.href = "patient-dashboard.html";
//     } // (we'll create this next)
//   } else {
//     alert(data.message || "Login failed");
//   }
// });

document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const response = await fetch("http://localhost:5000/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();
  if (response.ok) {
    alert("Login successful!");
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user)); // save user for later use

    // 🔁 Redirect based on role
    const role = data.user.role;
    if (role === "admin") {
      window.location.href = "admin.html";
    } else if (role === "pharmacist") {
      window.location.href = "side-effects-dashboard.html";
    } else if (role === "doctor") {  // Added Doctor role handling
      window.location.href = "doctor-panel.html"; // Update with actual doctor dashboard
    } else {
      window.location.href = "patient-dashboard.html";
    } 
  } else {
    alert(data.message || "Login failed");
  }
});
