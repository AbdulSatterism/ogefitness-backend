import express from 'express';
import { AuthRoutes } from '../app/modules/auth/auth.route';
import { UserRoutes } from '../app/modules/user/user.route';
import { NotificationRoutes } from '../app/modules/notifications/notifications.route';
import { settingRoutes } from '../app/modules/setting/setting.route';
import { privacyRoutes } from '../app/modules/privacy/privacy.routes';
import { aboutRoutes } from '../app/modules/aboutUs/aboutUs.route';
import { reviewRoutes } from '../app/modules/review/review.route';

import { tersmConditionRoutes } from '../app/modules/termsAndCondition/termsAndCondition.route';
import { nutritionRoutes } from '../app/modules/nutrition/nutrition.route';
import { exerciseRoutes } from '../app/modules/exercise/exercise.route';
import { appointmentRoutes } from '../app/modules/appointment/appointment.route';
import { bookAppointmentRoutes } from '../app/modules/bookAppointment/bookAppointment.route';
const router = express.Router();

const apiRoutes = [
  { path: '/user', route: UserRoutes },
  { path: '/auth', route: AuthRoutes },

  { path: '/nutrition', route: nutritionRoutes },
  { path: '/exercise', route: exerciseRoutes },
  { path: '/appointment', route: appointmentRoutes },
  { path: '/book-appointment', route: bookAppointmentRoutes },

  { path: '/notification', route: NotificationRoutes },
  { path: '/setting', route: settingRoutes },
  { path: '/privacy', route: privacyRoutes },
  { path: '/about', route: aboutRoutes },
  { path: '/review', route: reviewRoutes },
  { path: '/terms', route: tersmConditionRoutes },
];

apiRoutes.forEach(route => router.use(route.path, route.route));

export default router;
