class AchievementDTO {
    constructor(name, desc, rank, popularity = null) {
        this.name = name;
        this.desc = desc;
        this.rank = rank;
        this.popularity = popularity;
        this.date = date;
        this.location = location;
        this.image = image;
    }
  }
  
  module.exports = AchievementDTO;