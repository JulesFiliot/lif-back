class ThreadDTO {
    constructor(parent_id = null, subcategory_id, message) {
        this.parent_id = parent_id;
        this.subcategory_id = subcategory_id;
        this.message = message;
    }
  }

module.exports = ThreadDTO;