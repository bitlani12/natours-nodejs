const fs = require('fs');
const dotenv = require('dotenv');
const { default: mongoose } = require('mongoose');

const Tour = require(`./../../models/tourModel`);
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
    // console.log(con.connections);
    console.log('DB connection sussfess ful');
  });

// read json fule
const tours = fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8');

// import data into db
const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('data successfully loaded!');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

// delete all data from db
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('data successfully delte');
    process.exit();
  } catch {
    console.log(err);
  }
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
console.log(process.argv);
