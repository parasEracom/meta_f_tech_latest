import { ethers } from "ethers";
import ContractDetails from "../Contracts/ContractDetails";

export default async function GetUSDTBalance(id) {
  console.log("id",id);
  const { ethereum } = window;
  if (ethereum) {
    try {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const contractinstance = new ethers.Contract(
        ContractDetails.BUSD,
        ContractDetails.BUSD_ABI,
        signer
      );
      // console.log( contractinstance)
      const bl = await contractinstance.balanceOf(id);
      return bl/1e18;
    } catch (e) {
      console.log("GetBalance", e);
    }
  }
}
