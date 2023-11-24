import { ethers } from 'ethers'
import { Utils } from 'alchemy-sdk'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
require('dotenv').config()
//const key = process.env['PRIVATE_KEY']

async function getOwner(provider, name) {
  const ensAddr = (await provider.getNetwork()).ensAddress
  const ensAbi = ["function owner(bytes32) view returns (address)"]
  const contract = new ethers.Contract(ensAddr, ensAbi, provider)
  const addr = await contract.owner(ethers.utils.namehash(name))
  if (addr === ethers.constants.AddressZero) { return null }
  return addr
}

async function resolve(provider, name) {
  const resolver = '0x4697b8672ceAe60E130BD39435cAb9eD7C630c81'
  const ABI = ["function resolve(bytes name, bytes data) public view returns (bytes)"]
  const contract = new ethers.Contract(resolver, ABI, provider)
  const bytes4 = ethers.utils.id("addr(bytes32)").toString('hex').substring(0, 10)
  const calldata = ethers.utils.solidityPack(
    ['bytes4', 'bytes32'],
    [bytes4, ethers.utils.namehash(name)]
  )
  console.log('dnsEncode():', Utils.dnsEncode(name))
  console.log('Calldata:', calldata)
  const addr = await contract.resolve(Utils.dnsEncode(name), calldata)
  if (addr === ethers.constants.AddressZero) { return null }
  return addr
}

const provider = new ethers.providers.AlchemyProvider("mainnet", process.env.ALCHEMY_KEY_MAINNET)

let domain = 'freetib.eth'
console.log('       Name:', domain)
//const owner = await getOwner(provider, domain)
//const _resolve = await resolve(provider, domain)
//console.log('    Manager:', owner)
//console.log('   Namehash:', ethers.utils.namehash(domain))
const resolver = await provider.getResolver(domain)
console.log('   Resolver:', resolver.address)
const addr60 = await provider.resolveName(domain)
console.log('     Addr60:', addr60)
//const addr__ = await resolver.getAddress()
//console.log('     Addr__:', addr__)
const Avatar = await resolver.getText('avatar')
console.log('     Avatar:', Avatar)
const contenthash = await resolver.getContentHash()
console.log(' Contenhash:', contenthash)
const RSA = await resolver.getText('rsa')
console.log('        RSA:', RSA)
const stealth = await resolver.getText('stealth')
console.log('    Stealth:', stealth)


