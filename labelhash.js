
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
require('dotenv').config()
import { createPublicClient, http } from 'viem'
import { goerli } from 'viem/chains'
import { namehash, normalize } from 'viem/ens'
import { hashMessage } from 'viem'
import { ethers } from 'ethers'

const client = createPublicClient({
  chain: goerli,
  transport: http('https://eth-goerli.g.alchemy.com/v2/' + process.env.ALCHEMY_KEY_GOERLI),
})

let query = '🧃🧃🧃🧃.eth'

// NODE
let __labelhash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(query.split('.eth')[0]))
console.log('              Name:', query)
console.log('(ethers) Labelhash:', __labelhash)
console.log('  (ethers) TokenID:', String(ethers.BigNumber.from(__labelhash)))

const viemHash = namehash(normalize(query.split('.eth')[0]))
//console.log('    (viem) TokenID:', viemHash)
//console.log('  (viem) Labelhash:', String(ethers.BigNumber.from(viemHash)))

const ensAddress = await client.getEnsAddress({
  name: normalize(query),
})

