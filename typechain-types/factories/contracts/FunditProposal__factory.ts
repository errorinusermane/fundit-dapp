/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Contract,
  ContractFactory,
  ContractTransactionResponse,
  Interface,
} from "ethers";
import type { Signer, ContractDeployTransaction, ContractRunner } from "ethers";
import type { NonPayableOverrides } from "../../common";
import type {
  FunditProposal,
  FunditProposalInterface,
} from "../../contracts/FunditProposal";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "proposalId",
        type: "uint256",
      },
    ],
    name: "ProposalClosed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "proposalId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "proposer",
        type: "address",
      },
    ],
    name: "ProposalCreated",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_proposalId",
        type: "uint256",
      },
    ],
    name: "closeProposal",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_title",
        type: "string",
      },
      {
        internalType: "string",
        name: "_description",
        type: "string",
      },
      {
        internalType: "string[]",
        name: "_mandatoryRequirements",
        type: "string[]",
      },
      {
        internalType: "string[]",
        name: "_enrollmentConditions",
        type: "string[]",
      },
      {
        internalType: "string[]",
        name: "_optionalFeatures",
        type: "string[]",
      },
      {
        internalType: "uint256",
        name: "_desiredStartDate",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_minPremium",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_maxPremium",
        type: "uint256",
      },
    ],
    name: "createProposal",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getActiveProposals",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "id",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "proposer",
            type: "address",
          },
          {
            internalType: "string",
            name: "title",
            type: "string",
          },
          {
            internalType: "string",
            name: "description",
            type: "string",
          },
          {
            internalType: "string[]",
            name: "mandatoryRequirements",
            type: "string[]",
          },
          {
            internalType: "string[]",
            name: "enrollmentConditions",
            type: "string[]",
          },
          {
            internalType: "string[]",
            name: "optionalFeatures",
            type: "string[]",
          },
          {
            internalType: "uint256",
            name: "desiredStartDate",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "minPremium",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "maxPremium",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "createdAt",
            type: "uint256",
          },
          {
            internalType: "enum FunditProposal.ProposalStatus",
            name: "status",
            type: "uint8",
          },
          {
            internalType: "uint256",
            name: "bidCount",
            type: "uint256",
          },
        ],
        internalType: "struct FunditProposal.Proposal[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_proposalId",
        type: "uint256",
      },
    ],
    name: "getProposal",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "id",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "proposer",
            type: "address",
          },
          {
            internalType: "string",
            name: "title",
            type: "string",
          },
          {
            internalType: "string",
            name: "description",
            type: "string",
          },
          {
            internalType: "string[]",
            name: "mandatoryRequirements",
            type: "string[]",
          },
          {
            internalType: "string[]",
            name: "enrollmentConditions",
            type: "string[]",
          },
          {
            internalType: "string[]",
            name: "optionalFeatures",
            type: "string[]",
          },
          {
            internalType: "uint256",
            name: "desiredStartDate",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "minPremium",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "maxPremium",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "createdAt",
            type: "uint256",
          },
          {
            internalType: "enum FunditProposal.ProposalStatus",
            name: "status",
            type: "uint8",
          },
          {
            internalType: "uint256",
            name: "bidCount",
            type: "uint256",
          },
        ],
        internalType: "struct FunditProposal.Proposal",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getProposalCount",
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
    inputs: [
      {
        internalType: "address",
        name: "_user",
        type: "address",
      },
    ],
    name: "getProposalsByUser",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "id",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "proposer",
            type: "address",
          },
          {
            internalType: "string",
            name: "title",
            type: "string",
          },
          {
            internalType: "string",
            name: "description",
            type: "string",
          },
          {
            internalType: "string[]",
            name: "mandatoryRequirements",
            type: "string[]",
          },
          {
            internalType: "string[]",
            name: "enrollmentConditions",
            type: "string[]",
          },
          {
            internalType: "string[]",
            name: "optionalFeatures",
            type: "string[]",
          },
          {
            internalType: "uint256",
            name: "desiredStartDate",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "minPremium",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "maxPremium",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "createdAt",
            type: "uint256",
          },
          {
            internalType: "enum FunditProposal.ProposalStatus",
            name: "status",
            type: "uint8",
          },
          {
            internalType: "uint256",
            name: "bidCount",
            type: "uint256",
          },
        ],
        internalType: "struct FunditProposal.Proposal[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_proposalId",
        type: "uint256",
      },
    ],
    name: "incrementBidCount",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "proposals",
    outputs: [
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "proposer",
        type: "address",
      },
      {
        internalType: "string",
        name: "title",
        type: "string",
      },
      {
        internalType: "string",
        name: "description",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "desiredStartDate",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "minPremium",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "maxPremium",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "createdAt",
        type: "uint256",
      },
      {
        internalType: "enum FunditProposal.ProposalStatus",
        name: "status",
        type: "uint8",
      },
      {
        internalType: "uint256",
        name: "bidCount",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "userProposals",
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
] as const;

