# Login Form Backend

This is a Spring Boot application for a simple login form. It provides user authentication features, including registration and login functionalities.

## Project Structure

```
login-form-backend
├── src
│   ├── main
│   │   ├── java
│   │   │   └── com
│   │   │       └── loginform
│   │   │           ├── LoginFormApplication.java
│   │   │           ├── controller
│   │   │           │   └── AuthController.java
│   │   │           ├── model
│   │   │           │   └── User.java
│   │   │           ├── repository
│   │   │           │   └── UserRepository.java
│   │   │           └── service
│   │   │               └── UserService.java
│   │   └── resources
│   │       └── application.properties
├── pom.xml
└── README.md
```

## Technologies Used

- Spring Boot
- Spring Data JPA
- MySQL

## Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd login-form-backend
   ```

2. **Configure the database:**
   Update the `src/main/resources/application.properties` file with your MySQL database connection details.

3. **Build the project:**
   Use Maven to build the project:
   ```bash
   mvn clean install
   ```

4. **Run the application:**
   You can run the application using the following command:
   ```bash
   mvn spring-boot:run
   ```

## Usage

- **Register a new user:** Send a POST request to `/api/auth/register` with the user details.
- **Login:** Send a POST request to `/api/auth/login` with the username and password.

## License

This project is licensed under the MIT License.