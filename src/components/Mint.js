import React from "react";
import Marquee from "react-fast-marquee";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Web3 from "web3";
import Web3Modal from "web3modal";
import { useHistory, useLocation } from "react-router-dom";
import axios from "axios";
import { MerkleTree } from "merkletreejs";
import keccak256 from "keccak256";
function Mint() {
  const [pagelocation, setPageLocation] = useState(useLocation().pathname);
  //totalMinted is the total amount of tokens minted
  const [totalMinted, setTotalMinted] = useState(0);
  //mint value is the amount of tokens to mint
  const [value, setValue] = useState(1);
  //connect to metamask
  const [walletConnected, setWalletConnected] = useState(false);

  // Connect Wallet
  const connectWallet = async () => {
    if (Web3.givenProvider) {
      const providerOptions = {};

      const web3Modal = new Web3Modal({
        network: "mainnet",
        cacheProvider: true,
        providerOptions,
      });

      const provider = await web3Modal.connect();
      const web3 = new Web3(provider);

      web3.eth.net.getId();

      const addresses = await web3.eth.getAccounts();
      const address = addresses[0];

      const { ethereum } = window;

      const networkId = await ethereum.request({
        method: "net_version",
      });

      setWalletConnected(true);
    } else {
      window.open(
        `https://metamask.app.link/dapp/mint.dangerousdonkeyclub.com${pagelocation}`
      );
    }
  };

  // Contract Info
  const CONTRACT_ADDRESS = "0x5A33be6A980ba8720f97EBf6B8EA5E638cb02442";
  const CONTRACT_ABI = [
    { inputs: [], name: "ApprovalCallerNotOwnerNorApproved", type: "error" },
    { inputs: [], name: "ApprovalQueryForNonexistentToken", type: "error" },
    { inputs: [], name: "ApproveToCaller", type: "error" },
    { inputs: [], name: "BalanceQueryForZeroAddress", type: "error" },
    { inputs: [], name: "CollectionSizeZero", type: "error" },
    { inputs: [], name: "ExceedsMaximumBatchSize", type: "error" },
    { inputs: [], name: "MaximumBatchSizeZero", type: "error" },
    { inputs: [], name: "MintERC2309QuantityExceedsLimit", type: "error" },
    { inputs: [], name: "MintToZeroAddress", type: "error" },
    { inputs: [], name: "MintZeroQuantity", type: "error" },
    { inputs: [], name: "OwnerQueryForNonexistentToken", type: "error" },
    { inputs: [], name: "OwnershipNotInitializedForExtraData", type: "error" },
    { inputs: [], name: "TransferCallerNotOwnerNorApproved", type: "error" },
    { inputs: [], name: "TransferFromIncorrectOwner", type: "error" },
    {
      inputs: [],
      name: "TransferToNonERC721ReceiverImplementer",
      type: "error",
    },
    { inputs: [], name: "TransferToZeroAddress", type: "error" },
    { inputs: [], name: "URIQueryForNonexistentToken", type: "error" },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "owner",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "approved",
          type: "address",
        },
        {
          indexed: true,
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "Approval",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "owner",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "operator",
          type: "address",
        },
        {
          indexed: false,
          internalType: "bool",
          name: "approved",
          type: "bool",
        },
      ],
      name: "ApprovalForAll",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "uint256",
          name: "fromTokenId",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "toTokenId",
          type: "uint256",
        },
        {
          indexed: true,
          internalType: "address",
          name: "from",
          type: "address",
        },
        { indexed: true, internalType: "address", name: "to", type: "address" },
      ],
      name: "ConsecutiveTransfer",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint8",
          name: "version",
          type: "uint8",
        },
      ],
      name: "Initialized",
      type: "event",
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
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "from",
          type: "address",
        },
        { indexed: true, internalType: "address", name: "to", type: "address" },
        {
          indexed: true,
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "Transfer",
      type: "event",
    },
    {
      inputs: [{ internalType: "bool", name: "status", type: "bool" }],
      name: "activePreSale",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [{ internalType: "bool", name: "status", type: "bool" }],
      name: "activePublicSale",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "amountForPreSale",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "amountForPublicSale",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "to", type: "address" },
        { internalType: "uint256", name: "tokenId", type: "uint256" },
      ],
      name: "approve",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [{ internalType: "address", name: "owner", type: "address" }],
      name: "balanceOf",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
      name: "getApproved",
      outputs: [{ internalType: "address", name: "", type: "address" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "getProfits",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [{ internalType: "address", name: "address_", type: "address" }],
      name: "getTokensOfAddress",
      outputs: [{ internalType: "string[]", name: "", type: "string[]" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "initialize",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "owner", type: "address" },
        { internalType: "address", name: "operator", type: "address" },
      ],
      name: "isApprovedForAll",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "name",
      outputs: [{ internalType: "string", name: "", type: "string" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "owner",
      outputs: [{ internalType: "address", name: "", type: "address" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [{ internalType: "uint256", name: "quantity", type: "uint256" }],
      name: "ownerMint",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
      name: "ownerOf",
      outputs: [{ internalType: "address", name: "", type: "address" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [{ internalType: "uint256", name: "quantity", type: "uint256" }],
      name: "preSaleMint",
      outputs: [],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [],
      name: "preSalePrice",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [{ internalType: "uint256", name: "quantity", type: "uint256" }],
      name: "publicSaleMint",
      outputs: [],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [],
      name: "publicSalePrice",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "renounceOwnership",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [{ internalType: "bool", name: "status", type: "bool" }],
      name: "revelBaseURI",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "from", type: "address" },
        { internalType: "address", name: "to", type: "address" },
        { internalType: "uint256", name: "tokenId", type: "uint256" },
      ],
      name: "safeTransferFrom",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "from", type: "address" },
        { internalType: "address", name: "to", type: "address" },
        { internalType: "uint256", name: "tokenId", type: "uint256" },
        { internalType: "bytes", name: "_data", type: "bytes" },
      ],
      name: "safeTransferFrom",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "operator", type: "address" },
        { internalType: "bool", name: "approved", type: "bool" },
      ],
      name: "setApprovalForAll",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [{ internalType: "string", name: "baseURI_", type: "string" }],
      name: "setBaseURI",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [{ internalType: "uint256", name: "quantity", type: "uint256" }],
      name: "setFreeSaleQuantity",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [{ internalType: "string", name: "baseURI_", type: "string" }],
      name: "setHiddenBaseURI",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [{ internalType: "uint256", name: "limit", type: "uint256" }],
      name: "setPreSaleLimit",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [{ internalType: "uint256", name: "price", type: "uint256" }],
      name: "setPreSalePrice",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [{ internalType: "uint256", name: "quantity", type: "uint256" }],
      name: "setPreSaleQuantity",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [{ internalType: "uint256", name: "limit", type: "uint256" }],
      name: "setPublicSaleLimit",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [{ internalType: "uint256", name: "price", type: "uint256" }],
      name: "setPublicSalePrice",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [{ internalType: "uint256", name: "quantity", type: "uint256" }],
      name: "setPublicSaleQuantity",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [{ internalType: "string", name: "uriSuffix_", type: "string" }],
      name: "setUriSuffix",
      outputs: [{ internalType: "string", name: "", type: "string" }],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [{ internalType: "bytes4", name: "interfaceId", type: "bytes4" }],
      name: "supportsInterface",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "symbol",
      outputs: [{ internalType: "string", name: "", type: "string" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
      name: "tokenURI",
      outputs: [{ internalType: "string", name: "", type: "string" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "totalSupply",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "from", type: "address" },
        { internalType: "address", name: "to", type: "address" },
        { internalType: "uint256", name: "tokenId", type: "uint256" },
      ],
      name: "transferFrom",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
      name: "transferOwnership",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "uriSuffix",
      outputs: [{ internalType: "string", name: "", type: "string" }],
      stateMutability: "view",
      type: "function",
    },
  ];
  // Fetch
  useEffect(async () => {
    if (Web3.givenProvider) {
      if (walletConnected) {
        const web3 = new Web3(Web3.givenProvider);
        await Web3.givenProvider.enable();

        const contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);

        contract.methods
          .totalSupply()
          .call()
          .then((response) => {
            setTotalMinted(response);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }
  }, [walletConnected]);

  useEffect(() => {
    axios
      .get(
        "https://api.etherscan.io/api?module=stats&action=tokensupply&contractaddress=0x5A33be6A980ba8720f97EBf6B8EA5E638cb02442&apikey=737ZBCA6CN3KPNJVBCCXC6EV79S4VKG6KP"
      )
      .then(function (response) {
        setTotalMinted(response.data.result);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  // Mint
  // const mint = async () => {
  //   if (value > 0) {
  //     if (Web3.givenProvider) {
  //       connectWallet();

  //       const web3 = new Web3(Web3.givenProvider);
  //       await Web3.givenProvider.enable();

  //       const price = 55 * value;
  //       var tokens = web3.utils.toWei(price.toString(), "ether");
  //       var bntokens = web3.utils.toBN(tokens);

  //       const contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);

  //       const addresses = await web3.eth.getAccounts();
  //       const address = addresses[0];

  //       const WHITELIST_SALE_WHITELIST = [
  //         "0x626be85E9C35C3fB1610692B59e1459bad1B4CBe",
  //         "0xFa1C30bD2e261eff51f1B233b29cA8808fFFf0f4",
  //         "0xc9a4AD636A686a097AF74601fEbd11D8e5AcC13b",
  //         "0x08EE50A1eaf7AC1349f7493d0093204c4363F4Ee",
  //         "0x4531f394Af5d94A10d36A0CCd1bCEAbF138144e0",
  //         "0x00842de4C340edDe4e9cf4c6a7c765BcA116A65c",
  //         "0x48F144fac98784CfFcD50DB88F1B28D5c3b48a74",
  //         "0xb50E7ECb2A6705063383Fc90449838142Ae2f593",
  //         "0x6373392fdb32187FC13bA545E7F359510Ebd58ab",
  //         "0x793Fb1e46a02C481eeC034BaF792e58F79Ea0B65",
  //         "0x6686a5aa4BB566D8AFDFBF10D58F83Fa6c561a14",
  //         "0x40d48363e91df08D7d95d05494fb09503B6DB950",
  //         "0x004802cC10e61461309Bf19f500282Ac3f18573a",
  //         "0x7453793E044E8313dC75023f6D37B89702Fe6477",
  //         "0x08E58302462a1859961A531e13cf81DeFE114420",
  //         "0x3B700E3B3bDDF8f78579c535dF46853380Fbc24e",
  //         "0xb012445f7F7aC7689660dB5Ba2f473d3780a4a8E",
  //         "0xA328A97fc1E3Cd05fBE0b305B293c28742DE4e51",
  //         "0x204607bC24C39Eb225520C47cd772C3BAd2c0BF2",
  //         "0xE7371ED0707C2AbdAB20B003e28Af3A8325C32a2",
  //         "0x5b56A88b984f46e977330F0237D34c6675C33f32",
  //         "0x93FdB7ea1e50AeEa9587d53Cd652A5c18Ee4FbE3",
  //         "0x7117dF65b987fccFbC7aC0C4dBcE7226Ca9f4F78",
  //         "0x23379EeB352280D42775Cc2f929e675712552a42",
  //         "0xE53d3F62c4bdA2eA5edC45b34D48D9fE6402645a",
  //         "0x0Bd632f9f148f7b498AC1f6F8C3F369522ABF846",
  //         "0xaD752fe6600Bc6110C0F8c95A1bC786698E6b81b",
  //         "0xe905c01146B4893732382D2e0B3D54f7343646EB",
  //         "0x9423896bba14d8b4D2b04C55568E2C3D40f54317",
  //         "0x001f3524621fD33fd354b3b77A05F602cf3546D1",
  //         "0xD0394Ff9C583BC43470E9c5660Ef11DB4Ab7785e",
  //         "0x35f31e5fFf2c939a5CEC6c6f1D9b3334C18e1fFA",
  //         "0x2efC8e98E2456BB4a916b6d64acfFAEA71B96C58",
  //         "0x6acA138995556355636401b206EB8280DdA3421c",
  //         "0x18A0886443Db5450924198af358af8d209913431",
  //         "0x7F79162f374B26520Ed6770cD4Faa965Ee967226",
  //         "0xC9129cC489E77118F6EE4F52E2fE3B94943b4cD6",
  //         "0xc55d669f3F02AcE0Cd2A8bA22153F4Bd40D70709",
  //         "0xa3bFBB500C51d2EAF04A4c8D26f9106f048276A3",
  //         "0x1Dcd599621eBa0fe197e42338B6E46C18aC7a1bD",
  //         "0x6E11497c5d3c3Bb63955300EB848d7f1d424fDBE",
  //         "0xCde5472710A9EFE8Bc91f751C543a6e4E45422ce",
  //         "0x4C329B88B8007e2a4BCE85497A6134824cdd4708",
  //         "0xf48dC0A0B15a3bB7824f70A129B4Da7B661778d2",
  //         "0x8616AA1099ae62B10f5823d03f6AE780527182B1",
  //         "0x5B797c36763b31036De7235C21aF115d92C6aD57",
  //         "0x3c4014eB7CD032e8Ca22718b44C23243ED73F906",
  //         "0xaDaa4F224Ba293539868d2A46bB6372A65eDA566",
  //         "0xcdB3d775a661fcAe7C3eb367bCC263f6119D5d63",
  //         "0x06BD77dBdf2683B68eF86b9Dfb08cc5Fe4625C85",
  //         "0x550187C213b580B5f4172270F177553004145879",
  //         "0x5374E6BC3349B4f7dE3d6B02503aE99eF0cf928e",
  //         "0x40BbBb4A7069C3B8dc1c1e84d0f60b788F556Ffc",
  //         "0x3F94feE136A7d1836EDD77b0213052a2777Bd9eC",
  //         "0xD7070e1565e8Fb2d7f283E36a8A57da96A5E2Bbd",
  //         "0xd74125a6a080658e40D2055447537e77bFFe0021",
  //         "0x782D0b221DE4213E4363392B4A8870Ee4882B6F0",
  //         "0x0e72573B7E5cCD29AEB05536f1b5601CE81BA60C",
  //         "0xC8f6bc8c8C46d0d2DCBD582c0BB2EBB6cBcF6B2e",
  //         "0xF71459329641D4F992410c8dA0Be77aFE0bc96bF",
  //         "0x086F66204Ee519018EbC9b2E85CA5E178A463D08",
  //         "0xFb375eACA8E2B8d4d21ccFd8da1A4aEe0dFA712A",
  //         "0x36282936F21f58522807aF8D65004BB04F27Bb35",
  //         "0x729CFDBBC4A7bc4008A2B8Ee3494136FEbf256F5",
  //         "0x5E66e0a7a4d618b3f2f428a93651c84c9CaFf86d",
  //         "0x9C5177818Ccd1FCCc30048D589B129c6Ff89aeCb",
  //         "0x9ad881CacdAAd3C7287074a4563C3DBA2bC57959",
  //         "0x686F25E2d0B6297995d3dA22a0Fa726D477fBcC6",
  //         "0x1c7B275Bc88D06315032BE074334e73b2B26Ff59",
  //         "0xFdFF994b06A6521b067247B5faF62511DC5DAb0D",
  //         "0xB221567eed6959242FA65393C89871689995E14f",
  //         "0x409ca2329CEdEE53bB62C88059AB055FfD04cD1B",
  //         "0x4be7672e54378eB95c326F12761794Bc1f7b482a",
  //         "0x1B8f5e65e12410a1DB9e0FeacDEA48AcA7C04c9E",
  //         "0x8c54801A2F8890DcF8C7f0baE9EDe8136E2de312",
  //         "0x8E850dF1FF5699fB88F8580f84cBD0fDc9BE6EF8",
  //         "0x48e3434cFbf812970e4fC25dCB8793dCfa1322fF",
  //         "0x258CfbEb8c54253DFDcA00318cC466DeF76B6345",
  //         "0xE9274a5fd73D0B2FA77c66bB1f10c080177d5617",
  //         "0x74b5DD06B9ac33FbfC77CF1522104F7623304a36",
  //         "0x42D03e03d00db99c01bB3Eb1A39882A121c3515B",
  //         "0x62e2559aA9252730bFe612428587e5E965c45f12",
  //         "0x376F31F374BA5470E9E3B3d04ABb2C0Aa2651ccF",
  //         "0x4Fa60356036735C6d0ff326Fe8345aEb0A94D5c1",
  //         "0xf5812ad7244c8B1fD5867715c46693997723D8C8",
  //         "0xF66848D925621EADBf8445cC3415953BC04fAfd5",
  //         "0x4d288027B03424D14A547D8AcC0f2cAd6E8fFb16",
  //         "0xea1E5D839Ed27018F07a7c160f3762e26A6f3F51",
  //         "0x4Cc24115F49b7eC2764BC073C1f669112c94Cf69",
  //         "0xd962b5a7B957799E2364186c02fb37555E6663a9",
  //         "0x5D49F6C11e6B24Cd9f901dB766994d4F98a6E879",
  //         "0xB78da7C98C2bFB8AaBE1818AA6a9F5BD3A1BD77D",
  //         "0x1027fF62A9bce41f261B6D8aC5A6a1C689756c6b",
  //         "0x6a032220eF8EE864760135147382d52D4E2D8c8F",
  //         "0xAa89F18B593C370303aE53a36B362F0C577fec3b",
  //         "0xa5B9812D80459eAd6e4B658bf584aec4E1A7C08d",
  //         "0x447113911ae11dFA3e799d92253aD352F6136Ce1",
  //         "0x7c6263E2d3902be7a4C3dE8ed468777F39d41fAd",
  //         "0xDbdBDcf6486Fdd4FbCF0ECaB05dAF0FE84384772",
  //         "0xd8697a11adaB17aA714C64E0B633e65E88020983",
  //         "0x1487caef03420BA48928dc5a4ca412A861E41c4c",
  //         "0xD6992ACad6fb628c6B98Cc058C483D4644dA679E",
  //         "0x7314836778E60b39BF4ce86866EBfb70126987E4",
  //         "0xCB038800d5A66a838E57a214597c8f8C444e028f",
  //         "0xD603Ca8A3b4805B9cE4f4B6Eb81b6BA4E4cd7AAc",
  //         "0x00E370bA343d4244D3b88D1b803884128F8EBBa0",
  //         "0xEB58532fB0eaD8453a522dAe6Ed6808a071a513e",
  //         "0xaf8f76C260555ece76C60aEaDDEf4Ddd163fEC2a",
  //         "0x6Ebd11CFDAcFf4A31254447C35779FEC5aDd7eE8",
  //         "0x0fC42B9d4674a691715B057D62c0a80245CffCA4",
  //         "0xA3366D70F3ab32567E770D12a436557ba9870c0a",
  //         "0x0b1c7208bD8d7Cf3cFb354c9Bd0d6DA54C3C102a",
  //         "0x8caE4CB868275Dc61Ed84cf81B5E09f61D7c65AE",
  //         "0xF34e5e0ef69fd43F260422ca715Da56D7ccf2ed0",
  //         "0x856E6406e1eFFc8668455dcaF50086950093079A",
  //         "0x81965635a77ABf2649b5c1A690fE082AEa6b1c47",
  //         "0x4Dd3Bb1a9A1e769c4AA1D96903056d4d4B2923d3",
  //         "0xb0A7873E88E00e2Ff8d024E349e03bc327165afB",
  //         "0xc4Da6204868a6bF9C2ca8Eb33ed48d6D8dd14FDB",
  //         "0xf8c24Cd34322BF3144B8ae44089f93dE6edF2e5D",
  //         "0xCB34306679ea93fA95f198dFDB9Db224161Da3fb",
  //         "0x9d6211C7974875C4925290dBc76cBF30Ef256b88",
  //         "0xD2f451B5Dd29e958C3D5A54d7ed11F1bDc21DaA7",
  //         "0xdC4D7bDFEC72C43381ca66716e0d26C1B072CBa6",
  //         "0x1D8D55AD74Ab49d1c5F0c3924231Aa04d0DD8142",
  //         "0xE81394611DA1C507E35BB6b5b9253DA5C346E881",
  //         "0xd9f0874e97F30dE91E6fC8D474DfC6D803c901c2",
  //         "0x8d64C5725eEb980D12D2A8A118380760daE29bBA",
  //         "0x902d33Dff8Abc29D8Dce5492519CB8709Bf8bC76",
  //         "0x01AD88494ae274Fb8C5719C05c8B5D3A4FE76370",
  //         "0xAe1483f5d8376726Ab47b5Fa778a8130Da491677",
  //         "0x0821D60635d2e824E605ebE5d0F239bcAc8a4dFd",
  //         "0xFF9fa158DE4799b9ad18008a29Ac5797CF06bf19",
  //         "0xEa8cb221E91db531FbF9B56E04CFFee069EAB8F2",
  //         "0xdC71fFdF1dE25a9961Accb78b86e7472584f7Fc2",
  //         "0xc3419Dc91F349A66a4f9Fe770E703eC4124E09a7",
  //         "0x9Df39A54810C31649cC60691266932E254dc1F91",
  //         "0xA51fb72C1f552c414f7b06730145b7611619d011",
  //         "0xDba74E615f83a99D79bc165077ea44a24A8Bcb48",
  //         "0x4Cc7cD24b8a5D90535EC1Cf050229eA23281215B",
  //         "0x82a069C362Fa12062e362079455cd8e35630DE73",
  //         "0xf34Eec4e7c9885e2431A1DCa2bCf3a504807D349",
  //         "0xAefB8c985C22D447f4267A79c7Cc93926e8e14b9",
  //         "0x31D590Cc8cE584846a9E256AA3adC198f2cAC16D",
  //         "0x76d019841278c490a3A75c12106CE8Ac3F538A61",
  //         "0xC3CFFD0A50BA39A86C8D5b1ceDc86b953336B64C",
  //         "0x99a76268048e67de39f5Cd86eD7c5B8315D20E4A",
  //         "0x918b7745E4Aab2A9ed26Cfe908dd24A2F6fA16b2",
  //         "0x2fFae8C92601F75Cc02DBD038516D38E80101744",
  //         "0xcC1D55D31BCbc07c85081ACD04c213590b93f439",
  //         "0x873C30060C5d98e5b8316CDbb0074eAAAD69b94f",
  //         "0x61723E1B5BDe185900E81f2B1b9bffB546B33A59",
  //         "0x61D35EB56F9AF00A1238bBfdb01AcD3F22Bf4B71",
  //         "0x7c735697B6d1124D8E86DBA84e2c612051c836A9",
  //         "0x7EF0e2cB53d916cEbB7dE6FE95011a1c04a4286C",
  //         "0xDbDF09925a1A0DD1d2e33E16dA81d85014F1d720",
  //         "0x869b1CE10c9C8a2DE8a658C6d7f7cDA7B0327Dc4",
  //         "0xb41BF5299209c56D6943F354B316d5f8436bB7a8",
  //         "0xF7BC6BE2AaAa145Cbd3eCb2CEF8899385E3105B3",
  //         "0x34e4B5fa06Ba4DBDF6B8d79AfCFCcb6e29cD34aF",
  //         "0x2a79b999FBc9447c56b46c3b045fD3823Dd713F0",
  //         "0x1C5D90FF2ae230927293cCe5a7C618aE450ee6Ca",
  //         "0x668acf03F9856729AC6fea0b8d798798Ac4bE18C",
  //         "0xc038d1D23035CCf7A47eC2A7E6895E2911e96b22",
  //         "0x9385e5582dA09473aC932c48b5a87e002399436c",
  //         "0x652233229056CcD8c3E342D3BFE6Fa6a840b8d65",
  //         "0x35115cD299A56adb969C0e69fc78B88AcEEc81F0",
  //         "0xe04015BC4f7F81F18553818A541f50976a56a381",
  //         "0xe131A94eF7924315944056490050009152b1388c",
  //         "0x02C52f735B9Ff8E5c60adDc7E29c7fF4EECC542f",
  //         "0xF2C88664405E10535ac9c16289705b63cA7De577",
  //         "0x9BB8CaE1f967E44e3799F3efA412afba2081721b",
  //         "0x9124082BFD50f879001036324Ac03ce28AFE0aCa",
  //         "0xdb4458B0ff439eDF3972dDdaa34bfD81eaf3cE7b",
  //         "0xDD9E94be0b694C9E9AD3b49447b4c1a7FEf0D36F",
  //         "0xB3F8AFEC195223643Db1a29caB21834aF6849C5a",
  //         "0x8855f046E3370D19AF5CaB893eAd202468FD3070",
  //         "0x40ec682284ee9BAb65882B5bB1BA0D6Cd9dcd5A6",
  //         "0xEa34a239D3b74C5c7f6D2c63dfA039B1d78AdCB2",
  //         "0x80EE691339ebE30564fdfdc1Dd8cC9965814480d",
  //         "0x0274264A4b7239C2c96cf0FC468cc3E6D3BA343c",
  //         "0xF79E7E2c25BcB8912a3496f2e8981c2d0f333DFD",
  //         "0x2913281144629Babceba4dEF6fFBB505fa91d99F",
  //         "0x335Aee8f74461DC2a9ef09C867D981C87FC418da",
  //         "0x063e08ad72487A02e0C44Fb44C829f140A680906",
  //         "0xA2597C6ff88bAe881b36C58242cDb8B307ff779C",
  //         "0x15981b5ebf6019D582039a5988e3536d2787017b",
  //         "0x2f5aCEf138C4Da8C0623956863d58B8Df230454e",
  //         "0x730205445D613B98fd3F5A5DF2Ae0C889a07b184",
  //         "0xf59Bd5ab0ffb586CD567c1C7276FfF6dAFE7B153",
  //         "0x4C47cC96555Cd6DCF9f4715a2049f95e0DdF1aa8",
  //         "0x21FfD261DaAad5fe39734a3b4765bC82aC558003",
  //         "0x32fdFb2464F522651d5f50c6Bfd44f750933153A",
  //         "0x6B844f9bBFc1F2d9939780cfea2c133406a261F1",
  //         "0xC7ABfB8f5b1Cf5781a80bdb2A3B80e0A555e9D0c",
  //         "0xD0734b7c3bB482378d014aaBDD06610b20AcFEA1",
  //         "0xc245719787ACE578d11828B3dd4895510AeEB627",
  //         "0x2ef328BE77B882a3ae49cD17F386eD44D568cA16",
  //         "0x0E933742c7CABB2C3d48398CB744c4dbE7ECDfFb",
  //         "0xBe08e7abB7FfbB5FaC3bb7724bd7d871bD25e613",
  //         "0x4Ca1647cf5dE4De492f109A6A560E2f8BE3A5EE1",
  //         "0x139B5238F7Fcaba0370031f5c17a72936742E3d1",
  //         "0x17B62a4dDeEdE578FA546c0738b9F81891FFe857",
  //         "0xf853a53D0C00249101F66942dB9d359425Ad9A50",
  //         "0xD47b106368BbFdE1425897D1013e88E5dA0c4812",
  //         "0x7729278073F987E1f491dd63A5C0340d702B9E50",
  //         "0x028F7F2D32584fFa118dD78380D8069462964c59",
  //         "0x26906Cb0B0428Fd60c5D5A329ba9986b5Be4Ee37",
  //         "0x8A6d76B06e38f57a2724D37254ECDdB4BC254117",
  //         "0x3DC1e0E4152E11a6A8d2811BF97A229E4f974Ca6",
  //         "0x4C298Fc73894dA04B1ceFEb3d1c7f8B6cA2adF66",
  //         "0x69755EF18F724C974e38D3D6483EEb5cbda9b448",
  //         "0xa06774e688ee1D6C201fdCbd3dbBCB1ccBCb6f7D",
  //         "0x95d9fA9c16D28f15bbe8a35a144542744B3ce538",
  //         "0xc54B8eFbd5bCA629CC9aC6d103DefF5De11E68a7",
  //         "0x783B4c6767a10Fe121B05B42931103f131884A1C",
  //         "0x35fe68cE776C5BfAA60909da04e28D34348f3bC4",
  //         "0xD7a966262A0F18404F2083FB31532c64d29F2BE8",
  //         "0xe84Ee6DA2A8d2C76A2aC6549E691C7FFBB551393",
  //         "0x0C06a96D9E7Aa031B4eCEfC266C28954E88F6424",
  //         "0xCeBC2FA05dC4b0ec56651651f6098aB6599c3546",
  //         "0xFC0bD7E2Ecb90Ce143829ea0484F82A8F6E9bC3B",
  //         "0x306673F2B54AC7538b02FB0C9922e1cB37C0Ca85",
  //         "0x5717D6943Ca8F5F3d1C1e4b5f1ce710406A922e7",
  //         "0x4E149903FF9EA2c8Ca0367C8d9eC44D267cD38D7",
  //         "0x7eF935f9634E7f091ad47C272291BD166637460A",
  //         "0x1F09e71531d30247b2a0aA58B62694fAE1B79b9b",
  //         "0x1B158497A4C4D012E0A40AC1088843838CD16f1c",
  //         "0x2f9182B3166E04b6A42B1A65d677e018442ed614",
  //         "0xA28DBBdc730Ce0bA9aA93fAf3DEbB5EDACdCB366",
  //         "0x35662e3F523e6A39De1ef8C6C34dC1E89B9222D9",
  //         "0x94A8a2d2dF238488aDac68477376822a6028c4a3",
  //         "0x85Cb875793bc03c0064103Dae1F4B965b4270b17",
  //         "0x461721D7Eb744498644e9aa6a9058DdD837befeB",
  //         "0xD524F4560e5594823544dEf65952596fC0177C1C",
  //         "0xD8f9BBfE328E545f5d009454BdE8Ba63eEB479e1",
  //         "0xa5106Cc5624c9b7EF4aAE5a766b15F3C1B060005",
  //         "0x09049592C16887c87D900976D72dEDec30325af5",
  //         "0xA9B2f82b6F4dA4FBa2a11A6bc6a9f625c367f879",
  //         "0xd5c32BD3C24fB5F30FC4BD795FA91A258240Ce6d",
  //         "0x260f0406cd6d5A84Bf1e060EcBF414cA4fbbC254",
  //         "0x50495Ab40c67c14B9BB278C753353B8b7517Af38",
  //         "0x6434C595b42Eaa013dD7a7Fdd966d93305efFf57",
  //         "0xa0C951A7C966eBED50FcEF6B1236EA029BbC87AC",
  //         "0xa4D22697785639aF8419E2E6909b198BdC4eaa22",
  //         "0x1731c5Cb9F46831Da93AcD7EDA5337506B0F8A5F",
  //         "0x265B1b1781745a9E1Cec89019FbcE9fF2A36f8BC",
  //         "0x29A6cc447bc5B6C87d5d205aA5b63A4653651F18",
  //         "0x5F7f5E0E9e4f2Df0f8B07E214fB72792a3dFF0C1",
  //         "0xB5D5D5f7731e8Bd34aA86380DA4904E107926b09",
  //         "0xA271DB7a4d6fc7F1577F01D586CFB352253d18f4",
  //         "0x1537D96B5293CF14D0233939620a439Ce2Ed5556",
  //         "0x9AF8b0dEbeeDcEB3F965790b5084435D5a5AB9EF",
  //         "0x3E0A51192101417923782a4320dAB7eeE19585F5",
  //         "0x41f18F87c108e27Ae70bB1b796bae144c47CD6a4",
  //         "0x053cC7eE4D699AFc742d1bd0198d8d01567d42e8",
  //         "0x479082b22299D1bb8Eab2ba1c8B214d7193938e1",
  //         "0xE0cCb7352ce6c49d02434122abD6849F71Fe0735",
  //         "0x6ec2293C5C147d917BC2A221dB56e5D3ae354565",
  //         "0x9B4C3cF4E7070DF407867482bc71d2bD22468E05",
  //         "0x95793eD660e11ACFB733175F7628a2C40EeBAe48",
  //         "0xd4eB6fb624134d463E44a04BCC7D76994CAbB6C5",
  //         "0xC52a414D961c9FFb8185acF92E63eC46Fb628133",
  //         "0xa428595829758e53135B5146E445b8317A6C7572",
  //         "0x2B727cE8d5E50Dc264C1E78CF32A6DB564A2bD43",
  //         "0x84A69F3aBA3cA22a679f6417e7eF6Ee7ac38B67B",
  //         "0xa8EfAF4172Ad4FF45F742Fb0eEf80461a3B6B6cC",
  //         "0xC6d7dC8253e2F3e34EA345dD99e6EfDD8EA10924",
  //         "0xAdF55563285bd49Db42233B23CBd5Cf16d7bA8C9",
  //         "0x72C5FFB85032f3511A2d9E73b127aBB473f50B14",
  //         "0xf0F3C79Ad2Cd92324B4E5c667719AfcAB2b0F246",
  //         "0x9bF390671F612263A30a60E5667f0C7Ebaf367B7",
  //         "0x32aAAC086E06DA0B59095947396556422F61606c",
  //         "0x8d2E344A4D9A6185F2DE1D471b5c44bcaaaDEB31",
  //         "0xE13285BBB922B5e0e859b41a6349a780C0B4096d",
  //         "0x5fB69c3a2fC35E1f6189a26AA9C48dFB962B113D",
  //         "0x174B8b12fe6e74A6cF48A80BB509dd456723fB4a",
  //         "0x56873A73697b4BFBD47114429777A578989E7Efe",
  //         "0xDF3BD9D11C10713BC9639F789866B89f938075B9",
  //         "0xf94c490E1D739aD64f56010fF826C08c62EDe52A",
  //         "0x434dF243ac9F5fee80C5A8F19B5962D8AfAfcAd4",
  //         "0xde61fCebb202EE50C7E423E6A1D80C1BbB1d3E9C",
  //         "0x33dc242f707A4dE019312a86a6862C042a5d1DF9",
  //         "0x1987195bd59D8F254eF1102F07f3a9530C8F43f3",
  //         "0xE7376A4F72cF56f0FfeC28E9a8C8d80512a8842B",
  //         "0xc12ab75A666C72FC999637aB737f48d33700190d",
  //         "0x8d4A34F878AaE3009104b081bc20053aA34D9Bd1",
  //         "0xA38F669De8af65Cb0c5D89256135990308918682",
  //         "0xc7cF93212f1642C1f432E7055C8fa20617f6F26c",
  //         "0xdEF372E61f8Cf9B94A53240423985b2bCC19ea26",
  //         "0x256ab7F8bD4328E66D246c12425F8daE9eB8EaFa",
  //         "0x3f0A72348D2041767536E5d61FCACAa55e9334E1",
  //         "0x2B521c57793FDBc73656d9C8110A6A21773Fc886",
  //         "0xAfAcC284Eb016355D3b029ef906e4755229f8208",
  //         "0x05463001Db73c87a64814f43e2350A10Cb2A591c",
  //         "0x1084757eC83Ae3EfA80698752d607EAEA0cD5398",
  //         "0xE85cB2793B23f76A83Cf0862deb4540e7c0e081A",
  //         "0xa9BDF93B94F3D7591545c60FFF16639C98D66c86",
  //         "0x9352e3a4157471444ab0881c6d84e58Bc5230C8B",
  //         "0xADf07B5e1427Aa611920360232B3E4711e15fa7e",
  //         "0x438E29691EfA9635be4554D34A8147C777B1c351",
  //         "0x54d736468ebDf278Ea5e814861F95bEd267d69b2",
  //         "0xb9DC3D9832bcB7FB173aED8b004604aEd71692f3",
  //         "0x808187f9CE97A792951706d6a3fD7a1f1460b9C2",
  //         "0xBB7492491d31cE72026158660BFA72421d2CD5AF",
  //         "0x13Db9ADC4588f5D642fda0a966C946c6b34cB931",
  //         "0x88aC486f6d70f99aadE422339eDae0056E5E8761",
  //         "0xE8de3A0e340085B299B473F0D4127830Cd3E2F7f",
  //         "0xEeece966f039399F1d228DA7da4e26c9F1C5FAc6",
  //         "0x875Abe22f8e569735559d08A99F2DBEBEFdf1C39",
  //         "0x40A02FD32CbC7a2C1c538d39B999576944f776A5",
  //         "0xb22590BD5b70e293960FFD2CE9521747a045629A",
  //         "0xE6a54F39E95E3D62D15027BF39d1c4F6213E0B69",
  //         "0x8cc0b31286485fFF4e9c73004Ea0813965E18981",
  //         "0xF932DE76b8f426B7864D577125F40F9480010513",
  //         "0x1500a8cB362bfe3643097644604743F973510aBd",
  //         "0xBB122F5e0De571d7d77f3E610a505896fEFdE970",
  //         "0x3683Db19d5ebc9461C30F7e0BE6a15AaB9dE8DcF",
  //         "0x760B2Ef99027768B5EA062A4B94A45e1591f04e3",
  //         "0x7DA6EfC7DC753E44C6e48bD52De125e8e26eeebE",
  //         "0xCe6344FAF27f2F46E9b30C63536AFb4405e9350A",
  //         "0x85B4516C3f31F5CBae4f4A106FC2A0f06E0bC22C",
  //         "0xC43a4e90F6419c2FC560e16ba879F1395c174114",
  //         "0xf0F33F9dDE3aF6279AD47cfb5D829c244D320905",
  //         "0x228d70Eb07b72906b98499cbcfC9E33aF0370Efb",
  //         "0xC8fE6bd3bad71f6aaFF5AdC9f326462F1eDEf16a",
  //         "0x942C19a0568E9485648aC7676A12871Fe2e6D4bB",
  //         "0x8cdc575C2Ab467126D184735bc14caa34e2c1cfe",
  //         "0xcb26d7C0C99B0A583B129BEECdb099BD7f9d3763",
  //         "0x79ad1A29E0A413996A0fb9f4d658dB7Be782EC45",
  //         "0x99aAF07713a565a3C1d276Ca4c172A8cC1330dda",
  //         "0xF20C0eed0A17bCFbDe31059838996C0FB30847A2",
  //         "0x0635921312B68ac860F96f49B9AD0db6d6E4e79A",
  //         "0xE5de56CA14C7CC410802ad84Fc1c4d60C3ECD5D3",
  //         "0x4D87AC34B1F43aDb5d9391875f43f77C9806b0B7",
  //         "0xbFE2c000E897Cfa759C5D8D0AD2C4e4438855207",
  //         "0x4bCd0c6980B4dE49216d20E41b2861C976AE6399",
  //         "0x356b0dFeFAf7AF3B71F8B5DE71cb1429f4740D7A",
  //         "0xB9Ba2358f7E174d78CFc3F92d11FFC241FbdaA23",
  //         "0x0F18066796fEDa11d2dA633785661c042766b00d",
  //         "0xEdE38004Cc795502BA2624d784Cb09EA205Aa767",
  //         "0x43e91Fc155636C89e7281eBAd534Fdf4E66Ff2A7",
  //         "0x1Ea0b7bEb89E964A1B4EbD733E85951E49F03681",
  //         "0xaa2BF7C93E93e99aa747891516dB66Fc619491e4",
  //         "0x15868a54aA152bB54D5597Aaf120e857D16F61EE",
  //         "0x3238562eFfc2fe619A50CCC4524f35a851DDbd45",
  //         "0xfB17195d9Cb7f137AaE49812fDb9325504Ff2488",
  //         "0xE2c3804dF41E92Fa96C0DB1BCf96D2A950E0Dc98",
  //         "0x327bb9BC53EacA2DD710fc146ca26E852a42FF83",
  //         "0xEc719Bc2723D3270b674eF6b55bA31f4d3B1481E",
  //         "0xe2bF723413E0294c3DD4d0Ea063ecdf07a41340E",
  //         "0xd7FB26b4A93c58fF6b3EfA962e01cEeC9A36d181",
  //         "0x3272dE0CDBE2b6f755B54671F6567CEa29D6974f",
  //         "0xFeB2296C0c1e80ad9B4d19C48F8DBdeD415ff414",
  //         "0xBb8eB551B39f036586D268aE848F5555c5A7fA70",
  //         "0xb095832D608B16e2bcE0935B237782d2e0d8b016",
  //         "0x533A4fA2e3273e652bE0f0585347c61E792537a3",
  //         "0xBc31D09d4EAbC65BDa4436c24365F9b3DF7c9A9E",
  //         "0xd404AbC96E0cb26925D21F8Fe3232bB66B530098",
  //         "0x41EC2381aBEB5DC21Bb68F023fE44717C5051E1c",
  //         "0x1076A9290467e20184374f9B5437d4aDf9563C88",
  //         "0x48883f3b2AA5C1818441D19Cf7c5182ae40A240C",
  //         "0x99C317f223768b2EE53fa3f2102F449024A0CC58",
  //         "0x6fd4b7895ed831DE5585b74cDf8533B97e5F75d8",
  //         "0x183D4ef7aa1E1142746894464CBa434CFF399eEb",
  //         "0x283C4E4F2551A544F207a05df8914aCF67E9Ab1D",
  //         "0x283C4E4F2551A544F207a05df8914aCF67E9Ab1D",
  //         "0x6f8002C2c83E2a2991E6689a477012DF259fF81a",
  //         "0xC66CdfA6182Ef4A709e6161fd8AFC51Db2b3Bfa2",
  //         "0x40d6d0185Dd1EE8324Df3797150FA98883674Af7",
  //         "0x17CB3b553C68F9258A0aEB0f2F9b993804071734",
  //         "0x54adc8ad31110F962a62A9806D9fF7DCCe610899",
  //         "0xBd5293cD126f89241b3849034C90cb1D62dEc4f6",
  //         "0x12EC44DF29cd3D7bF91a4d4f55DdB90bcA86885b",
  //         "0xcd1613A35A99608b5D9318A6Ede7ae93E1F6Df12",
  //         "0x7369023024B2279BfF508b5b0dE7474Fa6DBfb82",
  //         "0xD02945eDCD52422f868Ba627d33503F246e5d773",
  //         "0x2547A3b21495Ac8BB9b33720f520d328f14ab085",
  //         "0x375E6Ef62D3dd2C570DC5D05657e9BdE353A8eaE",
  //         "0x968692474201E08A970adCBB4B6f4a316136A64D",
  //         "0x10e183f721E496227D302B00C9a8631eCEC1649d",
  //         "0x2a825446D41c7716711E17c7f83c939fA5C592Cf",
  //         "0x6fa9B57A5c6De4022cCA2628a379EbA563B8529D",
  //         "0x7EEF6d11aeC1B930E1Fd89A1758b280828522695",
  //         "0x635a9e05dEf9e603842478d97705028DE2cF933b",
  //         "0x74AA8f630fE2DfaA249cB44bc299F5Fd4f046cc5",
  //         "0x1FcD9f1EaA91f4F9Ccf941BE47f332A2f7ca33D3",
  //         "0xDf33FdfE0afAE17Fc325dC22d396A78E349f2B0c",
  //         "0xa38EE88Cc380FF4192C43215A93D39488633a7c3",
  //         "0xe03fD65CefD9Fb2a2dd2494468f1b362b39fCC20",
  //         "0x7ce361DEAC0F1EF9EdA257581819D8F3b0d65e56",
  //         "0xb83a6FDF52b5C584F5c7Be73451eEFf37c671BbC",
  //         "0xe4Cb50F001ce487a6E96bc0274B46E402510643b",
  //         "0x3Df3A90326Ca0Ff0f214825e28C33ca7ebcDA1A1",
  //         "0x3A9Aa2beDC3D58eb9f9A1A6F44FE8A47f17D9B88",
  //         "0x1e877E1771B22E9206EBEAb025972C47d4ca092d",
  //         "0x04b1812B8f7E96525B9A8A60afdF4B98fF9eb058",
  //         "0x23dBc3d60Fa367a711f6cf1a6224e875De37A14B",
  //         "0x2b617f273Ff1F109e6F5Cae60c9a2A74b3648d6c",
  //         "0xC0715C4FaB28E1D446194d5E39A2F01e49aDFaB4",
  //         "0x0fFBc47A558F8D4808Df51bEE8072e5682fFb7fc",
  //         "0x3F971815785d4469ba8A459086B6f445D6160113",
  //         "0x4ebF819f8f06Ef4F6eB6BCEeebBB657BADF73d51",
  //         "0xf4A3Bfdb88221FbDC34602a07e396CD6a853C2aC",
  //         "0xEC4C3d922983b036d941b19dbd54B9Ec7528226C",
  //         "0x2f3357a09302F4f3183E31ecDD07d6D80ed48c50",
  //         "0x69E0AdA3102ffE7B66e6e8369013ddB064F88298",
  //         "0x1D7eCAc31D3FA2f7F1F4B8b3302a2877C010bDcF",
  //         "0x4e40a7Fc10CAEfFF2A98B0a0b008e1398F7bb3aB",
  //         "0x899802034c1180760F320888E22AFA8045f98757",
  //         "0x506c7161553A6c36b86fE14C2e4DcFF198a97723",
  //         "0xd385ae2e5851f2992D59c97A6446c0a802b0d8D7",
  //         "0xD79E908e7387e3cd5DEcebDF57744c650459A615",
  //         "0x9b2cCE33Ae82596D84EB4E7f4d4F596a1803E9f0",
  //         "0xF7Abd4FABA653D0AC8aF83cbA28E63745eb4b6B4",
  //         "0x1D9b72d91eB1D0618BDCf2B2307BAe4942e2264E",
  //         "0x48FC5596b403b1300B1eEb605a13e2e0580f9998",
  //         "0x35f35DeF04FE254F0733aDC299Af56cF51213757",
  //         "0xDd83D9De300FCe6352D378dA289B592523065B68",
  //         "0xC4D3aaF10432d0faa9F66515A348eE6a77B336A0",
  //         "0x0F36FFf313259E3548855b279528Cd484d1235A2",
  //         "0xD4e0FF105756542543eAd33DA95C1d1147aEE1cd",
  //         "0xCbf4C9B9Cb001309a6F9950b40332a44Bcb3adc7",
  //         "0x9E04B09879648Ddc6223D6207b90630FbC44c7c4",
  //         "0xC345E77c7972C4e26F1Bc928Ed550b6eaEB8Ea96",
  //         "0x4dbF87C8fA0b33DD801eeB33ddc708A62f86BEd2",
  //         "0x026AD60684B36ad3c850C7C41f708b1bb7e8BC47",
  //         "0x672A657DEe87771AE04D9d9f589C3D6a6457D32e",
  //         "0x7b51c05b4CbA188C85721dC58bb8991f4f4b4F08",
  //         "0x2D8fE5674513b72fa8Ed1edD655c866756474101",
  //         "0xe10a7ba799017bce94cd60F74397d6EB43CDB222",
  //         "0xcca08997BF372b68B95BCeb36306d17b2Ac70Db2",
  //         "0x0e687b6D203B8BeafdF01b87aEcc05dAeDEa8d00",
  //         "0x75c18B9F758155475203A561E53D06Bc594a3e25",
  //         "0x5fdc3a51573017Eca70F9800794ea7A48eD7b4E3",
  //         "0x0c453f2006a61013C52e7b6B768828d13f905269",
  //         "0xAeb458DA6b1693C67E1FBC1c45E763aE4d4A8Cc0",
  //         "0xB099B6351733f7c2b2dA90fB24b8Da90280df326",
  //         "0xD3D4111aa8E3f3e60fc33df1E38699023A68F616",
  //         "0x200DfD9D8c950E8c16e1c46Da7De565C8cded7F0",
  //         "0xBd3B00144B9de3eF64441D920b184EB9529eDdCd",
  //         "0x1f9b767d17143ea3E0990966CFCAda00b8A58AAb",
  //         "0x600a076516ce3859Ae64452Eab5dC2FDD34cc3FF",
  //         "0xfCf83d435B7AdbC5C93cB55ac276CeEc5Ed34a87",
  //         "0xBB13d2c2ce8c0b73bA41b23eE3AA016C41847Eed",
  //         "0x3e6a64F3c4fcfc36d9c936F3e8430f2045fBe0C3",
  //         "0x0DbE7Ce8acEa2a2Ac094d17E58994424D22E8366",
  //         "0x086Ff59823C39401c1846F9FCb64A2Dea898C59c",
  //         "0x537B774c8e11CCb80ED9c43e0E9f4151F34c2bC4",
  //         "0x268cC45BCdB51bb4b01B35959937aF4c30658167",
  //         "0xA6F2D7f44974e97b3C9c23bA8AdCf74a9B8444ea",
  //         "0xF3C8cec86706640392e2A701C7194d900372163F",
  //         "0x4eBea9de603B98065B8943AAca343D2eB3B975bE",
  //         "0x085ebaD5843BB9208367254ba952A1c8aed8A9C1",
  //         "0xB55d1ddc71030DF579C265371Bc4BA5F20554A5f",
  //         "0xcb037a2E3BfA212782de1A7d6cBC154005E63dFf",
  //         "0xC79b6A37A15b204ff8C3C264f887164F25EfA6cE",
  //         "0x3f5a1F57e5260674256f7b7487C426F64E67596b",
  //         "0xad7E3e85c05E9603c7a0fEB99074B542729f803D",
  //         "0x8212bd59ddD6eA7E0889643A80de6d1847BaF3b5",
  //         "0x00B6080db48b5B6876219556785615825D9179B4",
  //         "0xBE79fEbf7fb2884c6dE5c179c44522eA8b4CC899",
  //         "0x4B6e2249ec6B5033047679a4110F8Daf8f2E6441",
  //         "0x221cd47190620CC01c20eF2c9cd68D14fe3CcaB0",
  //         "0x3e76d77E48a7A1327Ad3ebcb2D0B8a33b71897dE",
  //         "0xB52892B40983a02E62Ed751cBb125f1Eb92f3bdD",
  //         "0x870E3bffA2886438B3B982477e652Bf7F0A5F9d0",
  //         "0x001791aC7ca6755c74091b9d705c6b2d8b4d6A46",
  //         "0x0063F559F4e7c8A2c537798b4163e5a39a2d3C3c",
  //         "0x2916147333cFacFFE2724C54a4933A4305444c9F",
  //         "0xbD22Bb9Bb4f86be64A6388C83dc58Dd29B5Ade64",
  //         "0x82807B78eAd9bB1221A71c086Ff68E3EEd71a4E2",
  //         "0x788458Bf1ea8b696b2998332e8Bf7D8294713Bdb",
  //         "0x54eaDA92b711F1101bC5b03a8fe12E1181C41A15",
  //         "0xA73682E3470C82d46520d02359380Bdc19604FBD",
  //         "0x2AAb6E7a7206f804B8D4D4a72fFf1090C9c6eD66",
  //         "0xD7c36aa0ADDA0636E93ad07282477b366917C5F0",
  //         "0x7e329701EE24BfE9DdC172EA5f29Cd4d3a09F172",
  //         "0x9CAd0A2ad4aD12c66A07f624220b33283268Da2D",
  //         "0x89096a144840C658Ae202Ce82cb5AB5666eF4046",
  //         "0xEeDa5929ECe614A12e2f16375B8b99d25E9cA59a",
  //         "0x6ce884b279DFf42b24B95E4aAF28265b543294c0",
  //         "0x67cb0A8FCC572141eE3e00C12b62f3686A3a11EF",
  //         "0x9F64f48AFB2CdbA50Fe55972D4322c42A1DCc791",
  //         "0x1F08DDcA8c022C2573b429DB4ce116cD34A0f914",
  //         "0x9E70e4ED0f41914B04d3a2392D3b00151154d62e",
  //         "0xef43aD1e28c2b4732f28Dc85385CFE33D8e88cB4",
  //         "0x2acCc0C67b290725E33f55dD895dF683DC9c52FE",
  //         "0x63367138a8e2A1E06AD32D2752F77D5e7D4ed068",
  //         "0xAf27ad187a2B7a5170C217D30285D7171418598e",
  //         "0xE1fF70E4fF30d9fC47aD755C3eBB84A545e0E2b2",
  //         "0x7311dEce86B7628Ed59A3d8E70253190c52527AB",
  //         "0x246d2e0B27FFcF5B6a10e51D9a97EeC0fcbc048F",
  //         "0x42B6A7065F97fd2aF0a86254734db60983500dCA",
  //         "0xd9BFc7e71572bB4C4F39E47E7eFFae1a6d8ABA7F",
  //         "0x6aA18D61920de7221e9344474b06206244b0dFD9",
  //         "0xaBbC653Ad59Efd8FE1B7aA421b5Ca0acd4e44990",
  //         "0xB853225ac0f003bF51C274C2B0535749a91EB929",
  //         "0x9f4e7E7AfF77a5d15a461a044f4468263f791167",
  //         "0x541c9E444A9FF8F75fcea26e8edCe0Cd2cF2f48E",
  //         "0xAa49E3D074835d4A4993e7c0840DbbCD685dD8DA",
  //         "0x45331133c5AFCCbF4cC333f80f8C243A8a84a771",
  //         "0xa7e6fE3cFa2314b7725D7b96DD35ee571c79CBaE",
  //         "0xDd9143570bbd5Fe6682a2068f61Bd837C284d803",
  //         "0x57f8d8128976E2FA0682713A633bC5E2E43481dD",
  //         "0xbbbf9a813E9fa13eC7d4bA4AFAFb2648755de629",
  //         "0x3D5b7D4B442d4D95A155dF6CB609CCCfF4D73f10",
  //         "0x81446849Ec123f8fd6E1647Ba437A5C10bccCBF1",
  //         "0x6Ff0BeEfb5aDC3AFbFDCecA2bee5208428c89873",
  //         "0xcCA654d4F185F7B78D0275F1D83Cc7A87E604C21",
  //         "0x3762C9FF84cED955b839b84FF4e95Ebc8b009957",
  //         "0xCe2f34A295Fc635d20D2cE5B2165F61094197A06",
  //         "0xF456F148178711fb05fF283f177EF8103414257D",
  //         "0xe3A056e5afc74A07Ea46834c4e137AbB354b1b67",
  //         "0xc41A382a8e5cc2A3c387c193FF59d8153164d1EE",
  //         "0xA6a5f0aC896c814c5B8A6C40050f1CCE1Ef706D1",
  //         "0xA05A23379c225bD8B3a01A83D23DeEFA06Bd80a8",
  //         "0x9ff9578D1582Cb9Aacd26a1d2923365ea37d20C8",
  //         "0xd3A592c78F9c3790433937bE9d65cF83cfbBa4A5",
  //         "0x4211996D3e47270FeddE2932211857DBc1f10B1f",
  //         "0x5cDD3E86211e59Cacf4833E130fEAB823636097d",
  //         "0xA914A210851368CB44b01Ea1549DE6B3F7Df064B",
  //         "0xce11FFf00C7BBB154506c8B4B08ACaba834FbAEE",
  //         "0x0776E27a1840EF8b3212427595C22CcfeA84AAFF",
  //       ];

  //       const leaves = WHITELIST_SALE_WHITELIST.map((x) => keccak256(x));
  //       const tree = new MerkleTree(leaves, keccak256, { sortPairs: true });
  //       const buf2hex = (x) => "0x" + x.toString("hex");

  //       const leaf = keccak256(address);
  //       const proof = tree.getProof(leaf).map((x) => buf2hex(x.data));

  //       if (WHITELIST_SALE_WHITELIST.indexOf(address) !== -1) {
  //         contract.methods
  //           .publicSaleMint(value)
  //           .send({ gasLimit: "300000", from: address, value: bntokens })
  //           .then((nft) => {
  //             alert(
  //               "Congratulations you have successfully minted! Check Opensea."
  //             );

  //             contract.methods
  //               .totalSupply()
  //               .call()
  //               .then((response) => {
  //                 setTotalMinted(response);
  //               })
  //               .catch((err) => {
  //                 console.log(err);
  //               });

  //             console.log(nft);
  //           })
  //           .catch((err) => {
  //             console.log(err);
  //           });
  //       } else {
  //         alert("You are not whitelisted.");
  //       }
  //     } else {
  //       window.open(
  //         `https://metamask.app.link/dapp/mint.dangerousdonkeyclub.com${pagelocation}`
  //       );
  //     }
  //   } else {
  //     alert("Please choose quantity");
  //   }
  // };

  const mint = async () => {
    if (value > 0) {
      if (Web3.givenProvider) {
        connectWallet();

        const web3 = new Web3(Web3.givenProvider);
        await Web3.givenProvider.enable();

        const price = 55 * value;
        var tokens = web3.utils.toWei(price.toString());
        var bntokens = web3.utils.toBN(tokens);

        const contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);

        const addresses = await web3.eth.getAccounts();
        const address = addresses[0];

        contract.methods
          .publicSaleMint(value)
          .send({ gasLimit: "200000", from: address, value: bntokens })
          .then((nft) => {
            alert(
              "Congratulations you have successfully Minted Dangerous Donkey Club! Check Opensea."
            );

            contract.methods
              .totalSupply()
              .call()
              .then((response) => {
                setTotalMinted(response);
              })
              .catch((err) => {
                console.log(err);
              });

            console.log(nft);
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        window.open(
          `https://metamask.app.link/dapp/mint.dangerousdonkeyclub.com${pagelocation}`
        );
      }
    } else {
      alert("Please choose quantity");
    }
  };

  return (
    <section className="mint" data-aos="flip-right">
      <div className="container">
        <div className="mint-box">
          <div className="total-minted">
            <p>TOTAL MINTED: {totalMinted} / 5555</p>
            <p>MINT PRICE 55 MATIC</p>
            <p>MAX 4 DDC NFTs PER WALLET</p>
          </div>
          <div className="gas">
            <span
              className="minus"
              onClick={() => {
                if (value > 1) {
                  setValue(value - 1);
                }
              }}
            >
              -
            </span>
            <span className="value">{value}</span>
            <span
              className="plus"
              onClick={() => {
                if (value < 4) {
                  setValue(value + 1);
                }
              }}
            >
              +
            </span>
          </div>

          <div className="connect-mint-btn">
            <button
              className=""
              onClick={walletConnected ? mint : connectWallet}
            >
              {walletConnected ? "Mint" : "Connect Wallet"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Mint;
