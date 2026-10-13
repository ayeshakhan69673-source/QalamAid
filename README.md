# 🎓 QalamAid — Scholarship Facilitation Platform

QalamAid is a full-stack web platform that connects **verified Pakistani university students with donors** and sends scholarship payments **directly to universities**, so the money goes where it is meant to go.

It was built as my **Final Year Project** at the University of Gujrat.

🔗 **Live demo:** [qalamaid.vercel.app](https://qalamaid.vercel.app)

---

## ✨ Features

- **Secure login:** JWT authentication with bcrypt-protected passwords
- **University verification:** one-time verification links that expire after 48 hours
- **Password recovery:** a 4-step reset flow using a one-time code (OTP)
- **Payment sandbox:** a custom 7-screen Easypaisa payment simulator with an OTP step
- **AI scholarship assistant:** a chatbot powered by the Google Gemini API that answers applicants' questions
- **Email notifications:** sent with Nodemailer; contact form with Mailjet
- **Document uploads:** handled with Multer
- **Internship application form** with its own backend route
- **Admin login** for managing the platform

## 🛠️ Tech Stack

| Area | Tools |
|------|-------|
| Backend | Node.js, Express.js |
| Database | MySQL (hosted on TiDB Cloud), 8 tables |
| Authentication | JWT, bcrypt |
| AI | Google Gemini API |
| Email & Uploads | Nodemailer, Mailjet, Multer |
| Frontend | HTML, CSS, JavaScript |
| Deployment | Vercel |

## 🚀 Run It Locally

1. **Clone the repository**
   ```bash
   git clone https://github.com/ayeshakhan69673-source/QalamAid.git
   cd QalamAid
   ```
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Create a `.env` file** with your own values:
   ```env
   DB_HOST=your-database-host
   DB_PORT=4000
   DB_USER=your-database-user
   DB_PASSWORD=your-database-password
   DB_NAME=student_aid_platform
   JWT_SECRET=your-secret-key
   GEMINI_API_KEY=your-gemini-api-key
   ```
4. **Start the server**
   ```bash
   npm start
   ```

> Never upload your `.env` file to GitHub. It contains private keys and passwords.

## 👥 Team

- **Ayesha Khan** — full-stack development
- **Muhammad Taha** — full-stack development
- **Supervisor:** Sir Zeeshan, University of Gujrat

## 📬 Contact

[LinkedIn](https://www.linkedin.com/in/ayesha-khan-6056992b1/) · [GitHub](https://github.com/ayeshakhan69673-source)
