import { DatabaseSync } from 'node:sqlite'; 
const db = new DatabaseSync('./data/world-ideology-atlas.db'); 
db.exec('BEGIN IMMEDIATE TRANSACTION'); 
const rows = db.prepare("SELECT iso3, profile_json FROM country_profiles WHERE iso3 IN ('HKG', 'MAC')").all(); 
const update = db.prepare('UPDATE country_profiles SET profile_json = ? WHERE iso3 = ?'); 
for (const row of rows) { 
  const p = JSON.parse(row.profile_json); 
  p.headOfStateTitle = 'President'; 
  p.headOfState = 'Xi Jinping'; 
  p.stateForm = 'Special Administrative Region of China'; 
  update.run(JSON.stringify(p), row.iso3); 
} 
db.exec('COMMIT'); 
db.close();
console.log('Fixed HKG and MAC');
