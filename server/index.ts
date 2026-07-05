import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*', // For development
  }
});

const prisma = new PrismaClient({});
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_change_in_production';

app.use(cors());
app.use(express.json());

// Auth Route
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  
  try {
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
      return res.status(401).json({ error: 'Username atau password salah' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Username atau password salah' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ token, user: { username: user.username, role: user.role, name: user.name } });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Category Route
app.get('/api/categories', async (_req, res) => {
  try {
    const categories = await prisma.category.findMany();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Call Queue Route (Protected)
app.post('/api/queue/call', async (req, res) => {
  const { categoryId, counter } = req.body;
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    jwt.verify(token, JWT_SECRET);

    // Get latest queue for this category
    const lastQueue = await prisma.queue.findFirst({
      where: { categoryId: Number(categoryId) },
      orderBy: { createdAt: 'desc' }
    });

    const nextNumber = lastQueue ? lastQueue.number + 1 : 1;

    // Create new queue
    const newQueue = await prisma.queue.create({
      data: {
        number: nextNumber,
        status: 'CALLED',
        categoryId: Number(categoryId)
      },
      include: {
        category: true
      }
    });

    // Broadcast to TV
    io.emit('queue-called', {
      queue: newQueue,
      counter: counter || '01'
    });

    res.json(newQueue);
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: 'Invalid token or server error' });
  }
});

// Recall Route
app.post('/api/queue/recall', async (req, res) => {
  const { queueId, counter } = req.body;
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    jwt.verify(token, JWT_SECRET);

    const queue = await prisma.queue.findUnique({
      where: { id: Number(queueId) },
      include: { category: true }
    });

    if (queue) {
      io.emit('queue-called', {
        queue: queue,
        counter: counter || '01',
        isRecall: true
      });
      res.json(queue);
    } else {
      res.status(404).json({ error: 'Queue not found' });
    }
  } catch (error) {
    res.status(401).json({ error: 'Invalid token or server error' });
  }
});

// Adjust Route (Dynamic edit, increment, decrement)
app.post('/api/queue/adjust', async (req, res) => {
  const { categoryId, action, value, counter } = req.body;
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    jwt.verify(token, JWT_SECRET);

    const lastQueue = await prisma.queue.findFirst({
      where: { categoryId: Number(categoryId) },
      orderBy: { createdAt: 'desc' }
    });

    let newNumber = lastQueue ? lastQueue.number : 0;

    if (action === 'INCREMENT') {
      newNumber += 1;
    } else if (action === 'DECREMENT') {
      newNumber = Math.max(0, newNumber - 1);
    } else if (action === 'SET') {
      newNumber = Math.max(0, Number(value) || 0);
    }

    const newQueue = await prisma.queue.create({
      data: {
        number: newNumber,
        status: 'CALLED',
        categoryId: Number(categoryId)
      },
      include: {
        category: true
      }
    });

    io.emit('queue-called', {
      queue: newQueue,
      counter: counter || '01'
    });

    res.json(newQueue);
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: 'Invalid token or server error' });
  }
});

// Current active queues per category (for TV Display)
app.get('/api/queue/active', async (_req, res) => {
  try {
    const categories = await prisma.category.findMany();
    const activeQueues = await Promise.all(
      categories.map(async (cat) => {
        const queue = await prisma.queue.findFirst({
          where: { categoryId: cat.id },
          orderBy: { createdAt: 'desc' }
        });
        return {
          category: cat,
          queue: queue
        };
      })
    );
    res.json(activeQueues);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check for Coolify
app.get('/api/health', (_req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve frontend static files
app.use(express.static(path.join(__dirname, '../dist')));

// Fallback for Vue Router (SPA)
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// Realtime connection handler
io.on('connection', (socket) => {
  console.log('A client connected');
  
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
