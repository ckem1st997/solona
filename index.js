const { Keypair, Connection, PublicKey } = require("@solana/web3.js");
const bip39 = require("bip39");
const { derivePath } = require("ed25519-hd-key");
const web3 = require("@solana/web3.js");
const fs = require("fs"); // Nhập module fs

(async () => {
  const wordlist = bip39.wordlists.english;
  let count=0;
  while (true) {
    try {
        count++;
      const mnemonic = getRandomWords(wordlist, 12);
      const seed = await bip39.mnemonicToSeedSync(mnemonic, ""); // (mnemonic, password)
      const keypair = Keypair.fromSeed(seed.slice(0, 32));
      console.log(`[${count}] adds: ${keypair.publicKey}`); //
      const tokenAccount1Pubkey = new PublicKey(keypair.publicKey);

      // Kết nối với cluster Solana và kiểm tra số dư
      const connection = new web3.Connection(
        web3.clusterApiUrl("mainnet-beta"),
        "confirmed"
      );
      const balance = connection.getBalance(tokenAccount1Pubkey);
      var balanceInSol = balance / web3.LAMPORTS_PER_SOL;
      if (balanceInSol > 0) {
        // Ghi đè số dư vào file sol.txt
        const dataToAppend = `Seed: ${mnemonic}.Số dư trong ví: ${balanceInSol} SOL\n`;

        await fs.appendFileSync("sol.txt", dataToAppend, (err) => {
          if (err) {
            console.error("Có lỗi khi ghi file:", err);
          } else {
            console.log("Số dư đã được ghi vào file sol.txt");
          }
        });
      }
    } catch (error) {
      console.log(error);
    }
  }
})();

function getRandomWords(wordlist, count) {
  const randomWords = [];

  for (let i = 0; i < count; i++) {
    // Tạo một chỉ số ngẫu nhiên
    const randomIndex = Math.floor(Math.random() * wordlist.length);
    // Lấy từ tại vị trí chỉ số ngẫu nhiên và thêm vào mảng kết quả
    randomWords.push(wordlist[randomIndex]);
  }

  return randomWords.join(" ");
}
