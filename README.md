PHARMAHELP💊🩺💉


# pharmahelp
healthcare platform!

# PharmaHelp

PharmaHelp is a modern digital health platform for patients, pharmacists, doctors, and admins. It enables prescription management, medicine search, side-effect reporting, and more, with a clean and professional UI built using Tailwind CSS.

## Features

- **Patient Portal:** Upload/download prescriptions, report side effects, check medicine availability.
- **Pharmacist Dashboard:** View and reply to side-effect reports, manage medicines.
- **Doctor Panel:** Review and reply to patient side-effect reports.
- **Admin Panel:** View all prescriptions, manage users and medicines.
- **Authentication:** Secure login/register for multiple roles.
- **Responsive Design:** Works on desktop and mobile.

## Folder Structure

```
pharmahelp/
├── backend/
│ ├── server.js
│ ├── controllers/
│ ├── middleware/
│ ├── models/
│ └── routes/
├── frontend/
│ ├── admin.html
│ ├── dashboard.html
│ ├── doctor-panel.html
│ ├── login.html
│ ├── medicine_form.html
│ ├── medicine.html
│ ├── patient-dashboard.html
│ ├── pharmahelp.html
│ ├── register.html
│ ├── report.html
│ ├── side-effects-dashboard.html
│ ├── side-effects.html
│ ├── upload.html
│ ├── css/
│ └── js/
└── .env.example
```

## Installation & Setup

### 1. Clone the Repository

```sh
git clone https://github.com/yourusername/pharmahelp.git
cd pharmahelp
```

### 2. Backend Setup

- Install dependencies:

```sh
cd backend
npm install
```

- Create a `.env` file in the root with your database and email credentials (see `.env.example`):

```
DB_HOST=localhost
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=pharmacy
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
```

- Start MySQL and create the database:

```sql
CREATE DATABASE pharmacy;
```

- Start the backend server:

```sh
node server.js
```

### 3. Frontend Setup

- No build step required. All HTML/CSS/JS files are ready to use.
- You can serve them using [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) in VS Code or deploy as static files.

### 4. Usage

- Open `frontend/pharmahelp.html` in your browser to access the homepage.
- Use the navigation to access login, register, dashboards, and other features.
- Backend API runs on `http://localhost:5000` by default.

### 5. Deployment

- **Frontend:** Deploy `frontend/` folder to Netlify, Vercel, or any static hosting.
- **Backend:** Deploy `backend/` folder to Render, Heroku, or similar Node.js hosting.
- Update frontend JS API URLs to point to your live backend.

### 6. Environment & Security

- **Do NOT commit your `.env` file**. Use `.env.example` for sharing config structure.
- **Do NOT commit `node_modules`**. It is ignored by default.

## Contributing

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Create a Pull Request

## License

MIT

---

**For any issues or questions, open an issue or contact
