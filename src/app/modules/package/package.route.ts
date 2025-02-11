/* eslint-disable @typescript-eslint/no-explicit-any */
import express from 'express';
import { packageController } from './package.controller';

const router = express.Router();

router.post('/create', packageController.createPackage);

router.patch('/update/:id', packageController.updatePackage);

router.delete('/delete/:id', packageController.deletePackage);

export const packageRoute = router;
