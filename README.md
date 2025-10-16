# Login Form Project

This project is a simple React application that provides a login and signup interface. It includes forms for user authentication, allowing users to log in, sign up, and reset their passwords.

## Project Structure

```
login-form
├── public
│   └── index.html          # Main HTML file serving as the entry point
├── src
│   ├── index.js            # Entry point of the React application
│   ├── App.js              # Main application component
│   ├── AuthForm.js         # Component managing login/signup toggle
│   ├── components
│   │   ├── LoginForm.js    # Component for login form
│   │   ├── SignupForm.js   # Component for signup form
│   │   └── ForgotPassword.js # Component for password recovery
│   ├── hooks
│   │   └── useForm.js      # Custom hook for form state management
│   ├── utils
│   │   └── validation.js    # Utility functions for input validation
│   └── styles
│       └── App.css         # CSS styles for the application
├── package.json             # npm configuration file
├── .gitignore               # Files and directories to ignore by Git
└── README.md                # Documentation for the project
```

## Features

- **Login Form**: Users can log in using their email and password.
- **Signup Form**: New users can create an account by providing their name, email, and password.
- **Forgot Password**: Users can request a password reset link by entering their email.
- **Form Validation**: Input fields are validated to ensure correct data entry.

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd login-form
   ```
3. Install the dependencies:
   ```
   npm install
   ```

## Usage

To start the application, run:
```
npm start
```
This will launch the application in your default web browser.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License.