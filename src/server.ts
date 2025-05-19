import express from 'express';
import sequelize from './config/db';

const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

sequelize
  .sync()
  .then(() => {
    console.log('Database synced');
  })
  .catch((error) => {
    console.error('Error syncing database:', error);
  });

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
