const BankingSystem = require("../src/bankingSystem");

describe("Banking System", () => {
  let cryptoDotCom;

  beforeEach(() => {
    cryptoDotCom = new BankingSystem();
  });

  test("New account is created properly", () => {
    cryptoDotCom.createAccount("Ayden", 100);
    expect(cryptoDotCom.bank["Ayden"].balance).toBe(100);
    expect(cryptoDotCom.bank["Ayden"].transactionHistory).toEqual([
      { type: "Account Creation", amount: 100, balance: 100 },
    ]);
  });

  test("If account already exist, new account should not be created", () => {
    cryptoDotCom.createAccount("Ayden", 100);
    expect(() => cryptoDotCom.createAccount("Ayden", 100)).toThrow(
      "Account Ayden already exist"
    );
    expect(cryptoDotCom.bank["Ayden"].balance).toBe(100);
    expect(cryptoDotCom.bank["Ayden"].transactionHistory).toEqual([
      { type: "Account Creation", amount: 100, balance: 100 },
    ]);
  });

  test("createAccount method checks for valid account name", () => {
    expect(() => cryptoDotCom.createAccount("@@@999abcd!!!!", 100)).toThrow(
      "Please enter a valid account name. Account names are 3-30 characters long and can only contain letters or numbers"
    );
  });

  test("Minimum starting balance over 0 to create account", () => {
    expect(() => cryptoDotCom.createAccount("Ayden", 0)).toThrow(
      "Please enter an amount greater than 0"
    );
  });

  test("Deposit method adds funds to account and tracks history", () => {
    cryptoDotCom.createAccount("Ayden", 100);
    cryptoDotCom.deposit("Ayden", 200);
    expect(cryptoDotCom.bank["Ayden"].balance).toBe(300);
    expect(cryptoDotCom.bank["Ayden"].transactionHistory).toEqual([
      { type: "Account Creation", amount: 100, balance: 100 },
      { type: "Deposit", amount: 200, balance: 300 },
    ]);
  });

  test("Deposit method will throw an error if account does not exist", () => {
    expect(() => cryptoDotCom.deposit("Ayden", 200)).toThrow(
      "Account Ayden does not exist"
    );
  });

  test("Amount greater than 0 required to deposit", () => {
    cryptoDotCom.createAccount("Ayden", 100);
    expect(() => cryptoDotCom.deposit("Ayden", 0)).toThrow(
      "Please enter an amount greater than 0"
    );
    expect(cryptoDotCom.bank["Ayden"].balance).toBe(100);
    expect(cryptoDotCom.bank["Ayden"].transactionHistory).toEqual([
      { type: "Account Creation", amount: 100, balance: 100 },
    ]);
  });

  test("Withdraw method removes funds from the account and tracks history", () => {
    cryptoDotCom.createAccount("Ayden", 100);
    cryptoDotCom.withdraw("Ayden", 80);
    expect(cryptoDotCom.bank["Ayden"].balance).toBe(20);
    expect(cryptoDotCom.bank["Ayden"].transactionHistory).toEqual([
      { type: "Account Creation", amount: 100, balance: 100 },
      { type: "Withdrawal", amount: 80, balance: 20 },
    ]);
  });

  test("Withdraw method prevents overdraft if account does not have sufficient funds", () => {
    cryptoDotCom.createAccount("Ayden", 100);
    expect(() => cryptoDotCom.withdraw("Ayden", 200)).toThrow(
      "Insufficient funds to withdraw, Current Balance: 100"
    );
    expect(cryptoDotCom.bank["Ayden"].balance).toBe(100);
    expect(cryptoDotCom.bank["Ayden"].transactionHistory).toEqual([
      { type: "Account Creation", amount: 100, balance: 100 },
    ]);
  });

  test("Withdraw method will throw an error if account does not exist", () => {
    expect(() => cryptoDotCom.withdraw("Ayden", 200)).toThrow(
      "Account Ayden does not exist"
    );
  });

  test("Withdraw minimum is an amount greater than 0", () => {
    cryptoDotCom.createAccount("Ayden", 100);
    expect(() => cryptoDotCom.withdraw("Ayden", -100)).toThrow(
      "Please enter an amount greater than 0"
    );
    expect(cryptoDotCom.bank["Ayden"].balance).toBe(100);
  });

  test("Transfer method correctly withdraws/deposits from both accounts and tracks history", () => {
    cryptoDotCom.createAccount("Ayden", 100);
    cryptoDotCom.createAccount("Andrew", 200);
    cryptoDotCom.transfer("Ayden", "Andrew", 50);
    expect(cryptoDotCom.bank["Ayden"].balance).toBe(50);
    expect(cryptoDotCom.bank["Andrew"].balance).toBe(250);
    expect(cryptoDotCom.bank["Ayden"].transactionHistory).toEqual([
      { type: "Account Creation", amount: 100, balance: 100 },
      { type: "Transfer out to Andrew", amount: 50, balance: 50 },
    ]);
    expect(cryptoDotCom.bank["Andrew"].transactionHistory).toEqual([
      { type: "Account Creation", amount: 200, balance: 200 },
      { type: "Transfer in from Ayden", amount: 50, balance: 250 },
    ]);
  });

  test("Transfer method requires a valid accountFrom", () => {
    cryptoDotCom.createAccount("Ayden", 100);
    expect(() => cryptoDotCom.transfer("Andrew", "Ayden", 100)).toThrow(
      "Account Andrew does not exist"
    );
  });

  test("Transfer method requires a valid accountTo", () => {
    cryptoDotCom.createAccount("Andrew", 100);
    expect(() => cryptoDotCom.transfer("Andrew", "Ayden", 100)).toThrow(
      "Account Ayden does not exist"
    );
  });

  test("Transfer method will check for sufficient funds from accountFrom", () => {
    cryptoDotCom.createAccount("Ayden", 100);
    cryptoDotCom.createAccount("Andrew", 200);
    expect(() => cryptoDotCom.transfer("Ayden", "Andrew", 200)).toThrow(
      "Insufficient funds to withdraw, Current Balance: 100"
    );
    expect(cryptoDotCom.bank["Ayden"].balance).toBe(100);
    expect(cryptoDotCom.bank["Ayden"].transactionHistory).toEqual([
      { type: "Account Creation", amount: 100, balance: 100 },
    ]);
    expect(cryptoDotCom.bank["Andrew"].balance).toBe(200);
    expect(cryptoDotCom.bank["Andrew"].transactionHistory).toEqual([
      { type: "Account Creation", amount: 200, balance: 200 },
    ]);
  });

  test("getTransactionHistory will correctly return account transaction history", () => {
    cryptoDotCom.createAccount("Ayden", 100);
    cryptoDotCom.createAccount("Andrew", 100);
    cryptoDotCom.withdraw("Ayden", 50);
    cryptoDotCom.deposit("Andrew", 150);
    cryptoDotCom.transfer("Ayden", "Andrew", 50);
    expect(cryptoDotCom.getTransactionHistory("Ayden")).toEqual([
      { type: "Account Creation", amount: 100, balance: 100 },
      { type: "Withdrawal", amount: 50, balance: 50 },
      { type: "Transfer out to Andrew", amount: 50, balance: 0 },
    ]);
    expect(cryptoDotCom.getTransactionHistory("Andrew")).toEqual([
      { type: "Account Creation", amount: 100, balance: 100 },
      { type: "Deposit", amount: 150, balance: 250 },
      { type: "Transfer in from Ayden", amount: 50, balance: 300 },
    ]);
  });

  test("getTransactionHistory will check for a valid account name", () => {
    expect(() => cryptoDotCom.getTransactionHistory("Ayden")).toThrow(
      "Account Ayden does not exist"
    );
  });
});
