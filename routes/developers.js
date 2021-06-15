'use strict';

/* Define and load Modules */
import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

/* Include Models & Schemas */
import Developers from '../models/developers.js';
import Assets from '../models/assets.js';
import Licenses from '../models/licenses.js';

/* Load Functions, Locales and Config Files */
import MyFunctions from '../includes/functions.js';

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

router.get('/fetchAllDevelopers', validateToken, async (req, res) => {
	try {
		/* Fetch Developers*/
		const fetchedDevelopers = await Developers.find();
		const developersWithAssignments = [];

		for (let developer of fetchedDevelopers) {
			const fetchedAssets = await Assets.find({ id: developer.assetsId });
			const fetchedLicenses = await Licenses.find({ id: developer.licensesId });

			developersWithAssignments.push({
				id: developer.id,
				fullname: developer.fullname,
				active: developer.active,
				assets: fetchedAssets,
				licenses: fetchedLicenses,
			});
		}

		/* Send response OK */
		res.status(200).json({
			Response: true,
			fetchedDevelopers: developersWithAssignments,
		});
	} catch (err) {
		/* Send response FALSE */
		res.status(200).json({
			Response: false,
			Message: `${err}`,
		});
	}
});

router.post('/createDeveloper', validateToken, async (req, res) => {
	try {
		const payload = req.body;

		/* Generate Unique Id */
		const developerId = MyFunctions.generateUniqueID();

		const newDeveloper = new Developers({
			id: developerId,
			fullname: payload.fullname,
		});

		const saveDeveloper = await newDeveloper.save();

		/* Return TRUE */
		res.status(200).json({
			Response: true,
			Message: 'Developer created.',
			newDeveloper,
		});
	} catch (err) {
		/* Send response FALSE */
		res.status(200).json({
			Response: false,
			Message: `${err}`,
		});
	}
});

router.post('/addAssetToDeveloper', validateToken, async (req, res) => {
	try {
		const { developerId, assetId } = req.body;

		if (!developerId || !assetId) {
			return res.status(200).json({
				Response: false,
				Message: 'Developer Id and Asset Id are required.',
			});
		}

		const fetchedAsset = await Assets.findOne({ id: assetId });
		const fetchedDeveloper = await Developers.findOne({ id: developerId });

		if (!fetchedAsset) {
			return res.status(200).json({
				Response: false,
				Message: `Asset doesn't exist`,
			});
		}

		if (!fetchedDeveloper) {
			return res.status(200).json({
				Response: false,
				Message: `Developer doesn't exist`,
			});
		}

		const hasThisAsset = fetchedDeveloper.assetsId.some(
			(asset) => asset === assetId
		);

		if (hasThisAsset) {
			return res.status(200).json({
				Response: false,
				Message: `Developer already have this asset`,
			});
		}

		const newVal = {
			$push: {
				assetsId: assetId,
			},
		};

		const savedNewStatus = await Developers.updateOne(
			{ id: developerId },
			newVal
		);

		return res.status(200).json({
			Response: true,
			Message: `Added asset succesfull`,
		});
	} catch (e) {
		console.log(e);
	}
});

router.delete('/deleteAssetToDeveloper', validateToken, async (req, res) => {
	try {
		const { developerId, assetId } = req.body;

		if (!developerId || !assetId) {
			return res.status(200).json({
				Response: false,
				Message: 'Developer Id and Asset Id are required.',
			});
		}

		const fetchedAsset = await Assets.findOne({ id: assetId });
		const fetchedDeveloper = await Developers.findOne({ id: developerId });

		if (!fetchedAsset) {
			return res.status(200).json({
				Response: false,
				Message: `Asset doesn't exist`,
			});
		}

		if (!fetchedDeveloper) {
			return res.status(200).json({
				Response: false,
				Message: `Developer doesn't exist`,
			});
		}

		const hasThisAsset = fetchedDeveloper.assetsId.some(
			(asset) => asset === assetId
		);

		if (!hasThisAsset) {
			return res.status(200).json({
				Response: false,
				Message: `Developer hasn't this asset`,
			});
		}

		const newVal = {
			$pull: {
				assetsId: assetId,
			},
		};

		const savedNewStatus = await Developers.updateOne(
			{ id: developerId },
			newVal
		);

		return res.status(200).json({
			Response: true,
			Message: `Deleted asset succesfull`,
		});
	} catch (e) {
		console.log(e);
	}
});

