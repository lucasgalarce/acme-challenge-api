'use strict';

/* Required Modules */
import * as uuid from 'uuid';

export default class MyFunctions {

    /* Function to Generate Universally UIDentifier */
    static generateUniqueID = () => {

        // v4 = Random.
        return uuid.v4();
    }
    
}