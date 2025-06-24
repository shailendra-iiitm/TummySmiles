# 🥗 TummySmiles - Food Donation System

TummySmiles is a full-stack web application that enables donors to offer surplus food, agents to collect it, and admins to manage operations — optimized with real-time tracking and role-based control.

---

## 📌 Tech Stack

- **Frontend**: React, Tailwind CSS, Axios, React Router
- **Backend**: Node.js, Express.js, MongoDB (Mongoose)
- **Auth**: JWT-based authentication (no Firebase)
- **Tracking**: Geo-tagging (pickup/drop/agent locations)
- **Testing**: Postman collections included

---

## 👥 User Roles

| Role   | Permissions |
|--------|-------------|
| Donor  | Create/view/edit/delete donations, update profile |
| Agent  | Accept/reject pickups, mark collected/not found, update location |
| Admin  | Assign agents, update statuses, manage users and donations, view analytics |

---

## 🚀 Features

### ✅ Auth
- Register/Login via phone & password
- JWT-based session management
- Blocked users denied access

### ✅ Donor
- Donation creation with geo pickup location
- View/update/delete own donations
- Profile management

### ✅ Agent
- Assigned pickups dashboard
- Accept/reject/not-found/collected actions
- Live location updates
- Drop location visibility for ETA/maps

### ✅ Admin
- Assign agents with auto drop location
- View all donations with status filtering
- Block/unblock/delete users
- Real-time stats + donor/agent lists

---

## 🌍 Geo-Features

- Pickup location stored at creation
- Drop location auto-assigned randomly
- Agent location updatable for future live tracking & route optimization

---

## 📁 Folder Structure

```
backend/
├── controllers/
├── models/
├── routes/
├── middleware/
└── index.js

frontend/
├── components/
├── pages/
├── context/
└── App.jsx
```

---

## 📦 Installation

```bash
git clone https://github.com/yourname/tummysmiles.git
cd tummysmiles

# Setup backend
cd backend
npm install
npm run dev

# Setup frontend
cd ../frontend
npm install
npm run dev
```

---

## 🔑 Environment Variables

### `backend/.env`
```
JWT_SECRET=your_jwt_secret
MONGO_URI=your_mongodb_connection_string
```

---

## 🧪 Postman Collection

✅ All routes tested and documented in:

- `FoodDonationSystem_FULL.postman_collection.json`

---

## 📈 Future Improvements

- Google Maps integration for real-time routing
- SMS/Push notification alerts
- Role-level analytics dashboard
- Mobile app for agents

---

## 📸 Screenshots

*(Add screenshots of donor/agent/admin dashboards here once frontend is ready)*

---

## 🧑‍💻 Contributors

- 👨‍💻 Shailendra Shukla
- 🧠 ChatGPT (backend design + logic)