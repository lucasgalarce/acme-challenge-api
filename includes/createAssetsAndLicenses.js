'use strict';

/* Define and load Modules */
import fs from 'fs';

/* Include Models & Schemas */
import Assets from '../models/assets.js';
import Licenses from '../models/licenses.js';


const CreateAssetsAndlicenses = async () => {

    /* Import JSON File */
    const rawdata = fs.readFileSync('./includes/fixtures.json');
    const fixturesJSON = JSON.parse(rawdata);

    try {

        /* Check if there are users  */
        const isFirstInitialization = await Assets.countDocuments() > 0 ? false : true;

        if (isFirstInitialization) {

            for(let asset of fixturesJSON.catalog.assets) {
                
                const newAsset = new Assets({
                    id: asset.id,
                    brand: asset.brand,
                    model: asset.model,
                    type: asset.type,
                });
        
                const saveAsset = await newAsset.save();
            }
            
            for(let license of fixturesJSON.catalog.licences) {
                
                const newLicense = new Licenses({
                    id: license.id,
                    software: license.software,

                });
        
                const saveLicense = await newLicense.save();
            }

            console.log("Asset and license upload completed");
        }

    } catch(e) {
        console.log(e)
    }
}

export default CreateAssetsAndlicenses;