router.post('/addLicenseToDeveloper', validateToken, async (req, res) => {
	try {
		const { developerId, licenseId } = req.body;

		if (!developerId || !licenseId) {
			return res.status(200).json({
				Response: false,
				Message: 'Developer Id and License Id are required.',
			});
		}

		const fetchedLicense = await Licenses.findOne({ id: licenseId });
		const fetchedDeveloper = await Developers.findOne({ id: developerId });

		if (!fetchedLicense) {
			return res.status(200).json({
				Response: false,
				Message: `License doesn't exist`,
			});
		}

		if (!fetchedDeveloper) {
			return res.status(200).json({
				Response: false,
				Message: `Developer doesn't exist`,
			});
		}

		const hasThisLicense = fetchedDeveloper.licensesId.some(
			(license) => license === licenseId
		);

		if (hasThisLicense) {
			return res.status(200).json({
				Response: false,
				Message: `Developer already have this license`,
			});
		}

		const newVal = {
			$push: {
				licensesId: licenseId,
			},
		};

		const savedNewStatus = await Developers.updateOne(
			{ id: developerId },
			newVal
		);

		return res.status(200).json({
			Response: true,
			Message: `Added license succesfull`,
		});
	} catch (e) {
		console.log(e);
	}
});

router.delete('/deleteLicenseToDeveloper', validateToken, async (req, res) => {
	try {
		const { developerId, licenseId } = req.body;

		if (!developerId || !licenseId) {
			return res.status(200).json({
				Response: false,
				Message: 'Developer Id and License Id are required.',
			});
		}

		const fetchedLicense = await Licenses.findOne({ id: licenseId });
		const fetchedDeveloper = await Developers.findOne({ id: developerId });

		if (!fetchedLicense) {
			return res.status(200).json({
				Response: false,
				Message: `License doesn't exist`,
			});
		}

		if (!fetchedDeveloper) {
			return res.status(200).json({
				Response: false,
				Message: `Developer doesn't exist`,
			});
		}

		const hasThisLicense = fetchedDeveloper.licensesId.some(
			(license) => license === licenseId
		);

		if (!hasThisLicense) {
			return res.status(200).json({
				Response: false,
				Message: `Developer hasn't this license`,
			});
		}

		const newVal = {
			$pull: {
				licensesId: licenseId,
			},
		};

		const savedNewStatus = await Developers.updateOne(
			{ id: developerId },
			newVal
		);

		return res.status(200).json({
			Response: true,
			Message: `Deleted license succesfull`,
		});
	} catch (e) {
		console.log(e);
	}
});

router.put('/changeStatus', validateToken, async (req, res) => {
	try {
		const { id, status } = req.body;

		if (!id || status === undefined) {
			return res.status(200).json({
				Response: false,
				Message: 'Id and status are required.',
			});
		}

		const fetchedDeveloper = await Developers.findOne({ id });

		if (!fetchedDeveloper) {
			return res.status(200).json({
				Response: false,
				Message: `Developer doesn't exist`,
			});
		}

		let newVal = {
			$set: {
				active: status,
			},
		};

		let savedNewStatus = await Developers.updateOne({ id }, newVal);

		/* Clean thei assets and licenses if disabled developer */
		if (status === false) {
			newVal = {
				assetsId: [],
				licensesId: [],
			};

			savedNewStatus = await Developers.updateOne({ id }, newVal);
		}

		return res.status(200).json({
			Response: true,
			Message: `Developer ${fetchedDeveloper.fullname}, active: ${status}`,
		});
	} catch (e) {
		console.log(e);
	}
});

/* Export this Module */
export default router;
