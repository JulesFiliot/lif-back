class SubcategoryDTO {
    constructor(name, parent_cat_id) {
        this.name = name;
        this.parent_cat_id = parent_cat_id;
        this.created_at = new Date().toISOString();
    }
  }
  
  module.exports = SubcategoryDTO;