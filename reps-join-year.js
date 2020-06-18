// This script calculates how many mentors have joined the Reps program in which year
// This requires the reps-archive repo to be cloned: https://github.com/mozilla/reps-archive/
// Once the Reps Portal is decommisioned, this won't work anymore, and we possibly won't
// have any other data source to fetch from.

const path = require('path');

const PATH_TO_REPS_FILE = path.resolve(__dirname, process.env.FILE_PATH);

if (!PATH_TO_REPS_FILE) {
  console.error('FILE_PATH needs to be set and pointing to the location of the data/REPS.json file of the reps-archive');
  process.exit(1);
}

let reps = [];

try {
  reps = require(PATH_TO_REPS_FILE);
} catch (error) {
  console.error('Could not read or parse Reps file', PATH_TO_REPS_FILE, error.message);
  process.exit(1);
}

console.log(`${reps.length} Reps in total`);

const mentors = reps.filter((rep) => rep.groups.some((groupInfo) => groupInfo.name === 'Mentor'));
console.log(`${mentors.length} Mentors in total`);

const countedByJoinYear = mentors.reduce((yearStats, mentor) => {
  const joinDate = new Date(mentor.date_joined_program);
  const joinYear = joinDate.getFullYear();

  if (typeof yearStats[joinYear] === 'undefined') {
    yearStats[joinYear] = 0;
  }

  yearStats[joinYear] += 1;

  return yearStats;
}, {});

console.table(countedByJoinYear);
