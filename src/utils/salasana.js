import bcrypt from 'bcrypt';

export const checkPassword = (password, hashedPassword) => {
    return bcrypt.compareSync(password, hashedPassword);
};