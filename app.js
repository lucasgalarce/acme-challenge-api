'use strict';

/* Include Node.js Modules */
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

// import config from './config/config.js';

/* Include Routes */
import developers from './routes/developers.js';
import users from './routes/users.js';
import assets from './routes/assets.js';
import licenses from './routes/licenses.js';

import CreateFirstUser from './includes/createFirstUser.js';
import CreateAssetsAndLicenses from './includes/createAssetsAndLicenses.js';

dotenv.config();

/* Init Express Framework */
const app = express();

/* BodyParser Middleware */
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/* Enable CORS */
app.use(cors());

const PORT = process.env.PORT || 3000;

/* Set the PORT and Start Web Server */
app.set('port', PORT || 3000);
const server = app.listen(PORT, () => {
	console.log('Server: ' + PORT);
});

/* Define Routes */
app.use('/developers', developers);
app.use('/users', users);
app.use('/assets', assets);
app.use('/licenses', licenses);

// MongoDB Connection
mongoose.set('useCreateIndex', true);

try {
	mongoose.connect(
		`mongodb+srv://${process.env.DB_USER || 'admin'}:${process.env.DB_PASS || 'admin'}@cluster0.opnyh.mongodb.net/acme?authSource=admin&replicaSet=Cluster0-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true`,
		{
			useNewUrlParser: true,
			useUnifiedTopology: true,
		},
		(err, res) => {
			if (err) throw err;

			console.log('DB online');
		}
	);
} catch (err) {
	console.log(err);
}

CreateFirstUser();
CreateAssetsAndLicenses();
