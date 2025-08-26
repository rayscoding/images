const fs = require('fs');
const http = require('http');
const url = require('url');

const DATA_FILE = './users.json';

// Helper function: Read users from file
function readUsers() {
  const data = fs.readFileSync(DATA_FILE, 'utf-8');
  return JSON.parse(data);
}

// Helper function: Write users to file
function writeUsers(users) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2));
}

// Generate a new unique ID
function generateId(users) {
  return users.length ? Math.max(...users.map(u => u.id)) + 1 : 1;
}

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const method = req.method;
  const pathname = parsedUrl.pathname;

  // Set response header for JSON
  res.setHeader('Content-Type', 'application/json');

  if (pathname === '/users') {
    if (method === 'GET') {
      // Read all users
      const users = readUsers();
      res.writeHead(200);
      res.end(JSON.stringify(users));
    } else if (method === 'POST') {
      // Create new user
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
      });
      req.on('end', () => {
        try {
          const newUser = JSON.parse(body);
          if (!newUser.name || !newUser.email) {
            res.writeHead(400);
            return res.end(JSON.stringify({ error: 'Name and Email are required' }));
          }

          const users = readUsers();
          newUser.id = generateId(users);
          users.push(newUser);
          writeUsers(users);

          res.writeHead(201);
          res.end(JSON.stringify(newUser));
        } catch (err) {
          res.writeHead(400);
          res.end(JSON.stringify({ error: 'Invalid JSON' }));
        }
      });
    } else if (method === 'PUT') {
      // Update user - id should be in query like /users?id=1
      const id = parseInt(parsedUrl.query.id);
      if (!id) {
        res.writeHead(400);
        return res.end(JSON.stringify({ error: 'User ID is required in query' }));
      }

      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
      });

      req.on('end', () => {
        try {
          const updateData = JSON.parse(body);
          const users = readUsers();
          const userIndex = users.findIndex(u => u.id === id);

          if (userIndex === -1) {
            res.writeHead(404);
            return res.end(JSON.stringify({ error: 'User not found' }));
          }

          // Update user details
          users[userIndex] = { ...users[userIndex], ...updateData, id };
          writeUsers(users);

          res.writeHead(200);
          res.end(JSON.stringify(users[userIndex]));
        } catch (err) {
          res.writeHead(400);
          res.end(JSON.stringify({ error: 'Invalid JSON' }));
        }
      });
    } else if (method === 'DELETE') {
      // Delete user - id should be in query like /users?id=1
      const id = parseInt(parsedUrl.query.id);
      if (!id) {
        res.writeHead(400);
        return res.end(JSON.stringify({ error: 'User ID is required in query' }));
      }

      const users = readUsers();
      const userIndex = users.findIndex(u => u.id === id);

      if (userIndex === -1) {
        res.writeHead(404);
        return res.end(JSON.stringify({ error: 'User not found' }));
      }

      users.splice(userIndex, 1);
      writeUsers(users);

      res.writeHead(200);
      res.end(JSON.stringify({ message: 'User deleted successfully' }));
    } else {
      res.writeHead(405);
      res.end(JSON.stringify({ error: 'Method not allowed' }));
    }
  } else {
    // Invalid route
    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Route not found' }));
  }
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
