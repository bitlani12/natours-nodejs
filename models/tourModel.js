const { default: mongoose } = require('mongoose');
const { default: slugify } = require('slugify');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxlength: [40, 'A tour name must have less or equal then 40 characters'],
      minlength: [10, 'A tour name must have more or equal then 10 characters']
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration']
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size']
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty']
      // enum: {
      //   value: ['easy', 'medium', 'hard'],
      //   message: 'Difficulty is either: easy, medium, hard'
      // }
    },
    ratingAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Ratings must be above 1.0'],
      max: [5, 'Ratings must be below 5.0']
    },
    ratingsQuantity: {
      type: Number,
      default: 0
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price']
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function(value) {
          return value > this.price; // 100 > 200
        },
        message: 'discount ({value}) price should be below regular price'
      }
      // },
      // validate:
    },
    priceDiscount: {
      summery: {
        type: String,
        trim: true
      }
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image']
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now()
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

tourSchema.virtual('durationWeeks').get(function() {
  return this.duration / 7;
});

// document middleware: runs before .save() and .create()
tourSchema.pre('save', function(next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

tourSchema.post('save', function(doc, next) {
  next();
});

// query middleware
tourSchema.pre(/^find/, function(next) {
  console.log('this is pipeline 222');
  this.find({ secretTour: { $ne: true } });
  next();
});

tourSchema.pre('aggregate', function(next) {
  console.log('this is pipeline');
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });

  console.log(this.pipeline(), 'this is pipeline');
  next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
