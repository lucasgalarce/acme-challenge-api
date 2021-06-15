'use strict';

/* Define and load Modules */
import express from 'express';
import axios from 'axios';

/* Include Models & Schemas */
import Users from '../models/users.js';

const CreateFirstUser = async () => {

    /* Check if there are users  */
    const isFirstUser = await Users.countDocuments();

    if(isFirstUser) return;

    try {

        const userEmail = 'admin@test.com';
        const password = 'admin';
        const url = 'http://localhost:3000/users/register';

        const response = await axios.post(url, {
            email: userEmail,
            password
        });
        
        console.log(response.data);
    } catch (error) {
        console.error(error);
    }
}

export default CreateFirstUser;
