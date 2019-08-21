const genderOptions = [
  { key: 'm', text: 'Male', value: 'male' },
  { key: 'f', text: 'Female', value: 'female' },
  { key: 'o', text: 'Other', value: 'other' },
];

const yearOptions = [];
const begYear = new Date().getFullYear() - 2;
for (let i = 0; i < 7; i++) {
  const year = begYear + i;
  yearOptions.push({ key: i.toString(), text: year.toString(), value: year });
}

const affilOptions = [
  { key: 'u', text: 'Undergraduate', value: 'undergraduate' },
  { key: 'g', text: 'Graduate', value: 'graduate' },
  { key: 'o1', text: 'Other', value: 'other' },
];

module.exports = {
  genderOptions,
  yearOptions,
  affilOptions
};