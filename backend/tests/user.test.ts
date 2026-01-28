import request from 'supertest';
import express from 'express';
import { UserController } from '../src/users/users.controller';
import { UserService } from '../src/users/user.service';

describe('Register User API Endpoint', () => {
  let app: express.Application;
  let mockUserService: jest.Mocked<UserService>;

  beforeEach(() => {
    app = express();
    app.use(express.json());

    // Create mock service
    mockUserService = {
      register: jest.fn(),
    } as any;

    // Create controller with mocked service
    const userController = UserController;
    userController['service'] = mockUserService;

    // Setup route
    app.post('/api/register', (req, res, next) =>
      userController.registerUser(req, res, next),
    );
  });

  it('should return 201 with token on successful registration', async () => {
    // Arrange
    const mockToken = 'test-jwt-token';
    mockUserService.register.mockResolvedValue(mockToken);

    const userData = {
      username: 'testuser',
      password: 'password123',
      email: 'test@example.com',
    };

    // Act
    const response = await request(app)
      .post('/api/register')
      .send(userData)
      .expect('Content-Type', /json/)
      .expect(201);

    // Assert
    expect(response.body).toEqual({
      StatusCode: 201,
      message: expect.any(String),
      token: mockToken,
    });

    expect(mockUserService.register).toHaveBeenCalledWith(userData);
  });

  it('should return error when service throws', async () => {
    // Arrange
    const error = {
      name: 'BadRequest',
      message: 'User already exists',
      statusCode: 400,
    };
    mockUserService.register.mockRejectedValue(error);

    // Act
    const response = await request(app)
      .post('/api/register')
      .send({ username: 'existinguser', password: 'password' })
      .expect(400);

    // Assert
    expect(response.body).toEqual({
      message: 'User already exists',
    });
  });
});
