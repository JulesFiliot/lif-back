class AchievementDTO {
    constructor(name, desc, rank, subcat_id) {
        this.name = name;
        this.desc = desc;
        this.rank = rank;
        this.subcat_id = subcat_id;
        this.popularity = 0;
        this.official = false;
    }
  }

module.exports = AchievementDTO;