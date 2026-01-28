import { insertService, createPricesAndAreas } from '../services/insert.js';

export const insert = async (req, res) => {
    try {
        const response = await insertService(req.body);
        return res.status(200).json(response);
        
    } catch (error) {
        return res.status(500).json({ 
            err: -1,
            msg: 'Fail at auth controller: '+ error 
        });
    }
}

export const insertPricesAndAreas = async (req, res) => {
    try {
        const response = await createPricesAndAreas(req.body);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({ 
            err: -1,
            msg: 'Fail at auth controller: '+ error 
        });
    }
}