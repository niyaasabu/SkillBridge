import { initializeApp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";
import { 
  getAuth, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";

import { 
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  serverTimestamp,
  query,
  orderBy,
  doc,
  updateDoc,
  setDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

/* ================= FIREBASE CONFIG ================= */

const firebaseConfig = {
  apiKey: "AIzaSyCUsCtuy5C4rjU80PIu4L5DN8N0exL71vM",
  authDomain: "tink-bab2a.firebaseapp.com",
  databaseURL: "https://tink-bab2a-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "tink-bab2a",
  storageBucket: "tink-bab2a.firebasestorage.app",
  messagingSenderId: "1011794961334",
  appId: "1:1011794961334:web:20179b358ed92a416e1717",
  measurementId: "G-255FRNK1SG"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

/* ================= AUTH ================= */

// Register
window.registerUser = async function() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    await createUserWithEmailAndPassword(auth, email, password);
    alert("Registered Successfully! Please Login.");
    window.location.href = "login.html";
  } catch (error) {
    alert(error.message);
  }
};

// Login
window.loginUser = async function() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    await signInWithEmailAndPassword(auth, email, password);

    const userRef = doc(db, "users", auth.currentUser.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      await setDoc(userRef, {
        email: email,
        rating: 0,
        totalReviews: 0,
        bio: ""
      });
    }

    window.location.href = "index.html";
  } catch (error) {
    alert(error.message);
  }
};

// Logout
window.logoutUser = async function() {
  await signOut(auth);
  window.location.href = "login.html";
};

window.goHome = function() {
  window.location.href = "index.html";
};

// Auth Guard
onAuthStateChanged(auth, (user) => {
  if (!user &&
    !window.location.pathname.includes("login.html") &&
    !window.location.pathname.includes("register.html")) {
    window.location.href = "login.html";
  }
});

/* ================= POST SKILL ================= */

const skillForm = document.getElementById("skillForm");

if (skillForm) {
  skillForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const user = auth.currentUser;
    if (!user) return;

    await addDoc(collection(db, "skills"), {
      title: skillTitle.value,
      price: Number(skillPrice.value),
      desc: skillDesc.value,
      ownerId: user.uid,
      ownerEmail: user.email,
      createdAt: serverTimestamp()
    });

    alert("Skill Posted!");
    window.location.href = "marketplace.html";
  });
}

/* ================= POST TASK ================= */

const taskForm = document.getElementById("taskForm");

if (taskForm) {
  taskForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const user = auth.currentUser;
    if (!user) return;

    await addDoc(collection(db, "tasks"), {
      title: taskTitle.value,
      budget: Number(taskBudget.value),
      desc: taskDesc.value,
      ownerId: user.uid,
      ownerEmail: user.email,
      createdAt: serverTimestamp(),
      status: "open"
    });

    alert("Task Posted!");
    window.location.href = "marketplace.html";
  });
}

/* ================= MARKETPLACE ================= */

const skillsContainer = document.getElementById("skillsContainer");

if (skillsContainer) {
  const skillQuery = query(collection(db, "skills"), orderBy("createdAt", "desc"));

  onSnapshot(skillQuery, (snapshot) => {
    skillsContainer.innerHTML = "";

    if (!auth.currentUser) return;
    const currentUser = auth.currentUser;

    snapshot.forEach(docSnap => {
      const data = docSnap.data();
      const isOwner = currentUser.uid === data.ownerId;

      let actionButton = "";

      if (!isOwner) {
        actionButton = `
          <button onclick="hireSkill('${docSnap.id}', '${data.ownerId}')">
            Hire
          </button>
        `;
      }

      skillsContainer.innerHTML += `
        <div class="card">
          <h3>${data.title}</h3>
          <p>${data.desc}</p>
          <p>Price: $${data.price}</p>
          ${actionButton}
        </div>
      `;
    });
  });
}

const tasksContainer = document.getElementById("tasksContainer");

if (tasksContainer) {

  const taskQuery = query(collection(db, "tasks"), orderBy("createdAt", "desc"));

  onSnapshot(taskQuery, (snapshot) => {
    tasksContainer.innerHTML = "";

    if (!auth.currentUser) return;
    const currentUser = auth.currentUser;

    snapshot.forEach(docSnap => {
      const data = docSnap.data();
      const isOwner = currentUser.uid === data.ownerId;
      const isAcceptedUser = currentUser.uid === data.acceptedBy;

      let actionButton = "";

      if (data.status === "open" && !isOwner) {
        actionButton = `
          <button onclick="acceptTask('${docSnap.id}', '${data.ownerId}')">
            I'm Interested
          </button>
        `;
      }

      if (data.status === "in-progress" && (isOwner || isAcceptedUser)) {
        actionButton = `
          ${isOwner ? `
            <button onclick="completeTask('${docSnap.id}', '${data.acceptedBy}')">
              Mark Completed
            </button>
          ` : ""}
          <button onclick="openChat('${docSnap.id}')">
            Open Chat
          </button>
        `;
      }

      tasksContainer.innerHTML += `
        <div class="card">
          <h3>${data.title}</h3>
          <p>${data.desc}</p>
          <p>Status: ${data.status}</p>
          ${actionButton}
        </div>
      `;
    });
  });
}

/* ================= ACCEPT TASK ================= */

