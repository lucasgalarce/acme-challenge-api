'use strict';

/* Define and load Modules */
import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

/* Include Models & Schemas */
import Licenses from '../models/licenses.js';

/* Function to Validate Session Token */
const validateToken = (req, res, next) => {
	const sessToken = req.header('sessToken');

	if (!sessToken) return res.status(401).send('Access Denied');

	try {
		const verified = jwt.verify(sessToken, process.env.SECRET_TOKEN || '12345');
		next();
	} catch (error) {
		res.status(400).send(error);
	}
};

router.get('/fetchAllLicenses', validateToken, async (req, res) => {
	try {
		/* Fetch Developers*/
		const fetchedLicenses = await Licenses.find();

		/* Send response OK */
		res.status(200).json({
			Response: true,
			fetchedLicenses,
		});
	} catch (err) {
		/* Send response FALSE */
		res.status(200).json({
			Response: false,
			Message: `${err}`,
		});
	}
});

/* Export this Module */
export default router;
