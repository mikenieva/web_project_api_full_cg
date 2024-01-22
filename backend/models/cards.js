const mongoose = require('mongoose');

const { ObjectId } = require('mongoose').Schema.Types;

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return /^(https?:\/\/)(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/.test(
          v
        );
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
  },

  owner: {
    type: ObjectId,
    required: true,
  },

  likes: {
    type: [ObjectId],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const card = mongoose.model('card', cardSchema);
module.exports = card;
