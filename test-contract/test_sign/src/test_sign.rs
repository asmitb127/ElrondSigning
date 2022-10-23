#![no_std]

elrond_wasm::imports!();

const HASH_LENGTH: usize = 32;
const SIGNATURE_LENGTH: usize = 64;

#[elrond_wasm::contract]
pub trait TestSign {

    //test function 
    #[endpoint]
    fn test_agreement(
        &self,
        data: ManagedBuffer, 
        signature: ManagedByteArray<Self::Api, SIGNATURE_LENGTH>
    ) {
        let caller: ManagedAddress = self.blockchain().get_caller();

        require!(
            self.crypto().verify_ed25519_legacy_managed::<HASH_LENGTH>(&caller.as_managed_byte_array(), &data, &signature),
                "_safeCheckAgreement: invalid data signature"
        );

        
    }

}
