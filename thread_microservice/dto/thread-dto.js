class ThreadDTO {
    constructor(parent_id = null, subcat_id, title, message, username) {
        this.parent_id = parent_id;
        this.subcat_id = subcat_id;
        this.title = title;
        this.message = message;
        this.username = username;
        this.created_at = new Date().toISOString();
    }
  }

module.exports = ThreadDTO;