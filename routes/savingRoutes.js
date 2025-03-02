const express = require('express');
const route = express.Router();
const {createSavingsPlan,
    getAllSavingsPlansForUser,
    getSavingsPlanById,
    updateSavingsPlan,
    deleteSavingsPlan,
    getAllSavingsPlansForAllUsers
} = require('../controllers/savingController')   
const { validation } = require('../middleware/auth');

route.post('/create', validation, createSavingsPlan);
route.get('/user/:userId', validation, getAllSavingsPlansForUser);
route.get('/get/:savingsId', validation, getSavingsPlanById);
route.put('/update/:savingsId', validation, updateSavingsPlan);
route.delete('/delete/:savingsId', validation, deleteSavingsPlan);
route.get('/', validation, getAllSavingsPlansForAllUsers);

module.exports = route;