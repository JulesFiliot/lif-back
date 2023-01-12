class ThreadDTO {
    constructor(parent_id = null, subcat_id, message) {
        this.parent_id = parent_id;
        this.subcat_id = subcat_id;
        this.message = message;
        this.created_at = new Date().toISOString();
    }
  }

module.exports = ThreadDTO;