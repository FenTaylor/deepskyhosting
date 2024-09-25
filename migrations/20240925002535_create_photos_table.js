/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable('photos', function (table) {
        table.increments('id').primary();
        table.integer('user_id').references('id').inTable('users');
        table.string('unique_url', 10).unique().notNullable();
        table.string('file_name', 255).unique().notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.string('scale', 50).notNullable();
        table.integer('size_kb').notNullable();
        table.integer('views').defaultTo(0);
        table.string('name', 255);
        table.text('description');
        table.boolean('active').defaultTo(false);
        table.text('link');
        table.date('photo_date');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable('photos');
};
