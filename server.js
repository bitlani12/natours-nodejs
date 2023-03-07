const dotenv = require('dotenv');
const app = require('./app');
const { default: mongoose } = require('mongoose');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    autoIndex: true
    // useCreateIndex: true
    // useFindAndModify: false
  })
  .then(con => {
    console.log(con.connections);
    console.log('DB connection sussfess ful');
  });

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

process.on('unhandledRejection', err => {
  console.log(err.name, err.message);
  console.log('Unhandled rejection. so shutting down');

  server.close(() => {
    process.exit(1);
  });
});

process.on('uncaughtException', err => {
  console.log('Uncaught exception! shutting down ');
  server.close;
});
// test
