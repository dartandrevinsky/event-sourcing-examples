const salt = Math.random().toString().substr(2, 6);

const userData = (() => {

  const [ fName, lName, email, pass, passConf, ssn ] = 'John|Doe|jd@em.com|12345|12345|12345'.split('|').map(k => `${k}_${salt}`);

  return {
    fName, lName, email, pass, passConf, ssn
  }

})();

const otherUserData = (() => {

  const [ fName, lName, email, pass, passConf, ssn ] = 'Jane|Dole|janed@ail.com|56789|56789|56789'.split('|').map(k => `${k}_${salt}`);

  return {
    fName, lName, email, pass, passConf, ssn
  }

})();

const accountOne = (() => {

  const [ title, amount, description ] = 'InitialAccount|100|One hundred'.split('|');

  return {
      title,
      amount,
      description
  }

})();

const accountTwo = (() => {

  const [ title, amount, description ] = 'SecondaryAccount|200|Two hundred'.split('|');

  return {
      title,
      amount,
      description
  }

})();


const transferOne = (() => {

  const [ selectAccount, amount, description ] = 'true|2|Two bucks'.split('|');

  return {
    selectAccount, amount, description
  }

})();

const transferTwo = (() => {

  const [ selectAccount, amount, description ] = 'true|4|Four bucks'.split('|');

  return {
    selectAccount, amount, description
  }

})();

let nextFilenameIdx = 0;

export default {
  waitForConditionTimeout: 10000,
  userData,
  otherUserData,
  accountOne,
  accountTwo,
  transferOne,
  transferTwo,
  seed: (new Date() - 0).toString(),
  nextFilenameIdx: () => nextFilenameIdx++
};