#![no_std]

elrond_wasm::imports!();
use elrond_wasm::types::heap::String;

const HASH_LENGTH: usize = 32;
const SIGNATURE_LENGTH: usize = 64;

#[elrond_wasm::contract]
pub trait TestSign {
    #[init]
    fn init(
        &self
    ) { }
    //test function 
    #[endpoint]
    fn test_agreement(
        &self,
        // data: ManagedBuffer, 
        signature: ManagedByteArray<Self::Api, SIGNATURE_LENGTH>
    ) {
        let caller: ManagedAddress = self.blockchain().get_caller();

        let caller_hash = self.crypto().keccak256(caller.as_managed_buffer());
        let prefix = String::from("\x17Elrond Signed Message:\n");
        let len_buffer = BigUint::from(32u32);
        
        let mut buffer_to_hash = ManagedBuffer::new();

        buffer_to_hash.append(&ManagedBuffer::new_from_bytes(&prefix.as_bytes()));
        buffer_to_hash.append(&len_buffer.to_bytes_be_buffer());
        buffer_to_hash.append(&caller_hash.as_managed_buffer());
        buffer_to_hash.append(&caller.as_managed_buffer());

        let buffer_hash = self.crypto().keccak256(buffer_to_hash);

        require!(
            self.crypto().verify_ed25519_legacy_managed::<HASH_LENGTH>(&caller.as_managed_byte_array(), &buffer_hash.as_managed_buffer(), &signature),
                "_safeCheckAgreement: invalid data signature"
        );
        
        self.serialized_data().set(buffer_hash);

    }
    
    #[view(getSerializedData)]
    #[storage_mapper("getSerializedData")]
    fn serialized_data(&self) -> SingleValueMapper<ManagedAddress>;

    
}
