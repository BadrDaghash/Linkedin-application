const socket = io("http://localhost:3000"); 

// Emit event to register HR user
socket.emit("registerUser", "HR_USER_ID");

// Connection status handling
socket.on("connect", () => {
  document.getElementById("status").innerText = "✅ Connected to WebSocket!";
  document.getElementById("status").style.color = "#00ffcc";
});

socket.on("disconnect", () => {
  document.getElementById("status").innerText = "❌ Disconnected from WebSocket!";
  document.getElementById("status").style.color = "#ff4d4d";
});

// Listen for new job applications
socket.on("newApplication", (data) => {
  console.log("📩 New Job Application Received:", data);

  // Destructure data
  const { jobId, userId, applicationId, message } = data;

  // Create new message element
  const messagesDiv = document.getElementById("messages");
  const newMessage = document.createElement("div");
  newMessage.classList.add("message");

  newMessage.innerHTML = `
    <p><strong>📩 New Job Application Received</strong></p>
    <p><strong>Job ID:</strong> ${jobId}</p>
    <p><strong>User ID:</strong> ${userId}</p>
    <p><strong>Application ID:</strong> ${applicationId}</p>
    <p><strong>Message:</strong> ${message}</p>
    <hr style="border: 1px solid #00ffcc;">
  `;

  // Append to message container
  messagesDiv.appendChild(newMessage);
});
