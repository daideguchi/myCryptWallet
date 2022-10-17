// import Layout from "../components/layout";
import { Button } from "flowbite-react";
import { useEffect, useState } from "react";

const Wei = 1000000000000000000;

const Chains = {
  1: "Mainnet",
  3: "Ropsten",
  4: "Rinkeby",
  42: "Kovan",
  1337: "Geth private chain(default )",
  61: "Ethereum Classic Mainnet",
  62: "Morden",
};

const getAccount = async () => {
  try {
    const account = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    if (account.length > 0) {
      return account[0];
    } else {
      return "";
    }
  } catch (err) {
    if (err.code === 4001) {
      // EIP-1193 userRejectedRequest error
      // If this happens, the user rejected the connection request.
      console.log("Please connect to MetaMask.");
    } else {
      console.error(err);
    }
    return "";
  }
};

const handleAccountChanged = async (accountNo, setAccount, setChainId) => {
  const account = await getAccount();
  setAccount(account);

  const chainId = await getChainID();
  setChainId(chainId);
};

const getChainID = async () => {
  const chainId = await window.ethereum.request({ method: "eth_chainId" });
  return parseInt(chainId);
};

function App() {
  const [account, setAccount] = useState("-");
  const [chainId, setChainId] = useState(0);
  const btnDisabled = account != "-";

  const initializeAccount = async () => {
    const account = getAccount();
    if (account != "") {
      handleAccountChanged(account, setAccount, setChainId);
    }
  };

  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      window.ethereum.on("accountsChanged", (accountNo) =>
        handleAccountChanged(accountNo, setAccount, setChainId)
      );
      window.ethereum.on("chainChanged", (accountNo) =>
        handleAccountChanged(accountNo, setAccount, setChainId)
      );
    }
  }, [account]);

  return (
    <div>
      <h2>MetaMask test</h2>
      <div>
        <h3>Account</h3>
        <div
          id="GetAccountButton"
          onClick={initializeAccount}
          disabled={btnDisabled}
        >
          <Button color="success">Get Account</Button>
        </div>

        <p id="account">Address: {account}</p>
        <p id="account">Chain ID: {chainId}</p>
        <p id="account">Chain Name: {Chains[chainId]}</p>
      </div>
    </div>
  );
}

export default App;
