'use strict';

/* Define and load Modules */
import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

/* Include Models & Schemas */
import Assets from '../models/assets.js';

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

router.get('/fetchAllAssets', validateToken, async (req, res) => {
	try {
		/* Fetch Developers*/
		const fetchedAssets = await Assets.find();

		/* Send response OK */
		res.status(200).json({
			Response: true,
			fetchedAssets,
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
