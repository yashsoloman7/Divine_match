# Divine Match

Divine Match is a comprehensive form-based web application tailored for Christian matrimony. It is designed to facilitate meaningful connections, allowing divorced, single men and women to register as candidates, generate digital biodata cards, and participate in organized events like the annual "Yuvak Yuvti Sammelan."

## 🌟 Features

- **Candidate Registration**: Secure registration process with validated contact information (mandatory phone number).
- **Digital Biodata Generation**: Automatically generates elegant digital biodata cards for registered candidates.
- **Event Management**: Built-in support for organizing and managing physical meetups and annual events.
- **Admin Dashboard**: Robust admin panel for managing candidate data, viewing full biodata, and seamless CSV import of pre-added candidates.
- **Secure Authentication**: Email and password-based authentication with protected routes.
- **Responsive Design**: Designed to work flawlessly across desktop, tablet, and mobile devices.

## 🛠️ Technology Stack

- **Frontend**: React 19, Vite, React Router DOM v7
- **Styling**: Vanilla CSS (`index.css`)
- **Backend**: Supabase (Authentication & Database)
- **Icons**: Lucide React
- **Data Parsing**: PapaParse (for CSV imports)

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- npm or yarn
- Supabase account and project

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd divine_match
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the root directory and add your Supabase credentials (refer to `.env.example`):
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser** and navigate to `http://localhost:5173`.

## 📁 Project Structure

```text
src/
├── assets/        # Static assets (images, fonts, etc.)
├── components/    # Reusable React components (Navbar, Footer, AdminLayout, etc.)
├── config/        # Configuration files
├── context/       # React Context providers (AuthContext)
├── data/          # Mock data or static data assets
├── pages/         # Page components (Home, Register, Biodata, Admin views)
├── services/      # API and backend service integrations (Supabase operations)
├── styles/        # Additional stylesheets
├── App.jsx        # Main application routing
└── main.jsx       # Application entry point
```

## 📜 Available Scripts

In the project directory, you can run:

- `npm run dev` - Starts the Vite development server.
- `npm run build` - Builds the app for production to the `dist` folder.
- `npm run lint` - Runs ESLint to catch syntax and style issues.
- `npm run preview` - Locally preview the production build.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📄 License

This project is private and all rights are reserved.
