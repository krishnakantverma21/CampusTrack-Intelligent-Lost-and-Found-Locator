export function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}

export function validatePassword(password) {
    return password.length >= 6; // Example: Password must be at least 6 characters long
}

export function validateName(name) {
    return name.trim().length > 0; // Name should not be empty
}

export function validateForm(fields) {
    const { email, password, name } = fields;
    const errors = {};

    if (!validateEmail(email)) {
        errors.email = "Invalid email address";
    }
    if (!validatePassword(password)) {
        errors.password = "Password must be at least 6 characters long";
    }
    if (name && !validateName(name)) {
        errors.name = "Name cannot be empty";
    }

    return errors;
}