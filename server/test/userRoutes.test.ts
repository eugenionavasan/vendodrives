import { describe, it, expect, vi, afterEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import userRoutes from '../routes/userRoutes';

// Mocking the controller functions
const mockRegisterUser = vi.fn();
const mockLoginUser = vi.fn();
const mockUpdateUserCars = vi.fn();
const mockGetUserCars = vi.fn();

vi.mock('../controllers/userController', () => ({
  registerUser: (req: any, res: any) => mockRegisterUser(req, res),
  loginUser: (req: any, res: any) => mockLoginUser(req, res),
  updateUserCars: (req: any, res: any) => mockUpdateUserCars(req, res),
  getUserCars: (req: any, res: any) => mockGetUserCars(req, res),
}));

// Create an Express app instance
const app = express();
app.use(express.json());
app.use('/users', userRoutes);

describe('User Routes', () => {
  afterEach(() => {
    vi.clearAllMocks(); // Clear mock calls between tests
  });

  it('should call registerUser on POST /users/register', async () => {
    mockRegisterUser.mockImplementation((req, res) => res.status(201).json({ message: 'User registered successfully' }));

    const response = await request(app)
      .post('/users/register')
      .send({ name: 'Test User', email: 'test@example.com', password: 'password123' });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({ message: 'User registered successfully' });
    expect(mockRegisterUser).toHaveBeenCalled();
  });

  it('should call loginUser on POST /users/login', async () => {
    mockLoginUser.mockImplementation((req, res) => res.status(200).json({ message: 'Login successful', token: 'fake-jwt-token' }));

    const response = await request(app)
      .post('/users/login')
      .send({ email: 'test@example.com', password: 'password123' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Login successful', token: 'fake-jwt-token' });
    expect(mockLoginUser).toHaveBeenCalled();
  });

  it('should call updateUserCars on PUT /users/update-cars', async () => {
    mockUpdateUserCars.mockImplementation((req, res) => res.status(200).json({ message: 'User cars updated successfully' }));

    const response = await request(app)
      .put('/users/update-cars')
      .send({ userId: 'userId', carId: 'carId' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'User cars updated successfully' });
    expect(mockUpdateUserCars).toHaveBeenCalled();
  });

  it('should call getUserCars on GET /users/:userId/cars', async () => {
    const mockCars = [{ _id: 'carId1', title: 'Car 1', price: 10000 }];
    mockGetUserCars.mockImplementation((req, res) => res.status(200).json(mockCars));

    const response = await request(app).get('/users/userId/cars');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockCars);
    expect(mockGetUserCars).toHaveBeenCalledWith(expect.objectContaining({ params: { userId: 'userId' } }), expect.anything());
  });
});