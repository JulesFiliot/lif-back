class UserDto {
    constructor(username, email, user_achievements, bio) {
      this.username = username;
      this.email = email;
      this.user_achievements = user_achievements;
      this.bio = bio;
    }
  }
  
  module.exports = UserDto;