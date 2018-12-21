'use strict'

const User = use('App/Models/User');

class UserController {
    // login user creation
    async login({ request, auth }) {
        const { email, password } = request.all();
        const token = await auth.attempt(email, password);
        return token;

    };


    //register new user
    async register({ request }) {
        const { email, password } = request.all();
        await User.create({
            email,
            password,
            username: email
        });

        return this.login(...arguments);
    };
}

module.exports = UserController;