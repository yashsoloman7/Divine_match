# Divine Match

Divine Match is a comprehensive form-based web application tailored for Christian matrimony. It is designed to facilitate meaningful connections, allowing divorced, single men and women to register as candidates, generate digital biodata cards, and participate in organized events like the annual "Yuvak Yuvti Sammelan."

## 🌟 Features

- **Candidate Registration**: Secure registration process with validated contact information (mandatory phone number).
- **Digital Biodata Generation**: Automatically generates elegant digital biodata cards for registered candidates.
- **Event Management**: Built-in support for organizing and managing physical meetups and annual events.
- **Admin Dashboard**: Robust admin panel for managing candidate data, viewing full biodata, and seamless CSV import of pre-added candidates.
- **Secure Authentication**: Authentication with protected routes.
- **Responsive Design**: Designed to work flawlessly across desktop, tablet, and mobile devices.

## 🛠️ Technology Stack

- **Frontend**: React 19, Vite, React Router DOM v7
- **Styling**: Vanilla CSS (`index.css`)
- **Backend Framework**: Node.js & Express.js
- **Database**: MongoDB Atlas
- **Icons**: Lucide React
- **Data Parsing**: PapaParse (for CSV imports)

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- npm or yarn
- MongoDB Atlas cluster connection string

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd divine_match
   ```

2. **Frontend Setup:**
   ```bash
   # Install dependencies
   npm install
   
   # Start the development server
   npm run dev
   ```

3. **Backend Setup:**
   ```bash
   # Navigate to the backend directory
   cd server
   
   # Install backend dependencies
   npm install
   ```

4. **Environment Variables:**
   Create a `.env` file inside the `server/` directory and add your MongoDB connection string and designated port:
   ```env
   MONGO_URI="mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority"
   PORT=5000
   ```
   *Note: Ensure `.env` is inside the `server/` directory, not just the root folder.*

5. **Start the Backend Server:**
   ```bash
   # From inside the server/ directory
   node server.js
   ```

6. **Open your browser** and navigate to `http://localhost:5173`.

## 📁 Project Structure

```text
divine_match/
├── src/                # Frontend codebase
│   ├── assets/         # Static assets (images, fonts, etc.)
│   ├── components/     # Reusable React components
│   ├── context/        # React Context providers
│   ├── data/           # Mock data or static data assets
│   ├── pages/          # Page components
│   ├── services/       # API services communicating with backend
│   ├── App.jsx         # Main application routing
│   └── main.jsx        # Application entry point
├── server/             # Backend codebase
│   ├── config/         # Database and server config
│   ├── controllers/    # API endpoint logic
│   ├── models/         # Mongoose schemas/models
│   ├── routes/         # Express API routes
│   └── server.js       # Main backend entry point
```

## 📜 Available Scripts

In the project root directory, you can run:

- `npm run dev` - Starts the Vite development server.
- `npm run build` - Builds the app for production to the `dist` folder.
- `npm run lint` - Runs ESLint to catch syntax and style issues.
- `npm run preview` - Locally preview the production build.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📄 License

This project is private and all rights are reserved.
