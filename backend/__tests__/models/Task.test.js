const mongoose = require('mongoose');
const Task = require('../../models/Task');

// Test database
const MONGODB_URI = process.env.MONGODB_URI_TEST || 'mongodb://localhost:27017/taskflow_test';

describe('Task Model', () => {
  beforeAll(async () => {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  beforeEach(async () => {
    await Task.deleteMany({});
  });

  afterAll(async () => {
    await Task.deleteMany({});
    await mongoose.connection.close();
  });

  describe('Task Creation', () => {
    test('should create a valid task', async () => {
      const taskData = {
        title: 'Test Task',
        description: 'This is a test task'
      };

      const task = new Task(taskData);
      const savedTask = await task.save();

      expect(savedTask._id).toBeDefined();
      expect(savedTask.title).toBe(taskData.title);
      expect(savedTask.description).toBe(taskData.description);
      expect(savedTask.status).toBe('Pending');
      expect(savedTask.createdAt).toBeDefined();
      expect(savedTask.updatedAt).toBeDefined();
    });

    test('should create task without description', async () => {
      const taskData = {
        title: 'Test Task'
      };

      const task = new Task(taskData);
      const savedTask = await task.save();

      expect(savedTask.title).toBe(taskData.title);
      expect(savedTask.description).toBe('');
      expect(savedTask.status).toBe('Pending');
    });

    test('should fail to create task without title', async () => {
      const taskData = {
        description: 'Description without title'
      };

      const task = new Task(taskData);
      
      await expect(task.save()).rejects.toThrow();
    });

    test('should fail to create task with empty title', async () => {
      const taskData = {
        title: '',
        description: 'Description'
      };

      const task = new Task(taskData);
      
      await expect(task.save()).rejects.toThrow();
    });

    test('should trim whitespace from title', async () => {
      const taskData = {
        title: '  Test Task  ',
        description: '  Test Description  '
      };

      const task = new Task(taskData);
      const savedTask = await task.save();

      expect(savedTask.title).toBe('Test Task');
      expect(savedTask.description).toBe('Test Description');
    });
  });

  describe('Task Validation', () => {
    test('should fail with title longer than 100 characters', async () => {
      const taskData = {
        title: 'a'.repeat(101),
        description: 'Valid description'
      };

      const task = new Task(taskData);
      
      await expect(task.save()).rejects.toThrow();
    });

    test('should fail with description longer than 500 characters', async () => {
      const taskData = {
        title: 'Valid title',
        description: 'a'.repeat(501)
      };

      const task = new Task(taskData);
      
      await expect(task.save()).rejects.toThrow();
    });

    test('should fail with invalid status', async () => {
      const taskData = {
        title: 'Valid title',
        description: 'Valid description',
        status: 'Invalid Status'
      };

      const task = new Task(taskData);
      
      await expect(task.save()).rejects.toThrow();
    });

    test('should accept valid status values', async () => {
      const taskData1 = {
        title: 'Test Task 1',
        status: 'Pending'
      };

      const taskData2 = {
        title: 'Test Task 2',
        status: 'Completed'
      };

      const task1 = new Task(taskData1);
      const task2 = new Task(taskData2);

      const savedTask1 = await task1.save();
      const savedTask2 = await task2.save();

      expect(savedTask1.status).toBe('Pending');
      expect(savedTask2.status).toBe('Completed');
    });
  });

  describe('Task Updates', () => {
    test('should update task status', async () => {
      const task = new Task({
        title: 'Test Task',
        description: 'Test Description'
      });

      const savedTask = await task.save();
      expect(savedTask.status).toBe('Pending');

      savedTask.status = 'Completed';
      const updatedTask = await savedTask.save();

      expect(updatedTask.status).toBe('Completed');
      expect(updatedTask.updatedAt.getTime()).toBeGreaterThan(updatedTask.createdAt.getTime());
    });

    test('should update task title and description', async () => {
      const task = new Task({
        title: 'Original Title',
        description: 'Original Description'
      });

      const savedTask = await task.save();
      
      savedTask.title = 'Updated Title';
      savedTask.description = 'Updated Description';
      const updatedTask = await savedTask.save();

      expect(updatedTask.title).toBe('Updated Title');
      expect(updatedTask.description).toBe('Updated Description');
    });
  });

  describe('Task Queries', () => {
    beforeEach(async () => {
      await Task.create([
        {
          title: 'Task 1',
          description: 'Description 1',
          status: 'Pending'
        },
        {
          title: 'Task 2',
          description: 'Description 2',
          status: 'Completed'
        },
        {
          title: 'Task 3',
          description: 'Description 3',
          status: 'Pending'
        }
      ]);
    });

    test('should find all tasks', async () => {
      const tasks = await Task.find();
      expect(tasks).toHaveLength(3);
    });

    test('should find tasks by status', async () => {
      const pendingTasks = await Task.find({ status: 'Pending' });
      const completedTasks = await Task.find({ status: 'Completed' });

      expect(pendingTasks).toHaveLength(2);
      expect(completedTasks).toHaveLength(1);
    });

    test('should sort tasks by creation date', async () => {
      const tasks = await Task.find().sort({ createdAt: -1 });
      
      expect(tasks[0].title).toBe('Task 3');
      expect(tasks[1].title).toBe('Task 2');
      expect(tasks[2].title).toBe('Task 1');
    });
  });
});
