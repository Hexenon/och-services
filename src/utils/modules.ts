




type BaseFields = {
    blockchain: string,
    protocol: string,
    amount: number,
}

type OrbiterFields = {
    source_chain: string,
    source_protocol: string,
} & BaseFields

type ModuleConfig = { name: 'Orbiter', fields: OrbiterFields } | { name: 'Wallet', fields: BaseFields }