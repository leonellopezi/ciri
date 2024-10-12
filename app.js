let web3;
let account;
let presaleContract;
const presaleAddress = "0x66De30Bdd20537b9E81c2F1fC38d75ff12Cb55a6"; // Dirección del contrato de preventa

// ABI del contrato de preventa
const presaleAbi =
  [
    {
      inputs: [],
      name: "buyTokens",
      outputs: [],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_rate",
          type: "uint256",
        },
        {
          internalType: "address payable",
          name: "_wallet",
          type: "address",
        },
        {
          internalType: "contract IERC20",
          name: "_token",
          type: "address",
        },
      ],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "owner",
          type: "address",
        },
      ],
      name: "OwnableInvalidOwner",
      type: "error",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "account",
          type: "address",
        },
      ],
      name: "OwnableUnauthorizedAccount",
      type: "error",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "previousOwner",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "newOwner",
          type: "address",
        },
      ],
      name: "OwnershipTransferred",
      type: "event",
    },
    {
      inputs: [],
      name: "renounceOwnership",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "newRate",
          type: "uint256",
        },
      ],
      name: "setRate",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "purchaser",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "value",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
      ],
      name: "TokensPurchased",
      type: "event",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "newOwner",
          type: "address",
        },
      ],
      name: "transferOwnership",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
      ],
      name: "withdrawTokens",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "owner",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "rate",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "token",
      outputs: [
        {
          internalType: "contract IERC20",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "wallet",
      outputs: [
        {
          internalType: "address payable",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "weiRaised",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
  ];

// Inicializa Web3 y el contrato
async function initWeb3() {
  if (typeof window.ethereum !== "undefined") {
    try {
      web3 = new Web3(window.ethereum); // Cambié 'new web3' a 'new Web3'
      await window.ethereum.request({ method: "eth_requestAccounts" }); // Actualiza el método para solicitar cuentas
      presaleContract = new web3.eth.Contract(presaleAbi, presaleAddress);

      console.log("Web3 y contrato inicializados");

      // Verificar la conexión a MetaMask
      const accounts = await web3.eth.getAccounts();
      account = accounts[0];
      if (account) {
        console.log("Cuenta conectada: " + account);
        alert("Billetera conectada: " + account);

        document.getElementById("walletAddressValue").textContent = account;
        document.getElementById("walletAddress").style.display = "block";

        document.getElementById("connectWalletButton").style.display = "none";
        document.getElementById("buyButton").style.display = "block";
      }
    } catch (error) {
      console.error("Error al inicializar Web3 o MetaMask:", error);
      alert("Error al inicializar Web3 o MetaMask: " + error.message);
    }
  } else {
    alert("MetaMask no está instalado.");
  }
}

// Función para conectar la billetera
async function connectWallet() {
  try {
    const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    account = accounts[0];
    console.log("Cuenta conectada: " + account);
    alert("Billetera conectada: " + account);

    document.getElementById("walletAddressValue").textContent = account;
    document.getElementById("walletAddress").style.display = "block";

    document.getElementById("connectWalletButton").style.display = "none";
    document.getElementById("buyButton").style.display = "block";
  } catch (error) {
    console.error("Error al conectar la billetera:", error);
    alert("Error al conectar la billetera: " + error.message);
  }
}

// Función para calcular la cantidad de tokens
document
  .getElementById("bnbAmount")
  .addEventListener("input", async function () {
    const bnbAmount = parseFloat(document.getElementById("bnbAmount").value);
    if (isNaN(bnbAmount) || bnbAmount <= 0) {
      document.getElementById("wsmAmount").value = "";
      return;
    }

    try {
      const rate = await presaleContract.methods.rate().call();
      console.log("Tasa obtenida del contrato:", rate);

      const wsmAmount = bnbAmount * rate;
      document.getElementById("wsmAmount").value = wsmAmount;
    } catch (error) {
      console.error("Error al obtener la tasa del contrato:", error);
      alert("Error al obtener la tasa del contrato: " + error.message);
    }
  });

// Función para realizar la compra
async function buyTokens() {
  const bnbAmount = parseFloat(document.getElementById("bnbAmount").value);
  if (isNaN(bnbAmount) || bnbAmount <= 0) {
    alert("Por favor, ingresa un monto válido en BNB.");
    return;
  }

  try {
    const amountToSend = web3.utils.toWei(bnbAmount.toString(), "ether");

    console.log("Monto a enviar:", amountToSend);

    // Realiza la compra de tokens
    await presaleContract.methods.buyTokens().send({
      from: account,
      value: amountToSend,
      gas: 300000, // Ajusta este valor según sea necesario
    });

    alert("Compra exitosa!");
  } catch (error) {
    console.error("Error al realizar la compra:", error);
    alert("Error al realizar la compra: " + error.message);
  }
}

// Evento de clic para conectar la billetera
document
  .getElementById("connectWalletButton")
  .addEventListener("click", connectWallet);

// Llama a la función initWeb3 al cargar la página
window.addEventListener("load", function () {
  initWeb3();
});

// Evento de clic para comprar tokens
document.getElementById("buyButton").addEventListener("click", buyTokens);
