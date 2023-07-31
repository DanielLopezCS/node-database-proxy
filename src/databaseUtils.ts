import fs from 'fs';
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('mydatabase.db');

interface Field {
  name: string;
  type: string;
  primary?: boolean; // Specify if the field is a primary key
  unique?: boolean; // Specify if the field is unique
}

export const buildDatabaseSchema = (): void => {
  fs.readdirSync('./schemas').forEach((file: string) => {
    const schema: Field[] = JSON.parse(fs.readFileSync(`./schemas/${file}`, 'utf-8'));
    const collectionName = file.split('.')[0];

    // Check if the table exists in the database
    const tableExistsQuery = `SELECT name FROM sqlite_master WHERE type='table' AND name='${collectionName}';`;
    db.get(tableExistsQuery, (err: Error, row: any) => {
      if (!row) {
        // Table doesn't exist, create it
        const createTableQuery = `CREATE TABLE ${collectionName} (${schema
          .map((field) => `${field.name} ${field.type}${field.primary ? ' PRIMARY KEY' : ''}${field.unique ? ' UNIQUE' : ''}`)
          .join(', ')});`;
        db.run(createTableQuery, (err: Error) => {
          if (err) {
            console.error(`Error creating table ${collectionName}: ${err.message}`);
          } else {
            console.log(`Table ${collectionName} created successfully.`);
          }
        });
      } else {
        // Table exists, get existing column names
        const existingColumnsQuery = `PRAGMA table_info(${collectionName});`;
        db.all(existingColumnsQuery, (err: Error, rows: any[]) => {
          if (err) {
            console.error(`Error getting existing columns from table ${collectionName}: ${err.message}`);
            return;
          }

          const existingColumnNames = rows.map((row) => row.name.toLowerCase());

          // Check and add missing columns from the schema
          schema.forEach((field) => {
            const columnName = field.name.toLowerCase();
            if (!existingColumnNames.includes(columnName)) {
              // Column doesn't exist, add it to the table
              const addColumnQuery = `ALTER TABLE ${collectionName} ADD COLUMN ${columnName} ${field.type}${field.primary ? ' PRIMARY KEY' : ''}${field.unique ? ' UNIQUE' : ''};`;
              db.run(addColumnQuery, (err: Error) => {
                if (err) {
                  console.error(`Error adding column ${columnName} to table ${collectionName}: ${err.message}`);
                } else {
                  console.log(`Column ${columnName} added to table ${collectionName} successfully.`);
                }
              });
            }
          });
        });
      }
    });
  });
};

module.exports = { buildDatabaseSchema };