window.acceptTask = async function(taskId, ownerId) {
  const user = auth.currentUser;
  if (!user) return;

  if (user.uid === ownerId) {
    alert("You cannot accept your own task.");
    return;
  }

  const confirmAccept = confirm("Start private chat?");
  if (!confirmAccept) return;

  await updateDoc(doc(db, "tasks", taskId), {
    status: "in-progress",
    acceptedBy: user.uid
  });

  await setDoc(doc(db, "chats", taskId), {
    taskId: taskId,
    participants: [ownerId, user.uid],
    ownerId: user.uid,
    createdAt: serverTimestamp()
  });

  window.location.href = `chat.html?chatId=${taskId}`;
};

window.hireSkill = async function(skillId, ownerId) {
  const user = auth.currentUser;
  if (!user) return;

  if (user.uid === ownerId) {
    alert("You cannot hire your own skill.");
    return;
  }

  const confirmHire = confirm("Start private chat to hire this skill?");
  if (!confirmHire) return;

  try {
    await setDoc(doc(db, "chats", skillId), {
      skillId: skillId,
      participants: [ownerId, user.uid],
      ownerId: user.uid,
      createdAt: serverTimestamp()
    });
    window.location.href = `chat.html?chatId=${skillId}`;
  } catch (error) {
    alert("Error starting chat: " + error.message);
  }
};

window.openChat = function(taskId) {
  window.location.href = `chat.html?chatId=${taskId}`;
};

/* ================= CHAT SYSTEM ================= */

const chatBox = document.getElementById("chatBox");

if (chatBox) {

  const urlParams = new URLSearchParams(window.location.search);
  const chatId = urlParams.get("chatId");

  const messagesRef = collection(db, "chats", chatId, "messages");
  const messagesQuery = query(messagesRef, orderBy("createdAt"));

  onSnapshot(messagesQuery, (snapshot) => {
    chatBox.innerHTML = "";

    if (!auth.currentUser) return;
    const currentUser = auth.currentUser;

    snapshot.forEach(docSnap => {
      const data = docSnap.data();
      const isMe = data.senderId === currentUser.uid;

      chatBox.innerHTML += `
        <div style="
          display:flex;
          justify-content:${isMe ? "flex-end" : "flex-start"};
          margin:5px;
        ">
          <div style="
            background:${isMe ? "#ff8cc6" : "#eee"};
            padding:10px;
            border-radius:15px;
            max-width:60%;
          ">
            ${data.text}
          </div>
        </div>
      `;
    });

    chatBox.scrollTop = chatBox.scrollHeight;
  });

  const chatForm = document.getElementById("chatForm");

  chatForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const messageInput = document.getElementById("messageInput");
    const user = auth.currentUser;
    if (!user) return;

    try {
      await addDoc(messagesRef, {
        text: messageInput.value,
        senderId: user.uid,
        senderEmail: user.email,
        createdAt: serverTimestamp()
      });
      messageInput.value = "";
    } catch (error) {
      alert("Error sending message: " + error.message);
    }
  });
}

/* ================= COMPLETE TASK + RATING ================= */

window.completeTask = async function(taskId, workerId) {

  const confirmComplete = confirm("Mark this task as completed?");
  if (!confirmComplete) return;

  await updateDoc(doc(db, "tasks", taskId), {
    status: "completed",
    ratingGiven: false
  });

  const rating = prompt("Rate the worker (1-5 stars):");
  if (!rating || rating < 1 || rating > 5) return;

  const userRef = doc(db, "users", workerId);
  const userSnap = await getDoc(userRef);

  let currentRating = 0;
  let totalReviews = 0;

  if (userSnap.exists()) {
    const data = userSnap.data();
    currentRating = data.rating || 0;
    totalReviews = data.totalReviews || 0;
  }

  const newTotal = totalReviews + 1;
  const newRating = ((currentRating * totalReviews) + Number(rating)) / newTotal;

  await updateDoc(userRef, {
    rating: newRating,
    totalReviews: newTotal
  });

  await updateDoc(doc(db, "tasks", taskId), {
    ratingGiven: true
  });

  alert("Task completed & rating submitted!");
};

/* ================= PROFILE ================= */

const profileData = document.getElementById("profileData");

if (profileData) {
  onAuthStateChanged(auth, async (user) => {
    if (!user) return;

    const userDoc = await getDoc(doc(db, "users", user.uid));

    if (userDoc.exists()) {
      const data = userDoc.data();

      profileData.innerHTML = `
        <div class="profile-info-item">
          <span class="icon">📧</span>
          <div>
            <span class="label">Email:</span>
            <span class="value">${data.email}</span>
          </div>
        </div>
        <div class="profile-info-item">
          <span class="icon">⭐</span>
          <div>
            <span class="label">Rating:</span>
            <span class="value">${data.rating?.toFixed(2) || 0} stars</span>
          </div>
        </div>
        <div class="profile-info-item">
          <span class="icon">📊</span>
          <div>
            <span class="label">Total Reviews:</span>
            <span class="value">${data.totalReviews || 0}</span>
          </div>
        </div>
      `;
    }
  });
}

/* ================= DASHBOARD ================= */

const myTasks = document.getElementById("myTasks");
const acceptedTasks = document.getElementById("acceptedTasks");

if (myTasks) {
  onAuthStateChanged(auth, (user) => {
    if (!user) return;

    const q = query(collection(db, "tasks"));

    onSnapshot(q, (snapshot) => {
      myTasks.innerHTML = "";
      acceptedTasks.innerHTML = "";

      snapshot.forEach(docSnap => {
        const data = docSnap.data();

        if (data.ownerId === user.uid) {
          myTasks.innerHTML += `<p>${data.title} - ${data.status}</p>`;
        }

        if (data.acceptedBy === user.uid) {
          acceptedTasks.innerHTML += `<p>${data.title} - ${data.status}</p>`;
        }
      });
    });
  });
}