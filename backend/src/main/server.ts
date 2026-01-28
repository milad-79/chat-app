import express, { Express, Request, Response, NextFunction } from 'express';
import { NotFound, InternalServerError } from 'http-errors';
import config from '../configs/app.config';
import morgan from 'morgan';
import path from 'path';
import AllRoutes from './main.route';
import cookiePareser from 'cookie-parser';
import YAML from 'yamljs';
import swaggerJsDoc from 'swagger-jsdoc';
import { createServer } from 'http';
import { serverMessages } from './messages/main.messages';
import { AppError } from './types/server.types';
import swaggerUi from 'swagger-ui-express';
import cors from 'cors';
import { socketHandler } from './socket.io';
import { initialSocket } from './utils/initSocket';

export const app: Express = express();

const swaggerOptions = {
  swaggerDefinition: YAML.load(
    path.join(__dirname, 'swagger', 'main.swagger.yaml'),
  ),
  apis: [path.join(__dirname, '..', '**/*.yaml')],
};

class Application {
  private app: Express;
  private port: number;
  constructor() {
    this.app = app;
    this.port = config.PORT;
    this.configApplicatio();
    this.createServer();

    this.createRoutes();
    this.ErrorHandler();
  }

  configApplicatio(): void {
    this.app.use(morgan('dev'));
    this.app.use(cors({ origin: '*' }));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookiePareser());
    this.app.use(
      '/uploads',
      express.static(path.join(__dirname, '..', '..', 'uploads')),
    );
    this.app.use(
      '/api/docs',
      swaggerUi.serve,
      (req: Request, res: Response, next: NextFunction) => {
        const specs = swaggerJsDoc(swaggerOptions);
        swaggerUi.setup(specs, { explorer: true })(req, res, next);
      },
    );
  }

  async createServer(): Promise<void> {
    const server = createServer(this.app);
    const io = initialSocket(server);

    socketHandler(io);

    server.listen(this.port, () => {
      const addressInfo = server.address();

      if (addressInfo && typeof addressInfo !== 'string') {
        const { address, port } = addressInfo;
        console.log(`Server running on: ${address}:${port}`);
      } else {
        console.log('Server started');
      }
    });
  }

  createRoutes(): void {
    this.app.use(AllRoutes);
  }

  ErrorHandler(): void {
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      next(NotFound(serverMessages.notFound));
    });
    this.app.use(
      (err: AppError, req: Request, res: Response, next: NextFunction) => {
        const serverError = InternalServerError();
        const statusCode = err.status || serverError.statusCode;
        const message = err.message || serverError.message;

        res.status(statusCode).json({
          status: statusCode,
          message,
        });
      },
    );
  }
}

export default Application;
