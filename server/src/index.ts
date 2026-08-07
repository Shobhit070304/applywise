import app from './app';
import { config } from './config';
import connectDB from './config/db';

const startServer = async () => {
  await connectDB();

  app.listen(config.port, () => {
    console.log(`Server is running on http://localhost:${config.port} [${config.env}]`);
  });
};

startServer();
