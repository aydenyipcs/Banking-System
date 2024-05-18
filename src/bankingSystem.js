class BankingSystem {
  constructor() {
    this.bank = {};
  }
  isValidAccountName(accountName) {
    const validName = /^[a-zA-Z0-9]{3,30}$/;
    if(!accountName) throw new Error('Account name must be provided')
    if (!validName.test(accountName))
      throw new Error(
        "Please enter a valid account name. Account names are 3-30 characters long and can only contain letters or numbers"
      );
  }
  isValidAccount(accountName) {
    if (!this.bank[accountName])
      throw new Error(`Account ${accountName} does not exist`);
  }
  isValidAmount(amount) {
    if(amount <= 0) throw new Error("Please enter an amount greater than 0");
  }
  createAccount(accountName, startingBalance) {
    this.isValidAccountName(accountName);
    this.isValidAmount(startingBalance)
    if (this.bank[accountName])
      throw new Error(`Account ${accountName} already exist`);
    this.bank[accountName] = {
      balance: startingBalance,
      transactionHistory: [
        {
          type: "Account Creation",
          amount: startingBalance,
          balance: startingBalance,
        },
      ],
    };
  }
  deposit(accountName, amount, type = "Deposit") {
    this.isValidAccount(accountName)
    this.isValidAmount(amount)
    const newBalance = this.bank[accountName].balance + amount;
    this.bank[accountName].balance = newBalance;
    this.bank[accountName].transactionHistory.push({
      type: type,
      amount: amount,
      balance: newBalance,
    });
  }
  withdraw(accountName, amount, type = "Withdrawal") {
    this.isValidAccount(accountName)
    this.isValidAmount(amount)
    const currBalance = this.bank[accountName].balance;
    if (currBalance < amount)
      throw new Error(
        `Insufficient funds to withdraw, Current Balance: ${currBalance}`
      );
    const newBalance = currBalance - amount;
    this.bank[accountName].balance = newBalance;
    this.bank[accountName].transactionHistory.push({
      type: type,
      amount: amount,
      balance: newBalance,
    });
  }
  transfer(accountFrom, accountTo, amount) {
    this.isValidAccount(accountFrom)
    this.isValidAccount(accountTo)
    this.withdraw(accountFrom, amount, `Transfer out to ${accountTo}`);
    this.deposit(accountTo, amount, `Transfer in from ${accountFrom}`);
  }
  getTransactionHistory(accountName) {
    this.isValidAccount(accountName)
    return this.bank[accountName].transactionHistory;
  }
}

module.exports = BankingSystem;
