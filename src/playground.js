const BankingSystem = require('../src/bankingSystem')

const cryptoDotCom = new BankingSystem();

cryptoDotCom.createAccount('Ayden', 100);
cryptoDotCom.createAccount('Andrew', 200);
cryptoDotCom.withdraw('Ayden', 50)
cryptoDotCom.deposit('Andrew', 80)
cryptoDotCom.transfer('Ayden', 'Andrew', 50);
cryptoDotCom.transfer('Andrew','Ayden',120);
const aydenAccountHistory = cryptoDotCom.getTransactionHistory('Ayden')
const andrewAccountHistory = cryptoDotCom.getTransactionHistory('Andrew');

console.log(`Ayden's Account History:`)
console.log(aydenAccountHistory)
console.log(`Andrew's Account History:`)
console.log(andrewAccountHistory)