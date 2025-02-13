/* eslint-disable @typescript-eslint/no-explicit-any */
import express from 'express';
import { packageController } from './package.controller';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';

const router = express.Router();

router.post('/create', auth(USER_ROLES.ADMIN), packageController.createPackage);

router.get('/all-package', packageController.allPackage);

router.patch(
  '/update/:id',
  auth(USER_ROLES.ADMIN),
  packageController.updatePackage,
);

router.delete(
  '/delete/:id',
  auth(USER_ROLES.ADMIN),
  packageController.deletePackage,
);

export const packageRoute = router;
