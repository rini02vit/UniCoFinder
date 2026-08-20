const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/i;

const testCases = [
  'https://www.harvard.edu',
  'https://www.ox.ac.uk',
  'https://www.ubc.ca',
  'https://www.unimelb.edu.au',
  'https://www.dfat.gov.au/people-to-people/australia-awards/australia-awards-scholarships',
  'http://invalid url',
];

for (const t of testCases) {
  console.log(`Testing: ${t}`);
  console.log(`Result: ${urlRegex.test(t)}`);
  console.log('---');
}
