'use strict';

/* Define and load Modules */
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = express.Router();

/* Include Models & Schemas */
import Users from '../models/users.js';

/* Load Functions, Locales and Config Files */
import MyFunctions from '../includes/functions.js';

router.post('/login', async (req, res) => {
	try {
		/* Get the object from request */
		const payload = req.body;

		/* Check if "Email" and "Password" are valid */
		const user = await Users.findOne({ email: payload.email });

		if (!user) {
			/* Invalid Credentials */
			res.status(200).json({
				Response: false,
				Message: `User not found.`,
			});
		} else {
			const validPassword = await bcrypt.compare(
				payload.password,
				user.password
			);

			if (!validPassword) {
				/* Invalid Credentials */
				res.status(200).json({
					Response: false,
					Message: `User or password incorrect`,
				});
			} else {
				/* Create an assign a TOKEN */
				const sessionToken = jwt.sign(
					{
						/* Token Data */
						id: user.id,
					},
					process.env.SECRET_TOKEN || '12345'
				);

				res.status(200).json({
					Response: true,
					id: user.id,
					sessionToken,
				});
			}
		}
	} catch (err) {
		/* Return FALSE */
		res.status(200).json({
			Response: false,
			Message: `${err}`,
		});
	}
});

router.post('/register', async (req, res) => {
	try {
		/* Get the object from request */
		const payload = req.body;

		/* Check if username/email already exists */
		const checkIfEmailExists = await Users.findOne({ email: payload.email });

		if (checkIfEmailExists) {
			/* Return FALSE */
			res.status(200).json({
				Response: false,
				Message: `Email in use.`,
			});
		} else {
			/* Generate Unique Token */
			const userId = MyFunctions.generateUniqueID();

			/* Salt & Hash the Temporary Password */
			const salt = await bcrypt.genSalt(10);
			const hashedPassword = await bcrypt.hash(payload.password, salt);

			/* New User Object */
			const newUser = new Users({
				id: userId,
				email: payload.email,
				password: hashedPassword,
			});

			const savedUser = await newUser.save();

			/* New User Created */
			res.status(200).json({
				Response: true,
				Message: `User created`,
			});
		}
	} catch (error) {
		/* Return FALSE */
		res.status(200).json({
			Response: false,
			Message: `${error}`,
		});
	}
});

/* Export this Module */
export default router;
