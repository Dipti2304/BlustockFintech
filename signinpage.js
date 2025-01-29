document.getElementById("signup-form").addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent default form submission behavior

    // Basic validation
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const robotCheck = document.getElementById("not-a-robot").checked;

    // Email validation regex
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    // Check if all fields are filled out and robot checkbox is checked
    if (!name || !email || !password || !robotCheck) {
        alert("Please fill in all fields and verify you're not a robot.");
        return;
    }

    // Validate email format
    if (!emailRegex.test(email)) {
        alert("Please enter a valid email address.");
        return;
    }

    // Check password length (at least 6 characters)
    if (password.length < 6) {
        alert("Password must be at least 6 characters long.");
        return;
    }

    // Prepare data to send to the server
    const data = {
        name: name,
        email: email,
        password: password
    };

    // Make the POST request to the backend
    fetch("http://localhost:5000/signup", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert(`Welcome, ${name}! Your account has been created.`);
            document.getElementById("signup-form").reset();  // Clear the form after successful submission
        } else {
            alert("There was an error with your signup. Please try again.");
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert("There was an error submitting the form.");
    });
});
document.getElementById("toggle-password").addEventListener("click", function () {
    const passwordInput = document.getElementById("password");
    if (passwordInput.type === "password") {
        passwordInput.type = "text";
    } else {
        passwordInput.type = "password";
    }
});