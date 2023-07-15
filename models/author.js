const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const Schema = mongoose.Schema;

const AuthorSchema = new Schema({
    first_name: { type: String, required: true, maxLength: 100 },
    family_name: { type: String, required: true, maxLength: 100 },
    date_of_birth: { type: Date },
    date_of_death: { type: Date },
});

//Virtual for author's full name
AuthorSchema.virtual("name").get(function () {
    //To avoid errors in cases where an author does not have either a family name or a first name
    // We want to make sure we handle the exception by returning an empty string for that case
    let fullname = "";
    if (this.first_name && this.family_name) {
        fullname = `${this.family_name}, ${this.first_name}`;
    }

    return fullname;
});

//Virtual for author's URL
AuthorSchema.virtual("url").get(function () {
    //We don't use an arrow function as we'll need the this object
    return `/catalog/author/${this._id}`;
});

// Virtual to format DOB
AuthorSchema.virtual("date_of_birth_formatted").get(function () {
    // Ignoring missing date cases
    return this.date_of_birth
        ? DateTime.fromJSDate(this.date_of_birth).toLocaleString(
              DateTime.DATE_MED
          )
        : "";
});

// Virtual to format DOB in YYYY-MM-DD format
AuthorSchema.virtual("date_of_birth_yyyy_mm_dd").get(function () {
    return DateTime.fromJSDate(this.date_of_birth).toISODate();
})

// Virtual to format DOD
AuthorSchema.virtual("date_of_death_formatted").get(function () {
    // Ignoring missing date cases
    return this.date_of_death
        ? DateTime.fromJSDate(this.date_of_death).toLocaleString(
              DateTime.DATE_MED
          )
        : "";
});

// Virtual to format DOD in YYYY-MM-DD format
AuthorSchema.virtual("date_of_death_yyyy_mm_dd").get(function () {
    return DateTime.fromJSDate(this.date_of_death).toISODate();
})

// Virtual for lifespan
AuthorSchema.virtual("lifespan").get(function () {
    let dob_formatted = this.date_of_birth
        ? DateTime.fromJSDate(this.date_of_birth).toLocaleString(
              DateTime.DATE_MED
          )
        : "";
    let dod_formatted = this.date_of_death
        ? DateTime.fromJSDate(this.date_of_death).toLocaleString(
              DateTime.DATE_MED
          )
        : "";

    return dob_formatted + " - " + dod_formatted;
});

// Export model
module.exports = mongoose.model("Author", AuthorSchema);
