# 🏆 Colloquium 2K26 Winners

# ⚡ EV Bharat – Smart EV Charging Station Locator

A production-ready **AI-powered EV charging platform** built using **React, Node.js, Express, MongoDB, and Rasa NLU**, focused on solving India's real-world EV infrastructure problem.

🌐 **Live Website:**  
👉 [https://ev-bharat-mu.vercel.app](https://ev-bharat-mu.vercel.app)

🤖 **AI Chatbot (EVA):**  
👉 [https://huggingface.co/spaces/shivampimple29/EVAssistant](https://huggingface.co/spaces/shivampimple29/EVAssistant)

---

## 📌 Project Overview

India has over 2 million EVs on the road — but charging infrastructure remains fragmented, with no centralized platform for real-time discovery or route-based planning.

**EV Bharat** is a full-stack EV charging station locator that simulates a real-world production platform.  
It demonstrates how geospatial databases, cloud APIs, AI chatbots, and role-based systems come together to solve a live infrastructure problem in India's growing EV ecosystem.

---

## 🎯 Objective

To design and deploy a production-ready EV platform that:

- Discovers nearby EV charging stations using GPS  
- Plans routes with charging stops using geospatial queries  
- Implements a three-tier role system (user, station owner, admin)  
- Integrates a domain-trained AI chatbot connected to a live database  
- Handles authentication and session management securely  
- Runs successfully across three cloud platforms simultaneously  

---

## 🚀 Key Features

- 🔎 Smart Search & Filters (charger type, power, availability, rating, city)  
- 🗺️ Interactive Mapbox Map with live station markers and GPS-based nearby search  
- 🛣️ Route Planning — finds charging stations along your entire journey using MongoDB `$geoWithin` + `$centerSphere`  
- 📍 Station Detail Pages — charger specs, amenities, operator info, live reviews  
- ⭐ Reviews & Rating System with auto-recalculating averages  
- 💳 Slot Booking & Payment System  
- 🤖 EVA AI Chatbot — Rasa NLU model trained on EV-specific intents hitting a live database  
- 👮 Admin Dashboard — live stats, station approval/rejection with one click  
- 🏢 Station Owner Portal — submit stations, track verification status  
- 🔐 JWT Authentication with role-based access control  
- 📱 Fully Responsive UI  

---

## 🛠️ Tech Stack

### Frontend
- React + Vite  
- Tailwind CSS  
- Font Awesome Icons  
- Mapbox GL JS  

### Backend
- Node.js  
- Express.js  
- MongoDB Atlas (with 2dsphere geospatial indexing)  
- Mongoose  
- JSON Web Tokens (JWT)  

### AI Chatbot
- Rasa NLU  
- Rasa Custom Actions (Python)  

### Deployment
- Vercel (Frontend)  
- Render (Backend)  
- HuggingFace Spaces (Chatbot)  

---

## 🧩 Application Flow

1. User visits the deployed Vercel frontend  
2. React fetches live data from the Node.js backend on Render  
3. Backend connects to MongoDB Atlas and processes queries  
4. GPS-based search uses MongoDB `$near` with 2dsphere index  
5. Route planning samples Mapbox coordinates and runs `$geoWithin` queries  
6. JWT token validates every protected request at the API level  
7. Admin approves stations — `isVerified` flips instantly in the database  
8. EVA chatbot receives messages, runs NLU pipeline, calls backend APIs, returns real data  

---

## 👥 Team

| Name | Roll No |
|------|---------|
| Aryan Patil | 26 |
| Shivam Pimple | 28 |
| Tanish Sawant | 35 |
| Sayed Shahroz | 46 |

**Mentor:** Prof. Dhanashri Lamane  
**Institution:** St. Francis Institute of Technology, Borivali, Mumbai  

---

## 📈 Future Enhancements

- 📱 Dedicated mobile application (React Native)  
- 🤖 AI-based battery range prediction and smart charging recommendations  
- 🔔 Automated SMS/push notifications for availability updates  
- 🏛️ Integration with government EV databases and national charging networks  
- 🌏 Nationwide expansion including rural coverage  
- 🔄 Real-time WebSocket-based station status updates  

---

## 📜 Disclaimer

This project is built strictly for educational and demonstration purposes as part of Colloquium 2K26 at St. Francis Institute of Technology.  
It is not intended for commercial deployment.

---

## 📌 Conclusion

EV Bharat demonstrates the ability to build and deploy a real-world full-stack platform with:

- Production-level MERN architecture across three cloud platforms  
- Real geospatial querying using MongoDB 2dsphere indexing  
- Domain-trained AI chatbot integrated with a live database  
- JWT-based authentication with a three-tier role system  
- End-to-end deployment — live, accessible, and running right now  

---

⭐ **Focused on geospatial engineering, AI integration, cloud deployment, and real-world impact.**
