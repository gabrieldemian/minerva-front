# About

This is the frontend of a project of mine, named "Minerva". An end-to-end encrypted email service powered by Solana blockchain. <br />

I did this project mostly to learn how to implement end-to-end encryption.

# Encryption

The frontend is responsible for encrypting and decrypting data, while the blockchain is only used to store public information about the encryption, key exchange, and the email itself. <br />

I used AES-256 bit with Counter Mode.

# Key Exchange

I used diffie-helmann algorithm for the key exchange, each user get a public an private key at the registration moment. Only the public key is stored on the blockchain.

# Run the project

Run the following commands on your terminal, at the root of the project:

```bash
yarn
yarn dev
```

# Decrypting an email

Simply paste your private key - the one that you got from registration - on the input and click the 'decrypt' button.

![image](https://user-images.githubusercontent.com/42912075/161165305-2a5aa6a5-597c-424a-ad92-0614dd93bac3.png)
![image](https://user-images.githubusercontent.com/42912075/161165330-62973b16-b713-4b3e-92f5-7e7888bb873e.png)
