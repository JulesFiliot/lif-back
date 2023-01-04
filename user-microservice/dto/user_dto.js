class UserDto {
    constructor(username, email, user_achievments, bio) {
      this.username = username;
      this.email = email;
      this.user_achievements = user_achievments;
      this.bio = bio;
    }
  }
  
  module.exports = UserDto;