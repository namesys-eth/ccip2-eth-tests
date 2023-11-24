import { ethers } from 'ethers'
import { Utils } from 'alchemy-sdk'
import * as Name from 'w3name'
import * as Nam3 from '@namesys-eth/w3name-client'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
require('dotenv').config()

//const name = Name.parse('k51qzi5uqu5dkhwahkvg6b4gxu1wwlco85azpyqetusvtp451yvwugudmm0t7e');
//const revision = await Name.resolve(name);
//console.log('       IPFS:', revision.value);

const provider = new ethers.providers.AlchemyProvider("mainnet", process.env.ALCHEMY_KEY_MAINNET)
let domain = 'freetib.eth'
console.log('       Name:', domain)
const resolver = await provider.getResolver(domain)
console.log('   Resolver:', resolver.address)



