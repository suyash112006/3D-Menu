const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a restaurant name'],
    trim: true,
    maxlength: [50, 'Name can not be more than 50 characters']
  },
  subtitle: {
    type: String,
    trim: true,
    maxlength: [100, 'Subtitle can not be more than 100 characters']
  },
  slug: {
    type: String,
    unique: true,
    required: true,
    index: true
  },
  logo: {
    type: String,
    default: 'no-photo.jpg'
  },
  logoKey: {
    type: String,
    default: null
  },
  description: {
    type: String,
    maxlength: [500, 'Description can not be more than 500 characters']
  },
  phone: {
    type: String,
    maxlength: [20, 'Phone number can not be longer than 20 characters']
  },
  address: {
    type: String
  },
  hours: {
    type: Map,
    of: String,
    default: {
      monday: '9:00 AM - 10:00 PM',
      tuesday: '9:00 AM - 10:00 PM',
      wednesday: '9:00 AM - 10:00 PM',
      thursday: '9:00 AM - 10:00 PM',
      friday: '9:00 AM - 11:00 PM',
      saturday: '10:00 AM - 11:00 PM',
      sunday: '10:00 AM - 9:00 PM'
    }
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Restaurant', restaurantSchema);
