const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const Task = require('../models/Task');

// Test database
const MONGODB_URI = process.env.MONGODB_URI_TEST || 'mongodb://localhost:27017/taskflow_test';

describe('Task API', () => {
  beforeAll(async () => {
    // Connect to test database
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  beforeEach(async () => {
    // Clear the database before each test
    await Task.deleteMany({});
  });

  afterAll(async () => {
    // Clean up and close connection
    await Task.deleteMany({});
    await mongoose.connection.close();
  });

  describe('GET /api/tasks', () => {
    test('should return empty array when no tasks exist', async () => {
      const response = await request(app)
        .get('/api/tasks')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual([]);
      expect(response.body.count).toBe(0);
    });

    test('should return all tasks', async () => {
      // Create test tasks
      const task1 = await Task.create({
        title: 'Test Task 1',
        description: 'Description 1'
      });
      const task2 = await Task.create({
        title: 'Test Task 2',
        description: 'Description 2',
        status: 'Completed'
      });

      const response = await request(app)
        .get('/api/tasks')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(2);
      expect(response.body.data).toHaveLength(2);
      
      // Check if tasks are sorted by createdAt (newest first)
      expect(new Date(response.body.data[0].createdAt))
        .toBeInstanceOf(Date);
    });
  });

  describe('POST /api/tasks', () => {
    test('should create a new task with valid data', async () => {
      const taskData = {
        title: 'New Test Task',
        description: 'This is a test task'
      };

      const response = await request(app)
        .post('/api/tasks')
        .send(taskData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Task created successfully');
      expect(response.body.data.title).toBe(taskData.title);
      expect(response.body.data.description).toBe(taskData.description);
      expect(response.body.data.status).toBe('Pending');
      expect(response.body.data._id).toBeDefined();
    });

    test('should create task without description', async () => {
      const taskData = {
        title: 'Task without description'
      };

      const response = await request(app)
        .post('/api/tasks')
        .send(taskData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe(taskData.title);
      expect(response.body.data.description).toBe('');
    });

    test('should fail to create task without title', async () => {
      const taskData = {
        description: 'Description without title'
      };

      const response = await request(app)
        .post('/api/tasks')
        .send(taskData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Validation failed');
      expect(response.body.errors).toBeDefined();
    });

    test('should fail to create task with empty title', async () => {
      const taskData = {
        title: '',
        description: 'Description'
      };

      const response = await request(app)
        .post('/api/tasks')
        .send(taskData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    test('should fail to create task with title too long', async () => {
      const taskData = {
        title: 'a'.repeat(101), // 101 characters
        description: 'Description'
      };

      const response = await request(app)
        .post('/api/tasks')
        .send(taskData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    test('should fail to create task with description too long', async () => {
      const taskData = {
        title: 'Valid title',
        description: 'a'.repeat(501) // 501 characters
      };

      const response = await request(app)
        .post('/api/tasks')
        .send(taskData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/tasks/:id', () => {
    let taskId;

    beforeEach(async () => {
      const task = await Task.create({
        title: 'Test Task',
        description: 'Test Description'
      });
      taskId = task._id.toString();
    });

    test('should update task status', async () => {
      const updateData = {
        status: 'Completed'
      };

      const response = await request(app)
        .put(`/api/tasks/${taskId}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Task updated successfully');
      expect(response.body.data.status).toBe('Completed');
    });

    test('should update task title and description', async () => {
      const updateData = {
        title: 'Updated Title',
        description: 'Updated Description'
      };

      const response = await request(app)
        .put(`/api/tasks/${taskId}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe('Updated Title');
      expect(response.body.data.description).toBe('Updated Description');
    });

    test('should fail to update with invalid status', async () => {
      const updateData = {
        status: 'Invalid Status'
      };

      const response = await request(app)
        .put(`/api/tasks/${taskId}`)
        .send(updateData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    test('should fail to update non-existent task', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const updateData = {
        status: 'Completed'
      };

      const response = await request(app)
        .put(`/api/tasks/${fakeId}`)
        .send(updateData)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Task not found');
    });

    test('should fail to update with invalid task ID', async () => {
      const updateData = {
        status: 'Completed'
      };

      const response = await request(app)
        .put('/api/tasks/invalid-id')
        .send(updateData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid task ID');
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    let taskId;

    beforeEach(async () => {
      const task = await Task.create({
        title: 'Test Task',
        description: 'Test Description'
      });
      taskId = task._id.toString();
    });

    test('should delete existing task', async () => {
      const response = await request(app)
        .delete(`/api/tasks/${taskId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Task deleted successfully');
      expect(response.body.data._id).toBe(taskId);

      // Verify task is deleted
      const deletedTask = await Task.findById(taskId);
      expect(deletedTask).toBeNull();
    });

    test('should fail to delete non-existent task', async () => {
      const fakeId = new mongoose.Types.ObjectId();

      const response = await request(app)
        .delete(`/api/tasks/${fakeId}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Task not found');
    });

    test('should fail to delete with invalid task ID', async () => {
      const response = await request(app)
        .delete('/api/tasks/invalid-id')
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid task ID');
    });
  });

  describe('GET /api/health', () => {
    test('should return health check', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('TaskFlow API is running');
      expect(response.body.timestamp).toBeDefined();
    });
  });

  describe('404 Routes', () => {
    test('should return 404 for non-existent routes', async () => {
      const response = await request(app)
        .get('/api/non-existent')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Route not found');
    });
  });
});
