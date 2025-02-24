/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-undef */
import colors from 'colors';
import mongoose from 'mongoose';
import { Server } from 'socket.io';
import app from './app';
import config from './config';
import { socketHelper } from './helpers/socketHelper';
import { errorLogger, logger } from './shared/logger';
import seedAdmin from './DB';
import { Notification } from './app/modules/notifications/notifications.model';
import cron from 'node-cron';

//uncaught exception
process.on('uncaughtException', error => {
  errorLogger.error('UnhandleException Detected', error);
  process.exit(1);
});

let server: any;
async function main() {
  try {
    await mongoose.connect(config.database_url as string);
    logger.info(colors.green('🚀 Database connected successfully'));

    const port =
      typeof config.port === 'number' ? config.port : Number(config.port);

    server = app.listen(port, config.ip_address as string, () => {
      logger.info(
        colors.yellow(`♻️  Application listening on port:${config.port}`),
      );
    });

    await seedAdmin();

    //! delete all notification after 7 days. it's continues process

    // Schedule the cron job to run every day at midnight
    cron.schedule('0 0 * * *', async () => {
      try {
        // Calculate the date 7 days ago
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        // Delete notifications older than 7 days
        const result = await Notification.deleteMany({
          createdAt: { $lt: sevenDaysAgo },
        });

        console.log(`Deleted ${result.deletedCount} notifications`);
      } catch (error) {
        console.error('Error deleting notifications:', error);
      }
    });

    //socket
    const io = new Server(server, {
      pingTimeout: 60000,
      cors: {
        origin: '*',
      },
    });
    socketHelper.socket(io);
    //@ts-ignore
    global.io = io;
  } catch (error) {
    errorLogger.error(colors.red('🤢 Failed to connect Database'));
  }

  //handle unhandleRejection
  process.on('unhandledRejection', error => {
    if (server) {
      server.close(() => {
        errorLogger.error('UnhandleRejection Detected', error);
        process.exit(1);
      });
    } else {
      process.exit(1);
    }
  });
}

main();

//SIGTERM
process.on('SIGTERM', () => {
  logger.info('SIGTERM IS RECEIVE');
  if (server) {
    server.close();
  }
});
