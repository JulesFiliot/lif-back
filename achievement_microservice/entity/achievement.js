class Achievement {
    //not used yet
    constructor(id, name, rank, popularity = null, date = null, location=null, image = null) {
        this.id = id;
        this.name = name;
        this.rank = rank;
        this.popularity = popularity;
        this.date = date;
        this.location = location;
        this.image = image;
    }
  }
  
  module.exports = Achievement;