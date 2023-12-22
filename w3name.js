import { ethers } from 'ethers'
import { Utils } from 'alchemy-sdk'
import * as Name from 'w3name'
import * as Nam3 from '@namesys-eth/w3name-client'
import keygen from './keygen.js'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
require('dotenv').config()

const __keypair = await keygen.KEYGEN(
    'domain.eth', 
    'eip155:1:0xc37AEcd2708cB95E3248f868DeC8471141314c60', 
    '0x5113872989311676ef678f5656973f6be13c07d8132b989cf8032b7c8afa3e7d3167b9acc8af0a60bf5c0c60687c4fea1a040e49583bfc67360de42d3e6d319a1b', 
    '0'
)
console.log(__keypair[0])

//const name = Name.parse('k51qzi5uqu5dkhwahkvg6b4gxu1wwlco85azpyqetusvtp451yvwugudmm0t7e');
//const revision = await Name.resolve(name);
//console.log('       IPFS:', revision.value);
/*
const provider = new ethers.providers.AlchemyProvider("mainnet", process.env.ALCHEMY_KEY_MAINNET)
let domain = 'freetib.eth'
console.log('       Name:', domain)
const resolver = await provider.getResolver(domain)
console.log('   Resolver:', resolver.address)
*/


