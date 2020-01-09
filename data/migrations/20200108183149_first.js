
exports.up = async function(knex) {
    // create tables: zoo, species and animals
  await knex.schema.createTable("zoos", (table) => {
    table.increments("id")
    table.string("name").notNullable()
    table.string("address").notNullable()
  })

    await knex.schema.createTable("species", (table) => {
        table.increments("id")
        table.string("name").notNullable()
    })

    await knex.schema.createTable("animals", (table) => {
        table.increments("id")
        table.string("name").notNullable()
        table.integer("species_id") // foreign key made in knex
        .notNullable() 
        .references("id")
        .inTable("species")
        .onDelete("CASCADE") // when species gets deleted, so does animal. OnDelete tells sqlite what to do if this species no longer exists. If link is broken.
        .onUpdate("CASCADE")
    })
// create JOIN table Zoos_Animals table

    await knex.schema.createTable("zoos_animals", (table) => {
        table.integer("zoo_id")
            .notNullable()
            .references("id")
            .inTable("zoos")
            .onDelete("CASCADE")
            .onUpdate("CASCADE")

        table.integer("animal_id")
            .notNullable()
            .references("id")
            .inTable("animals")
            .onDelete("CASCADE")
            .onUpdate("CASCADE")
            // dates of when the animal was at a particular zoo
        table.date("from")
        table.date("to")
        // create a primary key as a combination of columns
        table.primary(["zoo_id", "animal_id"])
    })
};

exports.down = async function(knex) {
    await knex.schema.dropTableIfExists("zoos_animals")
    await knex.schema.dropTableIfExists("animals")
    await knex.schema.dropTableIfExists("species")
    await knex.schema.dropTableIfExists("zoos")
};

// create species before you create animals in seeds.