const _bytecode =
  "0x608080604052346015576114dd908161001b8239f35b600080fdfe6080604052600436101561001257600080fd5b60003560e01c8063013cf08b14610d895780630386a01614610c855780631add18f414610ba95780631b31527f14610b505780635584c4f914610a3f5780635f250fe414610a0d578063c08cc02d146109ef578063c4b65197146100d15763c7f758a81461007f57600080fd5b346100cc5760203660031901126100cc5761009861127f565b5060043560005260016020526100c86100b4604060002061139f565b604051918291602083526020830190611031565b0390f35b600080fd5b346100cc576101003660031901126100cc576004356001600160401b0381116100cc57610102903690600401611194565b6024356001600160401b0381116100cc57610121903690600401611194565b906044356001600160401b0381116100cc57610141903690600401611201565b6064356001600160401b0381116100cc57610160903690600401611201565b6084356001600160401b0381116100cc5761017f903690600401611201565b9161018b60005461146b565b948560005585600052600160205260406000209486865560018601336bffffffffffffffffffffffff60a01b82541617905560028601908051906001600160401b0382116103c4576101dd8354610e59565b601f81116109bd575b50602090601f83116001146109565761021892916000918361094b575b50508160011b916000199060031b1c19161790565b90555b805160038601916001600160401b0382116103c45761023a8354610e59565b601f8111610919575b50602090601f83116001146108b2576102749291600091836108a75750508160011b916000199060031b1c19161790565b90555b80516004850191600160401b82116103c4578254828455808310610829575b50602001916000526020600020916000905b82821061071157505050506005830190805190600160401b82116103c4578254828455808310610693575b50602001916000526020600020916000905b82821061057b57505050506006820190805190600160401b82116103c45782548284558083106104fd575b50602001916000526020600020916000905b8282106103da57856000600c8760a435600782015560c435600882015560e435600982015542600a820155600b810160ff198154169055015533600052600260205260406000208054600160401b8110156103c45761038691600182018155611166565b81549060031b9083821b91600019901b191617905533907fcd423cc1203c0af96b9b3d68d73b3064a69de2d14450bb7181c5e5df2132b358600080a3005b634e487b7160e01b600052604160045260246000fd5b80518051906001600160401b0382116103c4576103f78654610e59565b601f81116104c0575b50602090601f83116001146104535792610439836001959460209487966000926104485750508160011b916000199060031b1c19161790565b87555b01940191019092610322565b015190508c80610203565b90601f1983169187600052816000209260005b8181106104a8575093602093600196938796938388951061048f575b505050811b01875561043c565b015160001960f88460031b161c191690558b8080610482565b92936020600181928786015181550195019301610466565b6104ed90876000526020600020601f850160051c810191602086106104f3575b601f0160051c0190611490565b88610400565b90915081906104e0565b8360005282602060002091820191015b81811061051a5750610310565b8061052760019254610e59565b80610534575b500161050d565b601f8111831461054a5750600081555b8861052d565b610568908260005283601f6020600020920160051c82019101611490565b8060005260006020812081835555610544565b80518051906001600160401b0382116103c4576105988654610e59565b601f8111610661575b50602090601f83116001146105f457926105da836001959460209487966000926105e95750508160011b916000199060031b1c19161790565b87555b019401910190926102e5565b015190508d80610203565b90601f1983169187600052816000209260005b8181106106495750936020936001969387969383889510610630575b505050811b0187556105dd565b015160001960f88460031b161c191690558c8080610623565b92936020600181928786015181550195019301610607565b61068d90876000526020600020601f850160051c810191602086106104f357601f0160051c0190611490565b896105a1565b8360005282602060002091820191015b8181106106b057506102d3565b806106bd60019254610e59565b806106ca575b50016106a3565b601f811183146106e05750600081555b896106c3565b6106fe908260005283601f6020600020920160051c82019101611490565b80600052600060208120818355556106da565b80518051906001600160401b0382116103c45761072e8654610e59565b601f81116107f7575b50602090601f831160011461078a57926107708360019594602094879660009261077f5750508160011b916000199060031b1c19161790565b87555b019401910190926102a8565b015190508e80610203565b90601f1983169187600052816000209260005b8181106107df57509360209360019693879693838895106107c6575b505050811b018755610773565b015160001960f88460031b161c191690558d80806107b9565b9293602060018192878601518155019501930161079d565b61082390876000526020600020601f850160051c810191602086106104f357601f0160051c0190611490565b8a610737565b8360005282602060002091820191015b8181106108465750610296565b8061085360019254610e59565b80610860575b5001610839565b601f811183146108765750600081555b8a610859565b610894908260005283601f6020600020920160051c82019101611490565b8060005260006020812081835555610870565b015190508980610203565b90601f1983169184600052816000209260005b81811061090157509084600195949392106108e8575b505050811b019055610277565b015160001960f88460031b161c191690558880806108db565b929360206001819287860151815501950193016108c5565b61094590846000526020600020601f850160051c810191602086106104f357601f0160051c0190611490565b88610243565b015190508a80610203565b90601f1983169184600052816000209260005b8181106109a5575090846001959493921061098c575b505050811b01905561021b565b015160001960f88460031b161c1916905589808061097f565b92936020600181928786015181550195019301610969565b6109e990846000526020600020601f850160051c810191602086106104f357601f0160051c0190611490565b896101e6565b346100cc5760003660031901126100cc576020600054604051908152f35b346100cc5760203660031901126100cc576004356000526001602052600c604060002001610a3b815461146b565b9055005b346100cc5760003660031901126100cc57600080549060015b82811115610b095750610a6a906112e3565b60009160015b81811115610a8657604051806100c88582611106565b80600052600160205260ff600b6040600020015416906003821015610af357610ab39115610ab85761146b565b610a70565b806000526001602052610aed604060002095610adc610ad68261146b565b9761139f565b610ae68288611333565b5285611333565b5061146b565b634e487b7160e01b600052602160045260246000fd5b80600052600160205260ff600b60406000200154166003811015610af35715610b3b575b610b369061146b565b610a58565b90610b48610b369161146b565b919050610b2d565b346100cc5760403660031901126100cc57610b69610fc2565b6001600160a01b03166000908152600260205260409020805460243591908210156100cc57602091610b9a91611166565b90549060031b1c604051908152f35b346100cc5760203660031901126100cc576001600160a01b03610bca610fc2565b16600052600260205260406000206040518082602082945493848152019060005260206000209260005b818110610c6c575050610c0992500382610eaf565b610c1381516112e3565b9060005b8151811015610c5e5780610c2d60019284611333565b5160005281602052610c42604060002061139f565b610c4c8286611333565b52610c578185611333565b5001610c17565b604051806100c88582611106565b8454835260019485019486945060209093019201610bf4565b346100cc5760203660031901126100cc57600435600081815260016020819052604090912001546001600160a01b03163303610d5557806000526001602052600b60406000200160ff8154166003811015610af357610d1057805460ff191660011790557f887777ccf43690541bed9e00b10d0fccfa7520b11875f09847a57b3085d8ab92600080a2005b60405162461bcd60e51b815260206004820152601b60248201527f416c726561647920636c6f736564206f722063616e63656c6c656400000000006044820152606490fd5b60405162461bcd60e51b815260206004820152600c60248201526b2737ba10383937b837b9b2b960a11b6044820152606490fd5b346100cc5760203660031901126100cc5760043560005260016020526040600020805460018060a01b0360018301541691610dc660028201610ed0565b610e4f610dd560038401610ed0565b926007810154936008820154600983015490610e2f600a85015493610e21600c60ff600b89015416970154986040519c8d9c8d5260208d015261014060408d01526101408c0190610f74565b908a820360608c0152610f74565b96608089015260a088015260c087015260e0860152610100850190610fb5565b6101208301520390f35b90600182811c92168015610e89575b6020831014610e7357565b634e487b7160e01b600052602260045260246000fd5b91607f1691610e68565b6101a081019081106001600160401b038211176103c457604052565b90601f801991011681019081106001600160401b038211176103c457604052565b9060405191826000825492610ee484610e59565b8084529360018116908115610f525750600114610f0b575b50610f0992500383610eaf565b565b90506000929192526020600020906000915b818310610f36575050906020610f099282010138610efc565b6020919350806001915483858901015201910190918492610f1d565b905060209250610f0994915060ff191682840152151560051b82010138610efc565b919082519283825260005b848110610fa0575050826000602080949584010152601f8019910116010190565b80602080928401015182828601015201610f7f565b906003821015610af35752565b600435906001600160a01b03821682036100cc57565b9080602083519182815201916020808360051b8301019401926000915b83831061100457505050505090565b9091929394602080611022600193601f198682030187528951610f74565b97019301930191939290610ff5565b908151815260018060a01b036020830151166020820152610180806110bb6110a961109761108561107360408901516101a060408a01526101a0890190610f74565b606089015188820360608a0152610f74565b60808801518782036080890152610fd8565b60a087015186820360a0880152610fd8565b60c086015185820360c0870152610fd8565b9360e081015160e08501526101008101516101008501526101208101516101208501526101408101516101408501526110fe610160820151610160860190610fb5565b015191015290565b602081016020825282518091526040820191602060408360051b8301019401926000915b83831061113957505050505090565b9091929394602080611157600193603f198682030187528951611031565b9701930193019193929061112a565b805482101561117e5760005260206000200190600090565b634e487b7160e01b600052603260045260246000fd5b81601f820112156100cc578035906001600160401b0382116103c457604051926111c8601f8401601f191660200185610eaf565b828452602083830101116100cc57816000926020809301838601378301015290565b6001600160401b0381116103c45760051b60200190565b9080601f830112156100cc578135611218816111ea565b926112266040519485610eaf565b81845260208085019260051b820101918383116100cc5760208201905b83821061125257505050505090565b81356001600160401b0381116100cc5760209161127487848094880101611194565b815201910190611243565b6040519061128c82610e93565b6000610180838281528260208201526060604082015260608082015260606080820152606060a0820152606060c08201528260e0820152826101008201528261012082015282610140820152826101608201520152565b906112ed826111ea565b6112fa6040519182610eaf565b828152809261130b601f19916111ea565b019060005b82811061131c57505050565b60209061132761127f565b82828501015201611310565b805182101561117e5760209160051b010190565b908154611353816111ea565b926113616040519485610eaf565b818452602084019060005260206000206000915b8383106113825750505050565b60016020819261139185610ed0565b815201920192019190611375565b906040516113ac81610e93565b8254815260018301546001600160a01b031660208201529182906113d260028201610ed0565b60408301526113e360038201610ed0565b60608301526113f460048201611347565b608083015261140560058201611347565b60a083015261141660068201611347565b60c0830152600781015460e083015260088101546101008301526009810154610120830152600a81015461014083015260ff600b820154166003811015610af35761018091600c916101608501520154910152565b600019811461147a5760010190565b634e487b7160e01b600052601160045260246000fd5b81811061149b575050565b6000815560010161149056fea2646970667358221220adcc0b71d89ec7202144dfbe19d25f0f2eee126c71053e7e35073836ccaca99a64736f6c634300081a0033";

type FunditProposalConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: FunditProposalConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class FunditProposal__factory extends ContractFactory {
  constructor(...args: FunditProposalConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override getDeployTransaction(
    overrides?: NonPayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(overrides || {});
  }
  override deploy(overrides?: NonPayableOverrides & { from?: string }) {
    return super.deploy(overrides || {}) as Promise<
      FunditProposal & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): FunditProposal__factory {
    return super.connect(runner) as FunditProposal__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): FunditProposalInterface {
    return new Interface(_abi) as FunditProposalInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): FunditProposal {
    return new Contract(address, _abi, runner) as unknown as FunditProposal;
  }
}
