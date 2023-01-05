class UserAchievementDTO {
    constructor(user_id, achievement_id, date = null, location = null, image = null) {
        this.user_id = user_id;
        this.achievement_id = achievement_id;
        this.date = date;
        this.location = location;
        this.image = image;
    }
  }
  
  module.exports = UserAchievementDTO;