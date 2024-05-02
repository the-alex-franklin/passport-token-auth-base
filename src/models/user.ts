// src/models/User.ts
import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
    username: string;
    password: string;
    comparePassword(candidatePassword: string, callback: (err: Error | null, isMatch?: boolean) => void): void;
}

const UserSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

UserSchema.pre('save', async function (next) {
    const user = this as IUser;
    if (!user.isModified('password')) return next();

    user.password = await bcrypt.hash(user.password, 10);
    next();
});

UserSchema.methods.comparePassword = function (candidatePassword: string, callback: (err: Error | null, isMatch?: boolean) => void) {
    bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
        callback(err, isMatch);
    });
};

const User = mongoose.model<IUser>('User', UserSchema);
export default User;
