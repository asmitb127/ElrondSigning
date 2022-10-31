import { useState } from "react";
import { SignableMessage } from "@elrondnetwork/erdjs";
import { ExtensionProvider } from "@elrondnetwork/erdjs-extension-provider";
import { keccak256 } from "@ethersproject/keccak256";

import "./App.css";

const provider = ExtensionProvider.getInstance();

function App() {
  // const [active, setActive] = useState("");
  // const [passive, setPassive] = useState("");
  const [tokenId, setTokenId] = useState("");
  const [wallet, setWallet] = useState("");
  const [signature, setSignature] = useState("");

  const signMessage = async () => {
    //get message
    const message = Buffer.from(tokenId);

    //signable Message for signature
    const signableMessage = new SignableMessage({
      message: message,
    });

    //serializedMessage for sending to smart contract
    const serializedMessage = signableMessage.serializeForSigning();
    console.log(serializedMessage.toString("hex"));

    //sign message
    const signedMessage = await provider.signMessage(signableMessage);
    setSignature(signedMessage.signature.value);
  };

  return (
    <div
      className="App"
      style={{
        width: "500px",
      }}
    >
      <button
        onClick={async () => {
          await provider.init();
          const address = await provider.login();
          setWallet(address);
        }}
        disabled={wallet}
      >
        {wallet
          ? `${wallet.substring(0, 10)}...${wallet.substring(
              wallet.length - 10,
              wallet.length
            )}`
          : "Connect"}
      </button>
      <input
        type="text"
        value={tokenId}
        onChange={(e) => setTokenId(e.target.value)}
        placeholder="message"
      />
      <button onClick={signMessage} disabled={!wallet}>
        Sign message
      </button>
      {signature && (
        <span
          style={{
            width: "100%",
            wordBreak: "break-all",
          }}
        >
          Your signature is: {signature}
        </span>
      )}
    </div>
  );
}

export default App;
